"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, Draggable, InertiaPlugin, ScrambleTextPlugin, useGSAP);
}

export { gsap, ScrollTrigger, SplitText, Draggable, useGSAP };

export const SCRAMBLE_CHARS = "!<>-_/[]{}=+*^?#✦";

// Scramble an element's text into place.
export function scramble(el, duration = 0.8) {
  if (!el) return;
  const text = el.dataset.text || el.textContent;
  el.dataset.text = text;
  return gsap.to(el, {
    duration,
    scrambleText: { text, chars: SCRAMBLE_CHARS, speed: 0.6, revealDelay: 0.1 },
  });
}

// Smooth-scroll to a selector or y position, through Lenis when it's running.
export function scrollToTarget(target) {
  const lenis = typeof window !== "undefined" ? window.__lenis : null;
  if (lenis) {
    lenis.scrollTo(target, { duration: 1.6 });
  } else if (typeof target === "number") {
    window.scrollTo({ top: target, behavior: "smooth" });
  } else {
    document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
  }
}

// Bouncy hover for single letters.
export function wiggle(e) {
  const el = e.currentTarget;
  if (gsap.isTweening(el)) return;
  const original = getComputedStyle(el).color;
  gsap
    .timeline()
    .to(el, {
      yPercent: -18,
      rotate: gsap.utils.random(-16, 16),
      color: "#ff3e7a",
      duration: 0.22,
      ease: "power2.out",
    })
    .to(el, {
      yPercent: 0,
      rotate: 0,
      color: original,
      duration: 1,
      ease: "elastic.out(1, 0.3)",
    });
}
