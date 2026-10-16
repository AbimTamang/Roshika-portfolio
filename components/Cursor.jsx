"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const HOVERABLE = "a, button, [data-cursor]";

export default function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);
  const label = useRef(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const html = document.documentElement;
    html.classList.add("has-cursor");

    gsap.set([dot.current, ring.current], { xPercent: -50, yPercent: -50 });
    const dx = gsap.quickTo(dot.current, "x", { duration: 0.08, ease: "power3" });
    const dy = gsap.quickTo(dot.current, "y", { duration: 0.08, ease: "power3" });
    const rx = gsap.quickTo(ring.current, "x", { duration: 0.5, ease: "power3" });
    const ry = gsap.quickTo(ring.current, "y", { duration: 0.5, ease: "power3" });

    let shown = false;
    const move = (e) => {
      if (!shown) {
        shown = true;
        gsap.set([dot.current, ring.current], { x: e.clientX, y: e.clientY });
        gsap.to([dot.current, ring.current], { opacity: 1, duration: 0.3 });
      }
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
    };

    const over = (e) => {
      const t = e.target.closest?.(HOVERABLE);
      if (!t) return;
      const text = t.dataset.cursor || "";
      label.current.textContent = text;
      ring.current.classList.toggle("has-label", !!text);
      gsap.to(ring.current, { width: text ? 92 : 64, height: text ? 92 : 64, duration: 0.45, ease: "expo.out" });
      gsap.to(dot.current, { scale: 0, duration: 0.3 });
    };

    const out = (e) => {
      const t = e.target.closest?.(HOVERABLE);
      if (!t || (e.relatedTarget && t.contains(e.relatedTarget))) return;
      ring.current.classList.remove("has-label");
      label.current.textContent = "";
      gsap.to(ring.current, { width: 36, height: 36, duration: 0.45, ease: "expo.out" });
      gsap.to(dot.current, { scale: 1, duration: 0.3 });
    };

    const down = () => gsap.to(ring.current, { scale: 0.8, duration: 0.15 });
    const up = () => gsap.to(ring.current, { scale: 1, duration: 0.4, ease: "elastic.out(1,0.4)" });
    const leave = () => gsap.to([dot.current, ring.current], { opacity: 0, duration: 0.2 });
    const enter = () => shown && gsap.to([dot.current, ring.current], { opacity: 1, duration: 0.2 });

    window.addEventListener("pointermove", move);
    document.addEventListener("mouseover", over);
    document.addEventListener("mouseout", out);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    document.documentElement.addEventListener("mouseleave", leave);
    document.documentElement.addEventListener("mouseenter", enter);

    return () => {
      html.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      document.removeEventListener("mouseover", over);
      document.removeEventListener("mouseout", out);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.documentElement.removeEventListener("mouseleave", leave);
      document.documentElement.removeEventListener("mouseenter", enter);
    };
  }, []);

  return (
    <>
      <div className="cursor-ring" ref={ring} aria-hidden="true">
        <span ref={label} />
      </div>
      <div className="cursor-dot" ref={dot} aria-hidden="true" />
    </>
  );
}
