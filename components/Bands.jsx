"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { MARQUEE_A, MARQUEE_B } from "@/lib/content";

function Band({ items, className, reverse, duration = 28 }) {
  const root = useRef(null);

  useGSAP(
    () => {
      const track = root.current.querySelector(".mq-track");
      const inner = root.current.querySelector(".mq-inner");
      const tween = reverse
        ? gsap.fromTo(track, { xPercent: -50 }, { xPercent: 0, duration, ease: "none", repeat: -1 })
        : gsap.to(track, { xPercent: -50, duration, ease: "none", repeat: -1 });
      // Park far into the loop so a negative timeScale never hits the start.
      tween.totalTime(tween.duration() * 1000);

      let vel = 0;
      let dir = 1;
      const st = ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          vel = self.getVelocity();
          dir = self.direction;
        },
      });
      const skewTo = gsap.quickTo(inner, "skewX", { duration: 0.5, ease: "power3" });
      const tick = () => {
        vel *= 0.9;
        tween.timeScale(dir * (1 + Math.min(Math.abs(vel) / 220, 9)));
        skewTo(gsap.utils.clamp(-14, 14, -vel / 180));
      };
      gsap.ticker.add(tick);
      return () => {
        gsap.ticker.remove(tick);
        st.kill();
      };
    },
    { scope: root }
  );

  const group = (key) => (
    <div className="mq-group" key={key} aria-hidden={key === "b"}>
      {items.map((it) => (
        <span className="mq-item" key={it}>
          {it}
          <span className="mq-star">✦</span>
        </span>
      ))}
    </div>
  );

  return (
    <div className={`band ${className}`} ref={root}>
      <div className="mq-inner">
        <div className="mq-track">{[group("a"), group("b")]}</div>
      </div>
    </div>
  );
}

export default function Bands() {
  return (
    <section className="bands" aria-label="What I do">
      <Band items={MARQUEE_A} className="band-lip" />
      <Band items={MARQUEE_B} className="band-peri serif" reverse duration={34} />
    </section>
  );
}
