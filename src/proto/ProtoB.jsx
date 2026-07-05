import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { createField } from './field';
import HomeSections from './HomeSections';
import './proto.css';

// PROTO B — WebGL floating-image field hero (OGL). Scroll reveals the field
// from depth; cursor parallaxes it; scroll velocity warps it; hover brings a
// plane forward while the rest recede. Placeholder colours for now.

const STATEMENT_WORDS = 'I design brands and build the products they become.'.split(' ');

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

export default function ProtoB() {
  const canvasRef = useRef(null);
  const heroRef = useRef(null);

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);

    const field = createField(canvasRef.current);
    // re-lay-out once the viewport has settled (guards against a 0-size mount)
    requestAnimationFrame(() => field.resize());
    const settleId = setTimeout(() => field.resize(), 250);

    const lenis = new Lenis({ lerp: 0.09 });
    lenis.scrollTo(0, { immediate: true });

    // Gated reveal: locked on the starfield until the first scroll, which plays
    // the FULL reveal (always completes) while the page is locked so a big
    // scroll can't overshoot. Scroll up at the top reverses it (for testing).
    // intro: on load the hero copy assembles in (the scroll-away warp, reversed)
    // over INTRO_DUR while locked; finishing unlocks the scroll-gated reveal.
    let phase = 'intro'; // intro → stars → revealing → open → unrevealing → stars
    let prog = 0, animStart = performance.now(), last = 0, raf, warpEls = [];
    const DUR = 1800;       // ms — field reveal duration
    const INTRO_DUR = 1000; // ms — on-load copy lift + fade
    const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    // Two-step gate (Lenis pinned to top while locked = any phase but 'open'):
    //  stars --down--> revealing --auto--> revealed (locked hover state) --down--> open (content)
    //  revealed --up--> unrevealing --auto--> stars   |   open --up@top--> revealed
    // advance() returns true when the input should be swallowed (stay locked).
    const advance = (down) => {
      if (phase === 'intro') return true; // locked until the copy finishes assembling
      if (phase === 'stars') { if (down) { phase = 'revealing'; animStart = performance.now(); } return true; }
      if (phase === 'revealing' || phase === 'unrevealing') return true;
      if (phase === 'revealed') {
        if (down) { phase = 'open'; return false; }            // let this scroll flow into the content
        phase = 'unrevealing'; animStart = performance.now(); return true;
      }
      if (!down && window.scrollY <= 2) { phase = 'revealed'; return true; } // re-lock at the top
      return false;
    };
    const onWheel = (e) => { if (advance(e.deltaY > 0)) e.preventDefault(); };
    const onKey = (e) => {
      if (['ArrowDown', 'PageDown', ' ', 'Spacebar'].includes(e.key)) { if (advance(true)) e.preventDefault(); }
      else if (['ArrowUp', 'PageUp'].includes(e.key)) { if (advance(false)) e.preventDefault(); }
    };
    let touchY = 0;
    const onTouchStart = (e) => { touchY = e.touches[0].clientY; };
    const onTouchMove = (e) => { if (advance(e.touches[0].clientY < touchY)) e.preventDefault(); };
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKey);
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });

    const loop = (t) => {
      lenis.raf(t);
      if (phase !== 'open') lenis.scrollTo(0, { immediate: true }); // pin to top while locked
      if (phase === 'revealing') {
        const e = Math.min(1, (performance.now() - animStart) / DUR);
        prog = ease(e);
        if (e >= 1) { prog = 1; phase = 'revealed'; }
      } else if (phase === 'unrevealing') {
        const e = Math.min(1, (performance.now() - animStart) / DUR);
        prog = 1 - ease(e);
        if (e >= 1) { prog = 0; phase = 'stars'; }
      } else {
        prog = (phase === 'revealed' || phase === 'open') ? 1 : 0; // intro & stars → 0
      }
      field.setProgress(prog);

      if (!warpEls.length && heroRef.current) warpEls = Array.from(heroRef.current.querySelectorAll('[data-warp]'));
      if (phase === 'intro') {
        // on load: a subtle lift + fade — top line first, then each word L→R / T→B
        const ip = Math.min(1, (performance.now() - animStart) / INTRO_DUR);
        for (let i = 0; i < warpEls.length; i++) {
          const e = easeOutCubic(Math.max(0, Math.min(1, (ip - i * 0.067) / 0.4)));
          const el = warpEls[i];
          el.style.opacity = e.toFixed(3);
          el.style.transform = `translateY(${((1 - e) * 16).toFixed(2)}px)`;
          el.style.filter = 'none';
        }
        if (ip >= 1) phase = 'stars'; // unlock scrolling
      } else {
        // scroll reveal: each word warps away (scale + blur + fade) on prog
        for (let i = 0; i < warpEls.length; i++) {
          const lp = Math.max(0, Math.min(1, (prog - i * 0.05) / 0.22));
          const e = Math.pow(lp, 2.2);
          const el = warpEls[i];
          el.style.transform = `scale(${(1 - e * 0.62).toFixed(4)})`;
          el.style.opacity = (1 - e).toFixed(3);
          el.style.filter = `blur(${(e * 14).toFixed(2)}px)`;
        }
      }
      const sy = window.scrollY;
      field.addVelocity((sy - last) * 0.008);
      last = sy;
      field.render(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onResize = () => field.resize();
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(settleId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      lenis.destroy();
      field.destroy();
    };
  }, []);

  return (
    <div className="proto protob">
      <Nav />
      <canvas ref={canvasRef} className="field-canvas" />

      <section className="pb-hero">
        <div className="pb-hero__sticky">
          <div className="pb-hero__inner" ref={heroRef}>
            <span className="kicker lbl" data-warp>Brand — Product — Engineering</span>
            <h1 className="statement">
              {STATEMENT_WORDS.flatMap((w, i) => {
                const span = <span className="word" data-warp key={i}>{w}</span>;
                return i === 0 ? [span] : [' ', span];
              })}
            </h1>
          </div>
          <div className="p-rail p-rail--a">
            <span className="lbl">Product Architect</span>
            <span className="lbl">Scroll to reveal</span>
            <span className="lbl lbl--bright">02 — Reveal</span>
          </div>
        </div>
      </section>

      <HomeSections />
    </div>
  );
}
