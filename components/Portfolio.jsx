"use client";

import { useEffect, useState } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import SmoothScroll from "./SmoothScroll";
import Preloader from "./Preloader";
import Cursor from "./Cursor";
import Nav from "./Nav";
import ScrollProgress from "./ScrollProgress";
import Hero from "./Hero";
import Bands from "./Bands";
import About from "./About";
import Experience from "./Experience";
import Skills from "./Skills";
import Contact from "./Contact";
import Process from "./Process";
import Effects from "./Effects";

export default function Portfolio() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.classList.remove("is-loading");
    window.__lenis?.start();
    ScrollTrigger.refresh();
  }, [ready]);

  return (
    <>
      <SmoothScroll />
      <Preloader onReveal={() => setReady(true)} />
      <Cursor />
      <ScrollProgress />
      <Nav ready={ready} />
      <main>
        <Hero ready={ready} />
        <Bands />
        <About />
        <Experience />
        <Skills />
        <Process />
        <Contact />
      </main>
      <Effects />
    </>
  );
}
