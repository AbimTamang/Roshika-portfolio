"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, Draggable, useGSAP } from "@/lib/gsap";

const STICKERS = [
  { t: "SEO ✦", tone: "lip", x: "-10%", y: "16%", r: -12 },
  { t: "UI/UX", tone: "peri", x: "80%", y: "8%", r: 10 },
  { t: "#1", tone: "peach", x: "88%", y: "46%", r: -8, round: true },
  { t: "Figma", tone: "paper", x: "-14%", y: "52%", r: 8 },
  { t: "open to work", tone: "lip", x: "64%", y: "72%", r: -5 },
];

export default function Portrait({ ready }) {
  const root = useRef(null);

  useGSAP(
    () => {
      const el = root.current;
      const tilt = el.querySelector(".p-tilt");
      const g1 = el.querySelector(".g1");
      const g2 = el.querySelector(".g2");
      const slices = gsap.utils.toArray(".p-slice", el);
      const hero = el.closest(".hero");
      const fine = window.matchMedia("(pointer: fine)").matches;

      // RGB ghosts: offset driven by pointer + scroll velocity, plus glitch kicks.
      let vx = 0;
      let vy = 0;
      let kick = 90;
      let lastX = null;
      let lastY = null;
      const tick = () => {
        vx *= 0.88;
        vy *= 0.88;
        kick *= 0.9;
        const ox = gsap.utils.clamp(-70, 70, vx);
        const oy = gsap.utils.clamp(-50, 50, vy);
        gsap.set(g1, { x: -7 - ox - kick, y: -oy * 0.5 });
        gsap.set(g2, { x: 7 + ox + kick, y: oy * 0.5 });
      };
      gsap.ticker.add(tick);

      const glitch = (power = 1) => {
        kick = gsap.utils.random(20, 50) * power;
        const tl = gsap.timeline();
        for (let k = 0; k < 7; k++) {
          tl.add(() => {
            slices.forEach((s) => {
              const top = gsap.utils.random(0, 92);
              const h = gsap.utils.random(2, 10);
              gsap.set(s, {
                opacity: 1,
                clipPath: `inset(${top}% 0% ${Math.max(0, 100 - top - h)}% 0%)`,
                x: gsap.utils.random(-50, 50) * power,
                filter: Math.random() > 0.5 ? "hue-rotate(140deg) saturate(4)" : "invert(1)",
              });
            });
          }).to({}, { duration: 0.05 });
        }
        tl.add(() => gsap.set(slices, { opacity: 0, x: 0 }));
        return tl;
      };

      // Random glitches forever.
      let timer;
      const loop = () => {
        glitch(gsap.utils.random(0.6, 1.2));
        timer = gsap.delayedCall(gsap.utils.random(2.5, 5), loop);
      };

      const onEnter = () => glitch(1.4);
      const onClick = () => glitch(2.2);
      tilt.addEventListener("pointerenter", onEnter);
      tilt.addEventListener("pointerdown", onClick);

      // 3D tilt + parallax layers.
      let onMove;
      if (fine) {
        const rx = gsap.quickTo(tilt, "rotationX", { duration: 0.8, ease: "power3" });
        const ry = gsap.quickTo(tilt, "rotationY", { duration: 0.8, ease: "power3" });
        const ax = gsap.quickTo(".p-arch", "x", { duration: 1.2, ease: "power3" });
        const cx = gsap.quickTo(".p-ring", "x", { duration: 1.6, ease: "power3" });
        const cy = gsap.quickTo(".p-ring", "y", { duration: 1.6, ease: "power3" });
        gsap.set(tilt, { transformPerspective: 1100, transformOrigin: "50% 80%" });
        onMove = (e) => {
          if (lastX !== null) {
            vx += (e.clientX - lastX) * 0.7;
            vy += (e.clientY - lastY) * 0.7;
          }
          lastX = e.clientX;
          lastY = e.clientY;
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          ry(nx * 18);
          rx(-ny * 10);
          ax(-nx * 40);
          cx(nx * 60);
          cy(ny * 40);
        };
        window.addEventListener("pointermove", onMove);
      }

      const st = ScrollTrigger.create({
        trigger: hero,
        start: "top top",
        end: "bottom top",
        onUpdate: (self) => {
          vy += gsap.utils.clamp(-40, 40, self.getVelocity() / 60);
        },
      });

      // Floating stickers you can throw around.
      gsap.utils.toArray(".sticker", el).forEach((s, i) => {
        gsap.to(s, {
          y: gsap.utils.random(-16, 16),
          rotation: `+=${gsap.utils.random(-8, 8)}`,
          duration: gsap.utils.random(1.8, 3),
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.2,
        });
      });
      const drags = Draggable.create(gsap.utils.toArray(".sticker-drag", el), {
        type: "x,y",
        inertia: true,
        bounds: hero,
        edgeResistance: 0.65,
        zIndexBoost: true,
        onPress() {
          gsap.to(this.target.firstChild, { scale: 1.2, duration: 0.25, ease: "back.out(3)" });
        },
        onDrag() {
          gsap.to(this.target.firstChild, { rotation: gsap.utils.clamp(-40, 40, this.deltaX * 4), duration: 0.3 });
        },
        onRelease() {
          gsap.to(this.target.firstChild, { scale: 1, rotation: 0, duration: 1, ease: "elastic.out(1, 0.3)" });
        },
      });

      // Intro.
      if (ready) {
        gsap
          .timeline({ delay: 0.15, onComplete: loop })
          .from(".p-arch", { scaleY: 0, transformOrigin: "50% 100%", duration: 1.4, ease: "expo.out" })
          .from(".p-ring", { scale: 0, opacity: 0, duration: 1.8, ease: "expo.out" }, 0.1)
          .fromTo(
            ".p-img",
            { clipPath: "inset(100% 0% 0% 0%)", yPercent: 14, scale: 1.2 },
            { clipPath: "inset(0% 0% 0% 0%)", yPercent: 0, scale: 1, duration: 1.7, ease: "expo.out" },
            0.25
          )
          .from([g1, g2], { opacity: 0, duration: 0.6 }, 0.5)
          .add(() => glitch(1.5), 1.3)
          .from(
            ".sticker-drag",
            { scale: 0, rotation: () => gsap.utils.random(-120, 120), duration: 1.1, stagger: 0.09, ease: "back.out(2.2)" },
            1
          );

        // Sink back and shrink as you scroll away.
        gsap.to(el, {
          yPercent: 12,
          scale: 0.88,
          ease: "none",
          scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true },
        });
      }

      return () => {
        gsap.ticker.remove(tick);
        timer?.kill();
        st.kill();
        drags.forEach((d) => d.kill());
        tilt.removeEventListener("pointerenter", onEnter);
        tilt.removeEventListener("pointerdown", onClick);
        if (onMove) window.removeEventListener("pointermove", onMove);
      };
    },
    { scope: root, dependencies: [ready] }
  );

  return (
    <div className="portrait" ref={root}>
      <div className="p-ring" aria-hidden="true" />
      <div className="p-arch" aria-hidden="true" />
      <div className="p-tilt" data-cursor="hi!">
        <div className="p-ghost g1" aria-hidden="true" />
        <div className="p-ghost g2" aria-hidden="true" />
        <img
          className="p-img"
          src="/roshika.png"
          alt="Roshika Pradhan in a black blazer"
          width={1086}
          height={1448}
          fetchPriority="high"
          draggable={false}
        />
        <div className="p-slices" aria-hidden="true">
          {[0, 1, 2, 3].map((i) => (
            <div className="p-slice" key={i} />
          ))}
        </div>
        <div className="p-scan" aria-hidden="true" />
      </div>
      <div className="p-fade" aria-hidden="true" />

      {STICKERS.map((s) => (
        <div
          className="sticker-drag"
          key={s.t}
          style={{ "--x": s.x, "--y": s.y }}
          data-cursor="drag"
          aria-hidden="true"
        >
          <span className={`sticker tone-${s.tone} ${s.round ? "round" : ""}`} style={{ rotate: `${s.r}deg` }}>
            {s.t}
          </span>
        </div>
      ))}
    </div>
  );
}
