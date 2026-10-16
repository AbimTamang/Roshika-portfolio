"use client";

import { useRef } from "react";
import { gsap, useGSAP, scramble } from "@/lib/gsap";

const STEPS = [
  { t: "Research", d: "Who is searching, what they type, and what they hope to find." },
  { t: "Keywords", d: "Map search intent to pages, so every page has one clear job." },
  { t: "Wireframe", d: "Sketch the structure before anything gets pretty." },
  { t: "Design", d: "Type, colour and components in Figma, built around real content." },
  { t: "Test", d: "Watch people use it, then fix whatever trips them up." },
  { t: "Launch & measure", d: "Ship it, track rankings and behaviour, then go again." },
];

export default function Process() {
  const root = useRef(null);

  useGSAP(
    () => {
      gsap.from(".proc .sec-title .tl", {
        yPercent: 110,
        rotate: 4,
        duration: 1.2,
        stagger: 0.1,
        ease: "expo.out",
        scrollTrigger: { trigger: ".proc .sec-title", start: "top 85%" },
      });

      // The line draws itself; a comet rides its tip.
      const line = { trigger: ".proc-list", start: "top 65%", end: "bottom 65%", scrub: 0.6 };
      gsap.fromTo(".proc-fill", { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: line });
      gsap.fromTo(".proc-comet", { top: "0%" }, { top: "100%", ease: "none", scrollTrigger: line });

      gsap.utils.toArray(".proc-step").forEach((step, i) => {
        const side = i % 2 ? 1 : -1;
        const tl = gsap.timeline({
          scrollTrigger: { trigger: step, start: "top 68%", toggleActions: "play none none reverse" },
        });
        tl.from(step.querySelector(".proc-dot"), { scale: 0, duration: 0.6, ease: "back.out(4)" })
          .from(
            step.querySelector(".proc-card"),
            { x: side * -120, rotate: side * -8, opacity: 0, duration: 1, ease: "expo.out" },
            0
          )
          .add(() => scramble(step.querySelector(".proc-num"), 0.6), 0.1);
      });
    },
    { scope: root }
  );

  return (
    <section className="proc wrap" id="process" ref={root}>
      <p className="eyebrow mono">How I work</p>
      <h2 className="sec-title">
        <span className="tl-mask">
          <span className="tl">From a search</span>
        </span>
        <span className="tl-mask">
          <span className="tl serif">to a screen.</span>
        </span>
      </h2>

      <div className="proc-list">
        <span className="proc-line" aria-hidden="true">
          <span className="proc-fill" />
          <span className="proc-comet" />
        </span>
        <ol className="proc-steps">
        {STEPS.map((s, i) => (
          <li className={`proc-step ${i % 2 ? "right" : "left"}`} key={s.t}>
            <span className="proc-dot" aria-hidden="true" />
            <div className="proc-card" data-tilt>
              <span className="proc-num mono">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="proc-title">{s.t}</h3>
              <p className="proc-desc">{s.d}</p>
            </div>
          </li>
        ))}
        </ol>
      </div>
    </section>
  );
}
