"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, scramble } from "@/lib/gsap";

const COLORS = ["#ff3e7a", "#8c8aff", "#ffb48f", "#f3eee6"];

// Page-wide extras: click sparks, card tilt + glare, eyebrow scrambles.
export default function Effects() {
  const layer = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const cleanups = [];

    // Click sparks.
    if (!reduce) {
      const burst = (e) => {
        const ring = document.createElement("span");
        ring.className = "spark-ring";
        ring.style.left = e.clientX + "px";
        ring.style.top = e.clientY + "px";
        layer.current.appendChild(ring);
        gsap.fromTo(
          ring,
          { xPercent: -50, yPercent: -50, scale: 0, opacity: 1 },
          { scale: 3, opacity: 0, duration: 0.7, ease: "expo.out", onComplete: () => ring.remove() }
        );
        for (let i = 0; i < 14; i++) {
          const s = document.createElement("span");
          s.className = "spark";
          s.textContent = i % 3 ? "✦" : "●";
          s.style.color = COLORS[i % COLORS.length];
          s.style.left = e.clientX + "px";
          s.style.top = e.clientY + "px";
          layer.current.appendChild(s);
          const a = (i / 14) * Math.PI * 2 + gsap.utils.random(-0.3, 0.3);
          const d = gsap.utils.random(50, 140);
          gsap.fromTo(
            s,
            { xPercent: -50, yPercent: -50, x: 0, y: 0, scale: gsap.utils.random(0.6, 1.5), opacity: 1 },
            {
              x: Math.cos(a) * d,
              y: Math.sin(a) * d + 30,
              rotate: gsap.utils.random(-220, 220),
              scale: 0,
              opacity: 0,
              duration: gsap.utils.random(0.7, 1.1),
              ease: "expo.out",
              onComplete: () => s.remove(),
            }
          );
        }
      };
      window.addEventListener("pointerdown", burst);
      cleanups.push(() => window.removeEventListener("pointerdown", burst));
    }

    // Tilt + glare on anything marked data-tilt.
    if (fine && !reduce) {
      document.querySelectorAll("[data-tilt]").forEach((el) => {
        gsap.set(el, { transformPerspective: 900 });
        const rx = gsap.quickTo(el, "rotationX", { duration: 0.6, ease: "power3" });
        const ry = gsap.quickTo(el, "rotationY", { duration: 0.6, ease: "power3" });
        const move = (e) => {
          const r = el.getBoundingClientRect();
          const nx = (e.clientX - r.left) / r.width;
          const ny = (e.clientY - r.top) / r.height;
          ry((nx - 0.5) * 14);
          rx(-(ny - 0.5) * 10);
          el.style.setProperty("--mx", `${nx * 100}%`);
          el.style.setProperty("--my", `${ny * 100}%`);
        };
        const leave = () => {
          rx(0);
          ry(0);
        };
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        cleanups.push(() => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", leave);
        });
      });
    }

    // Eyebrows decode as they enter.
    if (!reduce) {
      document.querySelectorAll(".eyebrow").forEach((el) => {
        const st = ScrollTrigger.create({ trigger: el, start: "top 90%", once: true, onEnter: () => scramble(el, 1) });
        cleanups.push(() => st.kill());
      });
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return <div className="spark-layer" ref={layer} aria-hidden="true" />;
}
