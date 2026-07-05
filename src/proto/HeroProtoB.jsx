import { useEffect } from 'react';
import Lenis from 'lenis';
import Montage from './Montage';
import './proto.css';

// VARIANT B — next-screen reveal.
// Clean hero, then the montage as its own full-screen section. No pin.

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

function Switcher() {
  return (
    <div className="switcher">
      <a href="/proto-a">A · Takeover</a>
      <a href="/proto-b" className="on">B · Next-screen</a>
    </div>
  );
}

export default function HeroProtoB() {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1 });
    let raf;
    const loop = (t) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="proto">
      <Nav />

      <section className="p-hero">
        <div className="p-hero__inner">
          <span className="kicker lbl">Brand — Product — Engineering</span>
          <h1 className="statement">I design brands and build the products they become.</h1>
        </div>
        <div className="p-rail">
          <span className="lbl">Product Architect</span>
          <span className="lbl">Scroll to the Work</span>
          <span className="lbl lbl--bright">01 — Index</span>
        </div>
      </section>

      <section className="reveal">
        <Montage />
        <div className="reveal__top">
          <span className="lbl lbl--bright">(02) The Work — Live</span>
          <span className="lbl">Twelve Products, Designed &amp; Built</span>
        </div>
        <div className="reveal__bottom">
          <p className="reveal__caption">
            Real products, live in the world — brand, design, and engineering carried end to end.
          </p>
          <span className="lbl lbl--bright">02 — Reveal</span>
        </div>
      </section>

      <Switcher />
    </div>
  );
}
