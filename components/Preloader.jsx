"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

const WORDS = ["Search.", "Design.", "Repeat."];

export default function Preloader({ onReveal }) {
  const root = useRef(null);
  const count = useRef(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(root.current, { display: "none" });
        onReveal();
        return;
      }

      const counter = { v: 0 };
      const words = gsap.utils.toArray(".pl-word");
      const tl = gsap.timeline();

      tl.to(counter, {
        v: 100,
        duration: 2.4,
        ease: "power2.inOut",
        onUpdate: () => {
          count.current.textContent = String(Math.round(counter.v)).padStart(3, "0");
        },
      }).to(".pl-bar-fill", { scaleX: 1, duration: 2.4, ease: "power2.inOut" }, 0);

      words.forEach((w, i) => {
        const at = i * 0.75;
        tl.fromTo(w, { yPercent: 110, rotate: 6 }, { yPercent: 0, rotate: 0, duration: 0.55, ease: "expo.out" }, at);
        if (i < words.length - 1) {
          tl.to(w, { yPercent: -110, rotate: -6, duration: 0.45, ease: "expo.in" }, at + 0.5);
        }
      });

      tl.to([".pl-word", ".pl-count", ".pl-top"], {
        yPercent: -120,
        opacity: 0,
        duration: 0.5,
        ease: "expo.in",
        stagger: 0.05,
      })
        .add(() => onReveal(), "-=0.1")
        .to(root.current, { clipPath: "inset(0% 0% 100% 0%)", duration: 1.1, ease: "expo.inOut" }, "-=0.2")
        .set(root.current, { display: "none" });
    },
    { scope: root }
  );

  return (
    <div className="preloader" ref={root} aria-hidden="true">
      <div className="pl-top mono">
        <span>Roshika Pradhan</span>
        <span>Portfolio ©2026</span>
      </div>
      <div className="pl-words">
        {WORDS.map((w) => (
          <span key={w} className="pl-word">
            {w}
          </span>
        ))}
      </div>
      <div className="pl-bottom">
        <div className="pl-bar">
          <div className="pl-bar-fill" />
        </div>
        <span className="pl-count" ref={count}>
          000
        </span>
      </div>
    </div>
  );
}
