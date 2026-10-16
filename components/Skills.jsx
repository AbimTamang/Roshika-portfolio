"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { SEO_SKILLS, UX_SKILLS } from "@/lib/content";
import Magnetic from "./Magnetic";

const QUERY = "best seo & ui/ux designer in kathmandu";

export default function Skills() {
  const root = useRef(null);
  const typed = useRef(null);

  useGSAP(
    () => {
      gsap.from(".skills .sec-title .tl", {
        yPercent: 110,
        rotate: 3,
        duration: 1.2,
        stagger: 0.1,
        ease: "expo.out",
        scrollTrigger: { trigger: ".skills .sec-title", start: "top 85%" },
      });

      // SEO panel: type a query, rank #1.
      const q = { n: 0 };
      gsap
        .timeline({ scrollTrigger: { trigger: ".serp-panel", start: "top 70%" } })
        .to(q, {
          n: QUERY.length,
          duration: 1.8,
          ease: "none",
          onUpdate: () => {
            typed.current.textContent = QUERY.slice(0, Math.round(q.n));
          },
        })
        .from(".serp-meta", { opacity: 0, y: 10, duration: 0.4 })
        .from(".serp-result", { y: 40, opacity: 0, stagger: 0.12, duration: 0.8, ease: "expo.out" })
        .from(".rank-chip", { scale: 0, rotate: -90, duration: 0.8, ease: "back.out(3)" }, "-=0.4")
        .from(".serp-panel .chips li", { y: 20, opacity: 0, stagger: 0.05, duration: 0.5 }, "-=0.3");

      // UX panel: wireframe draws itself, cursor clicks the CTA, loop.
      const btn = root.current.querySelector(".wf-btn");
      const cursor = root.current.querySelector(".wf-cursor");
      gsap
        .timeline({
          repeat: -1,
          repeatDelay: 2.2,
          scrollTrigger: { trigger: ".ux-panel", start: "top 70%", toggleActions: "play pause resume pause" },
        })
        .from(".wf-x", { scaleX: 0, transformOrigin: "left center", duration: 0.5, stagger: 0.07, ease: "expo.out" })
        .from(".wf-y", { scaleY: 0, transformOrigin: "center bottom", duration: 0.6, stagger: 0.1, ease: "expo.out" }, "-=0.4")
        .from(".wf-img line", { opacity: 0, duration: 0.3 })
        .fromTo(cursor, { x: 0, y: 0, opacity: 0 }, { opacity: 1, duration: 0.2 })
        .to(cursor, {
          x: () => btn.offsetLeft + btn.offsetWidth * 0.6 - cursor.offsetLeft,
          y: () => btn.offsetTop + btn.offsetHeight * 0.5 - cursor.offsetTop,
          duration: 1,
          ease: "power3.inOut",
        })
        .to(cursor, { scale: 0.75, duration: 0.1, yoyo: true, repeat: 1 })
        .to(btn, { backgroundColor: "#ff3e7a", color: "#0c0a10", scale: 1.08, duration: 0.2 }, "<")
        .to(btn, { scale: 1, duration: 0.6, ease: "elastic.out(1, 0.3)" })
        .to(".wf-ok", { opacity: 1, y: 0, duration: 0.4 }, "<")
        .to(cursor, { opacity: 0, duration: 0.3 }, "+=1.2")
        .set(btn, { clearProps: "backgroundColor,color" })
        .set(".wf-ok", { opacity: 0, y: 8 });

      gsap.from(".ux-panel .chips li", {
        y: 20,
        opacity: 0,
        stagger: 0.05,
        duration: 0.5,
        scrollTrigger: { trigger: ".ux-panel .chips", start: "top 90%" },
      });

      gsap.from(".panel", {
        y: 100,
        rotate: (i) => (i ? 3 : -3),
        duration: 1.3,
        stagger: 0.15,
        ease: "expo.out",
        scrollTrigger: { trigger: ".skill-grid", start: "top 85%" },
      });
    },
    { scope: root }
  );

  return (
    <section className="skills wrap" id="skills" ref={root}>
      <p className="eyebrow mono">What I do</p>
      <h2 className="sec-title">
        <span className="tl-mask">
          <span className="tl">Found on search.</span>
        </span>
        <span className="tl-mask">
          <span className="tl serif">Loved on screen.</span>
        </span>
      </h2>

      <div className="skill-grid">
        <article className="panel serp-panel" data-tilt>
          <header className="panel-head">
            <span className="panel-label">SEO</span>
            <span className="mono panel-note">get found</span>
          </header>

          <div className="search-bar">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
              <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="typed" ref={typed} />
            <span className="caret" aria-hidden="true" />
          </div>

          <p className="serp-meta mono">About 1 result (0.21 seconds)</p>

          <div className="serp-result r1" data-cursor="#1">
            <span className="serp-url mono">roshika.design › work</span>
            <h3 className="serp-title">Roshika Pradhan · SEO &amp; UI/UX Designer</h3>
            <p className="serp-desc">
              Keyword research, on-page SEO and interfaces people enjoy using. Based in Kathmandu,
              open to new projects.
            </p>
            <span className="rank-chip">#1</span>
          </div>
          <div className="serp-result ghost" aria-hidden="true">
            <span className="sk" style={{ width: "34%" }} />
            <span className="sk sk-t" style={{ width: "70%" }} />
            <span className="sk" style={{ width: "92%" }} />
          </div>

          <ul className="chips">
            {SEO_SKILLS.map((s) => (
              <li key={s}>
                <Magnetic strength={0.25}>
                  <span className="chip">{s}</span>
                </Magnetic>
              </li>
            ))}
          </ul>
        </article>

        <article className="panel ux-panel" data-tilt>
          <header className="panel-head">
            <span className="panel-label">UI/UX</span>
            <span className="mono panel-note">make it feel good</span>
          </header>

          <div className="wire" aria-hidden="true">
            <div className="wf-chrome">
              <i />
              <i />
              <i />
            </div>
            <div className="wf-nav">
              <span className="wf-x wf-logo" />
              <span className="wf-links">
                <span className="wf-x" />
                <span className="wf-x" />
                <span className="wf-x" />
              </span>
            </div>
            <div className="wf-hero">
              <div className="wf-copy">
                <span className="wf-x wf-h" />
                <span className="wf-x wf-h short" />
                <span className="wf-x wf-p" />
                <span className="wf-x wf-p" />
                <span className="wf-btn mono">Book a call</span>
                <span className="wf-ok mono">✓ converted</span>
              </div>
              <svg className="wf-y wf-img" viewBox="0 0 100 80" preserveAspectRatio="none">
                <rect width="100" height="80" rx="6" />
                <line x1="0" y1="0" x2="100" y2="80" />
                <line x1="100" y1="0" x2="0" y2="80" />
              </svg>
            </div>
            <div className="wf-cards">
              <span className="wf-y" />
              <span className="wf-y" />
              <span className="wf-y" />
            </div>
            <svg className="wf-cursor" viewBox="0 0 24 24" width="26" height="26">
              <path d="M4 2l15 9-7 1.5L9 20z" fill="#0c0a10" stroke="#f3eee6" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
          </div>

          <ul className="chips">
            {UX_SKILLS.map((s) => (
              <li key={s}>
                <Magnetic strength={0.25}>
                  <span className="chip">{s}</span>
                </Magnetic>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}
