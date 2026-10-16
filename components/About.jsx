"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";

const FACTS = [
  { k: "Studying", v: "Thames International College", s: "2022 – 2026" },
  { k: "Focused on", v: "SEO + UI/UX design", s: "lately, obsessively" },
  { k: "Based in", v: "Kathmandu, Nepal", s: "UTC +5:45" },
];

const MAX_PX = 64;

export default function About() {
  const root = useRef(null);
  const canvas = useRef(null);
  const status = useRef(null);

  useGSAP(
    () => {
      const split = SplitText.create(".about-text", { type: "words", wordsClass: "w" });
      gsap.fromTo(
        split.words,
        { opacity: 0.12, filter: "blur(4px)" },
        {
          opacity: 1,
          filter: "blur(0px)",
          stagger: 0.08,
          ease: "none",
          scrollTrigger: { trigger: ".about-text", start: "top 82%", end: "bottom 50%", scrub: true },
        }
      );

      gsap.from(".about-fact", {
        y: 80,
        rotate: (i) => (i - 1) * 6,
        opacity: 0,
        duration: 1.2,
        stagger: 0.12,
        ease: "expo.out",
        scrollTrigger: { trigger: ".about-facts", start: "top 85%" },
      });

      gsap.to(".about-sticker", {
        rotate: 360,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 1 },
      });

      // Pixelated portrait that "loads" as you scroll.
      const cv = canvas.current;
      const ctx = cv.getContext("2d");
      const tiny = document.createElement("canvas");
      const tctx = tiny.getContext("2d");
      const img = new Image();
      img.src = "/roshika.png";
      const state = { px: MAX_PX };

      const draw = () => {
        if (!img.naturalWidth || !cv.width) return;
        const p = Math.max(1, Math.round(state.px));
        ctx.clearRect(0, 0, cv.width, cv.height);
        if (p === 1) {
          ctx.imageSmoothingEnabled = true;
          ctx.drawImage(img, 0, 0, cv.width, cv.height);
        } else {
          const w = Math.max(1, Math.ceil(cv.width / p));
          const h = Math.max(1, Math.ceil(cv.height / p));
          tiny.width = w;
          tiny.height = h;
          tctx.clearRect(0, 0, w, h);
          tctx.drawImage(img, 0, 0, w, h);
          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(tiny, 0, 0, w, h, 0, 0, w * p, h * p);
        }
        const pct = Math.round(((MAX_PX - p) / (MAX_PX - 1)) * 100);
        status.current.textContent = p === 1 ? "loaded ✓ 100%" : `loading ${pct}%`;
      };

      const size = () => {
        const r = cv.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        cv.width = Math.round(r.width * dpr);
        cv.height = Math.round(r.height * dpr);
        draw();
      };
      img.onload = size;
      const ro = new ResizeObserver(size);
      ro.observe(cv);

      gsap.to(state, {
        px: 1,
        ease: "power1.in",
        onUpdate: draw,
        scrollTrigger: { trigger: ".pix-card", start: "top 85%", end: "center 40%", scrub: true },
      });

      gsap.from(".pix-card", {
        rotate: 14,
        y: 120,
        scale: 0.8,
        ease: "none",
        scrollTrigger: { trigger: ".pix-card", start: "top bottom", end: "center 55%", scrub: 1 },
      });
      gsap.from(".pix-sticker", {
        scale: 0,
        rotate: -60,
        duration: 0.9,
        ease: "back.out(3)",
        scrollTrigger: { trigger: ".pix-card", start: "center 50%" },
      });

      return () => ro.disconnect();
    },
    { scope: root }
  );

  return (
    <section className="about wrap" id="about" ref={root}>
      <p className="eyebrow mono">About me</p>
      <div className="about-body">
        <div className="about-copy">
          <p className="about-text">
            Hey, I&apos;m Roshika. I&apos;m a marketer who learned to design. I write for{" "}
            <em className="hl serif">search engines</em> and design for{" "}
            <em className="hl serif">humans</em>, and I&apos;m happiest when both of them agree.
            These days I&apos;m deep into SEO and UI/UX: turning keyword research into wireframes,
            and wireframes into pages people actually find.
          </p>
          <div className="about-sticker" aria-hidden="true">
            ✦
          </div>
        </div>

        <figure className="pix-card" data-tilt>
          <canvas
            ref={canvas}
            className="pix-canvas"
            role="img"
            aria-label="Portrait of Roshika that sharpens from pixels as you scroll"
          />
          <figcaption className="pix-cap mono">
            <span>roshika.png · 1086×1448</span>
            <span ref={status}>loading 0%</span>
          </figcaption>
          <span className="pix-sticker serif" aria-hidden="true">
            that&apos;s me!
          </span>
        </figure>
      </div>

      <div className="about-facts">
        {FACTS.map((f) => (
          <div className="about-fact" key={f.k} data-cursor="hi" data-tilt>
            <span className="mono fact-k">{f.k}</span>
            <span className="fact-v">{f.v}</span>
            <span className="mono fact-s">{f.s}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
