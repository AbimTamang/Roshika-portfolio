"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP, wiggle, scrollToTarget } from "@/lib/gsap";
import { EMAIL, NAME } from "@/lib/content";
import Magnetic from "./Magnetic";

const BIG = "LET'S TALK";

function useKathmanduTime() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kathmandu",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function Contact() {
  const root = useRef(null);
  const emailRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const time = useKathmanduTime();

  useGSAP(
    () => {
      gsap.fromTo(
        ".big-char",
        { yPercent: (i) => (i % 2 ? 120 : -120), rotate: () => gsap.utils.random(-40, 40), opacity: 0 },
        {
          yPercent: 0,
          rotate: 0,
          opacity: 1,
          stagger: 0.04,
          ease: "power3.out",
          scrollTrigger: { trigger: ".contact-big", start: "top 95%", end: "top 45%", scrub: 1 },
        }
      );
      // Giant name rises in, then reacts to the pointer (or waves on touch).
      const chars = gsap.utils.toArray(".mega-char");
      gsap.from(chars, {
        yPercent: 110,
        rotate: (i) => (i % 2 ? 20 : -20),
        stagger: 0.05,
        ease: "power3.out",
        scrollTrigger: { trigger: ".mega", start: "top 100%", end: "bottom 95%", scrub: 1 },
      });

      const cleanups = [];
      if (window.matchMedia("(pointer: fine)").matches) {
        const setters = chars.map((c) => ({
          y: gsap.quickTo(c, "y", { duration: 0.6, ease: "power3" }),
          s: gsap.quickTo(c, "scaleY", { duration: 0.6, ease: "power3" }),
        }));
        const move = (e) => {
          chars.forEach((c, i) => {
            const r = c.getBoundingClientRect();
            const dist = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
            const f = Math.max(0, 1 - dist / 320);
            setters[i].y(-f * 60);
            setters[i].s(1 + f * 0.35);
          });
        };
        window.addEventListener("pointermove", move);
        cleanups.push(() => window.removeEventListener("pointermove", move));
      } else {
        gsap.to(chars, {
          y: -18,
          duration: 0.9,
          ease: "sine.inOut",
          stagger: { each: 0.12, repeat: -1, yoyo: true },
        });
      }

      gsap.from(".contact-reveal", {
        y: 50,
        opacity: 0,
        stagger: 0.1,
        duration: 1.1,
        ease: "expo.out",
        scrollTrigger: { trigger: ".email-row", start: "top 90%" },
      });

      return () => cleanups.forEach((fn) => fn());
    },
    { scope: root }
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
    } catch {
      const range = document.createRange();
      range.selectNodeContents(emailRef.current);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
    setCopied(true);
    gsap.fromTo(".copy-btn", { scale: 0.9 }, { scale: 1, duration: 0.6, ease: "elastic.out(1, 0.3)" });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="contact" id="contact" ref={root}>
      <div className="wrap">
        <p className="eyebrow mono">Open to internships, freelance &amp; full-time roles</p>
        <h2 className="contact-big" aria-label="Let's talk">
          {BIG.split("").map((c, i) => (
            <span key={i} className="big-char" aria-hidden="true" onMouseEnter={wiggle}>
              {c === " " ? " " : c}
            </span>
          ))}
        </h2>

        <div className="email-row">
          <span className="email contact-reveal" ref={emailRef} data-cursor="copy" onClick={copy}>
            {EMAIL}
          </span>
          <div className="contact-ctas contact-reveal">
            <Magnetic>
              <button className="btn btn-solid copy-btn" type="button" onClick={copy}>
                <span>{copied ? "Copied ✓" : "Copy email"}</span>
              </button>
            </Magnetic>
            <Magnetic>
              <a className="btn btn-ghost" href={`mailto:${EMAIL}`}>
                <span>Write to me ↗</span>
              </a>
            </Magnetic>
          </div>
        </div>

        <div className="mega" aria-hidden="true">
          {"ROSHIKA".split("").map((c, i) => (
            <span className="mega-char" key={i}>
              {c}
            </span>
          ))}
        </div>

        <footer className="footer mono">
          <span>© 2026 {NAME}</span>
          <span>
            Kathmandu <b className="clock">{time || "--:--:--"}</b> NPT
          </span>
          <button className="to-top" type="button" onClick={() => scrollToTarget(0)}>
            Back to top ↑
          </button>
        </footer>
      </div>
    </section>
  );
}
