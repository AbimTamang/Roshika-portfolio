"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { EXPERIENCE } from "@/lib/content";

export default function Experience() {
  const root = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Desktop: pin the section and drive the cards sideways.
      mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
        const track = root.current.querySelector(".xp-track");
        const dist = () => track.scrollWidth - window.innerWidth;

        const slide = gsap.to(track, {
          x: () => -dist(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            pin: true,
            scrub: 1,
            end: () => "+=" + dist(),
            invalidateOnRefresh: true,
          },
        });

        gsap.utils.toArray(".xp-card").forEach((card) => {
          gsap.fromTo(
            card.querySelector(".xp-big"),
            { xPercent: 30 },
            {
              xPercent: -20,
              ease: "none",
              scrollTrigger: { trigger: card, containerAnimation: slide, start: "left right", end: "right left", scrub: true },
            }
          );
          gsap.from(card, {
            rotate: 6,
            yPercent: 8,
            ease: "none",
            scrollTrigger: { trigger: card, containerAnimation: slide, start: "left right", end: "left 40%", scrub: true },
          });
        });
      });

      // Mobile / tablet: stacked cards that flip up as they enter.
      mm.add("(max-width: 899px)", () => {
        gsap.utils.toArray(".xp-card").forEach((card, i) => {
          gsap.from(card, {
            y: 80,
            rotate: i % 2 ? 4 : -4,
            opacity: 0,
            duration: 1.1,
            ease: "expo.out",
            scrollTrigger: { trigger: card, start: "top 88%" },
          });
        });
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section className="xp" id="work" ref={root}>
      <div className="xp-track">
        <div className="xp-intro">
          <p className="eyebrow mono">Experience</p>
          <h2 className="sec-title">
            Where I&apos;ve <em className="serif">been</em> learning
          </h2>
          <p className="xp-hint mono">
            <span className="only-desk">Keep scrolling →</span>
            <span className="only-mob">Scroll ↓</span>
          </p>
        </div>

        {EXPERIENCE.map((x) => (
          <article className={`xp-card tone-${x.tone}`} key={x.org} data-cursor="✦" data-tilt>
            <span className="xp-big" aria-hidden="true">
              {x.short}
            </span>
            <header className="xp-head">
              <span className="mono xp-tag">{x.tag}</span>
              <h3 className="xp-org">{x.org}</h3>
              <p className="xp-role serif">{x.role}</p>
            </header>
            <div className="xp-foot">
              <p className="xp-body">{x.body}</p>
              <ul className="xp-skills">
                {x.skills.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
