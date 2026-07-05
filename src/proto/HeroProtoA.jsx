import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Montage from './Montage';
import HomeSections from './HomeSections';
import './proto.css';

gsap.registerPlugin(ScrollTrigger);

// VARIANT A — takeover. A SHORT pin: as you scroll, the montage assembles
// behind the statement over ~1 viewport, then releases. Light scrolljack.

function Nav() {
  return (
    <nav className="p-nav">
      <div className="l"><span className="lbl lbl--bright">Lee Corleison</span></div>
      <div className="c">
        <span className="dot" />
        <span className="lbl">Available for Work</span>
      </div>
      <div className="r"><span className="lbl lbl--bright">Contact</span></div>
    </nav>
  );
}

export default function HeroProtoA() {
  const heroRef = useRef(null);
  const montageRef = useRef(null);
  const scrimRef = useRef(null);

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);

    const lenis = new Lenis({ lerp: 0.09 });
    lenis.scrollTo(0, { immediate: true });
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    let ctx;
    // (re)build the pin + assemble against the CURRENT cards in the DOM
    const build = () => {
      if (ctx) ctx.revert();
      ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: '+=110%', // short pin — one-ish viewport of scroll
            pin: true,
            scrub: 0.5,
          },
        });
        tl.fromTo(
          '.takeover__montage .mcard',
          { opacity: 0, yPercent: 28, scale: 0.78 },
          { opacity: 1, yPercent: 0, scale: 1, ease: 'power2.out', stagger: 0.06 },
          0
        ).fromTo(scrimRef.current, { opacity: 0 }, { opacity: 1, ease: 'none' }, 0);
      }, heroRef);
    };
    build();

    // ensure trigger positions are correct once fonts/images settle
    const refreshId = setTimeout(() => ScrollTrigger.refresh(), 300);

    // on resize the column count (and card DOM) can change — rebuild so the
    // assemble re-targets the new cards and the pin recalculates. debounced.
    let resizeId;
    const onResize = () => {
      clearTimeout(resizeId);
      resizeId = setTimeout(() => {
        build();
        ScrollTrigger.refresh();
      }, 220);
    };
    window.addEventListener('resize', onResize);

    return () => {
      clearTimeout(refreshId);
      clearTimeout(resizeId);
      window.removeEventListener('resize', onResize);
      if (ctx) ctx.revert();
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="proto">
      <Nav />

      <section className="p-hero" ref={heroRef}>
        <div className="takeover__montage" ref={montageRef}>
          <Montage />
        </div>
        <div className="takeover__scrim" ref={scrimRef} />
        <div className="takeover__botfade" />
        <div className="p-hero__inner">
          <span className="kicker lbl">Brand — Product — Engineering</span>
          <h1 className="statement">I design brands and build the products they become.</h1>
        </div>
        <div className="p-rail p-rail--a">
          <span className="lbl">Product Architect</span>
          <span className="lbl">Selected Work</span>
          <span className="lbl lbl--bright">02 — Reveal</span>
        </div>
      </section>

      <HomeSections />
    </div>
  );
}
