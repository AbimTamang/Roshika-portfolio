"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP, scrollToTarget, scramble } from "@/lib/gsap";

const LINKS = [
  { href: "#about", label: "About" },
  { href: "#work", label: "Work" },
  { href: "#skills", label: "Skills" },
  { href: "#process", label: "Process" },
  { href: "#contact", label: "Contact" },
];

export default function Nav({ ready }) {
  const bar = useRef(null);
  const overlay = useRef(null);
  const menuTl = useRef(null);
  const [open, setOpen] = useState(false);

  useGSAP(
    () => {
      if (!ready) return;
      gsap.from(bar.current.children, {
        yPercent: -150,
        opacity: 0,
        duration: 1.1,
        stagger: 0.08,
        ease: "expo.out",
        delay: 0.5,
      });
    },
    { dependencies: [ready] }
  );

  useGSAP(
    () => {
      menuTl.current = gsap
        .timeline({ paused: true })
        .set(overlay.current, { visibility: "visible" })
        .fromTo(
          overlay.current,
          { clipPath: "circle(0% at 100% 0%)" },
          { clipPath: "circle(150% at 100% 0%)", duration: 0.9, ease: "expo.inOut" }
        )
        .from(
          ".menu-link",
          { yPercent: 120, rotate: 8, duration: 0.8, stagger: 0.07, ease: "expo.out" },
          "-=0.45"
        )
        .from(".menu-foot", { opacity: 0, y: 20, duration: 0.5 }, "-=0.5");
    },
    { scope: overlay }
  );

  const toggle = (next) => {
    setOpen(next);
    if (next) {
      window.__lenis?.stop();
      menuTl.current.timeScale(1).play();
    } else {
      window.__lenis?.start();
      menuTl.current.timeScale(1.6).reverse();
    }
  };

  const go = (e, href) => {
    e.preventDefault();
    if (open) toggle(false);
    scrollToTarget(href);
  };

  return (
    <>
      <header className="nav" ref={bar}>
        <a className="logo" href="#top" onClick={(e) => go(e, 0)} aria-label="Back to top">
          RP<sup>©</sup>
        </a>
        <nav className="nav-links mono" aria-label="Main">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => go(e, l.href)}
              onMouseEnter={(e) => scramble(e.currentTarget.firstChild, 0.5)}
              className="nav-link"
            >
              <span data-text={l.label}>{l.label}</span>
            </a>
          ))}
        </nav>
        <button
          className="menu-btn mono"
          type="button"
          aria-expanded={open}
          aria-controls="menu-overlay"
          onClick={() => toggle(true)}
        >
          Menu
        </button>
      </header>

      <div className="menu-overlay" id="menu-overlay" ref={overlay} aria-hidden={!open}>
        <button className="menu-close mono" type="button" onClick={() => toggle(false)}>
          Close ✕
        </button>
        <nav className="menu-links" aria-label="Mobile">
          {LINKS.map((l) => (
            <div className="menu-line" key={l.href}>
              <a className="menu-link" href={l.href} onClick={(e) => go(e, l.href)} tabIndex={open ? 0 : -1}>
                {l.label}
              </a>
            </div>
          ))}
        </nav>
        <p className="menu-foot mono">roshikapradhan107@gmail.com</p>
      </div>
    </>
  );
}
