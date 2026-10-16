"use client";

import { useRef } from "react";
import { gsap, useGSAP, wiggle, scrollToTarget, scramble } from "@/lib/gsap";
import { ROLES, LOCATION } from "@/lib/content";
import Magnetic from "./Magnetic";
import Portrait from "./Portrait";

const Letters = ({ word }) =>
  word.split("").map((c, i) => (
    <span key={i} className="hero-char" onMouseEnter={wiggle}>
      {c}
    </span>
  ));

export default function Hero({ ready }) {
  const root = useRef(null);

  // Ambient blobs that drift and chase the pointer.
  useGSAP(
    () => {
      const blobs = gsap.utils.toArray(".blob");
      blobs.forEach((b, i) => {
        gsap.to(b, {
          scale: gsap.utils.random(1.1, 1.4),
          rotate: gsap.utils.random(-40, 40),
          duration: gsap.utils.random(5, 8),
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.6,
        });
      });

      if (!window.matchMedia("(pointer: fine)").matches) return;
      const setters = blobs.map((b, i) => ({
        x: gsap.quickTo(b, "x", { duration: 1.4 + i * 0.5, ease: "power3" }),
        y: gsap.quickTo(b, "y", { duration: 1.4 + i * 0.5, ease: "power3" }),
      }));
      const move = (e) => {
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        setters.forEach((s, i) => {
          const f = (i + 1) * 90 * (i % 2 ? -1 : 1);
          s.x(nx * f);
          s.y(ny * f);
        });
      };
      window.addEventListener("pointermove", move);
      return () => window.removeEventListener("pointermove", move);
    },
    { scope: root }
  );

  // Intro + scroll choreography, after the preloader lifts.
  useGSAP(
    () => {
      if (!ready) return;

      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.from(".hero-char", {
        yPercent: 130,
        rotate: (i) => (i % 2 ? 14 : -14),
        duration: 1.5,
        stagger: 0.045,
      })
        .set(".hero-name .line", { overflow: "visible" })
        .from(".hero-meta > *", { yPercent: -100, opacity: 0, stagger: 0.06, duration: 1 }, 0.3)
        .add(() => gsap.utils.toArray(".hero-meta > *").forEach((m) => scramble(m, 1.2)), 0.3)
        .from(".hero-copy > *", { y: 40, opacity: 0, stagger: 0.1, duration: 1.2 }, 0.6)
        .from(".hero-badge", { scale: 0, rotate: -220, duration: 1.4, ease: "back.out(1.6)" }, 0.8);

      // Rotating role words.
      const words = gsap.utils.toArray(".role-word");
      const roles = gsap.timeline({ repeat: -1, delay: 1 });
      words.forEach((w) => {
        roles
          .fromTo(w, { yPercent: 110, opacity: 0, rotate: 4 }, { yPercent: 0, opacity: 1, rotate: 0, duration: 0.7, ease: "expo.out" })
          .to(w, { yPercent: -110, opacity: 0, rotate: -4, duration: 0.5, ease: "expo.in" }, "+=1.5");
      });

      gsap.to(".badge-ring", { rotate: 360, duration: 16, repeat: -1, ease: "none" });

      // Name splits apart as you scroll away.
      const scrub = { trigger: root.current, start: "top top", end: "bottom top", scrub: true };
      gsap.to(".hero-name .row-1", { xPercent: -22, ease: "none", scrollTrigger: scrub });
      gsap.to(".hero-name .row-2", { xPercent: 22, ease: "none", scrollTrigger: scrub });
      gsap.to(".hero-sub", { yPercent: 60, opacity: 0, ease: "none", scrollTrigger: scrub });
      gsap.to(".blobs", { yPercent: 30, scale: 1.3, ease: "none", scrollTrigger: scrub });
    },
    { scope: root, dependencies: [ready] }
  );

  return (
    <section className="hero" id="top" ref={root}>
      <div className="blobs" aria-hidden="true">
        <div className="blob b1" />
        <div className="blob b2" />
        <div className="blob b3" />
      </div>
      <div className="hero-grid" aria-hidden="true" />

      <div className="hero-inner wrap">
        <div className="hero-meta mono">
          <span>Portfolio / 2026</span>
          <span>{LOCATION}</span>
          <span>SEO × UI/UX</span>
        </div>

        <h1 className="hero-name" aria-label="Roshika Pradhan">
          <span className="line row-1" aria-hidden="true">
            <Letters word="ROSHIKA" />
          </span>
          <span className="line row-2 outline" aria-hidden="true">
            <Letters word="PRADHAN" />
          </span>
        </h1>

        <Portrait ready={ready} />

        <div className="hero-sub">
          <div className="hero-copy">
            <p className="hero-roles serif">
              <span>is a</span>
              <span className="roles" aria-label={ROLES.join(", ")}>
                {ROLES.map((r) => (
                  <span key={r} className="role-word" aria-hidden="true">
                    {r}
                  </span>
                ))}
              </span>
            </p>
            <p className="hero-blurb">
              I help brands get found on search and make sure people enjoy what they find when they
              land. Thames International College, class of 2026.
            </p>

          <div className="hero-ctas">
            <Magnetic>
              <a
                className="btn btn-solid"
                href="#work"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToTarget("#work");
                }}
              >
                <span>See my work</span>
                <span aria-hidden="true">↘</span>
              </a>
            </Magnetic>
            <Magnetic>
              <a
                className="btn btn-ghost"
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToTarget("#contact");
                }}
              >
                <span>Say hi</span>
              </a>
            </Magnetic>
          </div>
          </div>

          <div className="hero-badge" aria-hidden="true">
            <svg className="badge-ring" viewBox="0 0 200 200">
              <defs>
                <path id="badge-circle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
              </defs>
              <text>
                <textPath href="#badge-circle">
                  OPEN TO WORK ✦ SEO ✦ UI/UX ✦ CONTENT ✦
                </textPath>
              </text>
            </svg>
            <span className="badge-core">✦</span>
          </div>
        </div>
      </div>
    </section>
  );
}
