import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import HomeSections from './HomeSections';
import { liveWork } from '../data/content';
import './proto.css';

// PROTO E — fork of proto-d. Scrolling 4-column mosaic (wide/tall/square) with the
// snappy L→R reveal, BUT: no click-to-expand, and every card carries its own info
// strip (project title + services) BELOW the image so each image stays a clean ratio.
// Subtle hover only: the card brightens slightly and the services line goes yellow.

const STATEMENT_WORDS = 'I design brands and build the products they become.'.split(' ');
// each project's tile shape (wide 2:1 / tall 1:2 / square) comes from the manifest
const GRID = liveWork.slice(0, 12).map((w) => ({ slug: w.slug, url: w.url, name: w.name, services: w.services || [], src: w.media[0], hover: w.media[1], ratio: w.tile }));
const RATIO_DIMS = { wide: '1200/600', tall: '600/1200', square: '900/900' };
const phFor = (g) => `https://picsum.photos/seed/lcd-${g.slug}-1/${RATIO_DIMS[g.ratio] || '1200/675'}`;

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

export default function ProtoE() {
  const gridRef = useRef(null);
  const planeRef = useRef(null);
  const heroRef = useRef(null);
  const railRef = useRef(null);

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);

    const lenis = new Lenis({ lerp: 0.09 });
    lenis.scrollTo(0, { immediate: true });

    const grid = gridRef.current;
    const navEl = document.querySelector('.protoe .p-nav');
    const mount = performance.now();
    const introLift = (elapsed, start, dur) => { const t = elapsed - start < 0 ? 0 : elapsed - start > dur ? 1 : (elapsed - start) / dur; return t * t * (3 - 2 * t); };
    const WARP_START = 0.42, WARP_END = 0.74;
    const STMT_START = 200, WORD_STAGGER = 45, WORD_DUR = 680, LIFT = 10;
    const STMT_END = STMT_START + 8 * WORD_STAGGER + WORD_DUR;
    const KICKER_START = STMT_END + 80, KICKER_DUR = 460;
    const CHROME_START = KICKER_START + 140, CHROME_DUR = 520;
    const LOCK_DUR = STMT_END;
    const STRIP_H = 40; // px — height of the info strip beneath each image (matches CSS)
    const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

    let raf, vh = window.innerHeight, locked = true;
    let warpEls = [], gridEls = [], cellY = [], cellXN = [], measured = false;
    let wordEls = [], kickerEl = null;

    const measure = () => {
      if (!planeRef.current) return;
      gridEls = Array.from(planeRef.current.children);
      // image is a clean ratio (square = column width); the strip sits BELOW it, so the
      // row height = column width + strip height
      const colW = parseFloat(getComputedStyle(planeRef.current).gridTemplateColumns.split(' ')[0]) || 0;
      if (colW) planeRef.current.style.gridAutoRows = (colW + STRIP_H) + 'px';
      cellY = []; const cx = [];
      for (const el of gridEls) {
        const pt = el.style.transform; el.style.transform = 'none';
        const r = el.getBoundingClientRect();
        el.style.transform = pt;
        cellY.push(r.top + window.scrollY + r.height / 2);
        cx.push(r.left + r.width / 2);
      }
      const minX = Math.min(...cx), maxX = Math.max(...cx);
      cellXN = cx.map((x) => (maxX > minX ? (x - minX) / (maxX - minX) : 0));
      vh = window.innerHeight;
      measured = true;
    };

    // --- scroll gating: hold the page only for the intro ---
    const onWheel = (e) => { if (locked) e.preventDefault(); };
    const onKey = (e) => { if (locked && ['ArrowDown', 'PageDown', ' ', 'Spacebar'].includes(e.key)) e.preventDefault(); };
    const onTouchMove = (e) => { if (locked) e.preventDefault(); };
    const onResize = () => { measure(); };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKey);
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('resize', onResize);
    const reMeasure = setTimeout(measure, 320);

    const loop = (t) => {
      lenis.raf(t);
      const now = performance.now();
      const elapsed = now - mount;
      vh = window.innerHeight;
      if (locked) { if (elapsed >= LOCK_DUR) locked = false; else lenis.scrollTo(0, { immediate: true }); }
      const sy = window.scrollY;

      if (!warpEls.length && heroRef.current) {
        warpEls = Array.from(heroRef.current.querySelectorAll('[data-warp]'));
        kickerEl = warpEls[0];
        wordEls = warpEls.slice(1);
      }
      const warp = clamp01((sy / vh - WARP_START) / (WARP_END - WARP_START));
      for (let i = 0; i < wordEls.length; i++) {
        const el = wordEls[i];
        const start = STMT_START + i * WORD_STAGGER;
        const lift = introLift(elapsed, start, WORD_DUR);
        const ee = Math.pow(clamp01((warp - i * 0.045) / 0.22), 2.2);
        el.style.opacity = (lift * (1 - ee)).toFixed(3);
        el.style.transform = `translateY(${((1 - lift) * LIFT * (1 - ee)).toFixed(2)}px) scale(${(1 - ee * 0.62).toFixed(4)})`;
        el.style.filter = ee > 0.001 ? `blur(${(ee * 14).toFixed(2)}px)` : 'none';
      }
      if (kickerEl) {
        const kl = introLift(elapsed, KICKER_START, KICKER_DUR);
        const kee = Math.pow(clamp01(warp / 0.22), 2.2);
        kickerEl.style.opacity = (kl * (1 - kee)).toFixed(3);
        kickerEl.style.transform = `translateY(${((1 - kl) * LIFT * (1 - kee)).toFixed(2)}px) scale(${(1 - kee * 0.62).toFixed(4)})`;
        kickerEl.style.filter = kee > 0.001 ? `blur(${(kee * 14).toFixed(2)}px)` : 'none';
      }
      const chrome = introLift(elapsed, CHROME_START, CHROME_DUR);
      if (navEl) navEl.style.opacity = chrome.toFixed(3);

      // grid: snappy L→R reveal (no hover tilt, no expand — CSS handles the subtle hover)
      if (!measured) measure();
      {
        const RD = vh * 0.15, TOP = 64, TRAVEL = 50, STAGGER = 80;
        for (let i = 0; i < gridEls.length; i++) {
          const el = gridEls[i];
          const cy = cellY[i] - sy + cellXN[i] * STAGGER;
          const eIn = clamp01((vh - cy) / RD), eOut = clamp01((cy - TOP) / RD);
          const e = Math.min(eIn, eOut);
          if (e >= 0.85) {
            if (!el._set) { el.style.transform = ''; el.style.opacity = ''; el.style.filter = ''; el.classList.add('is-set'); el._set = true; }
          } else {
            if (el._set) { el.classList.remove('is-set'); el._set = false; }
            const ee = 1 - Math.pow(1 - e, 4);
            const ty = (eIn <= eOut ? 1 : -1) * (1 - ee) * TRAVEL;
            el.style.opacity = ee.toFixed(3);
            el.style.transform = `translateY(${ty.toFixed(1)}px) scale(${(0.5 + 0.5 * ee).toFixed(4)})`;
            el.style.filter = `brightness(${(0.45 + 0.55 * ee).toFixed(3)}) blur(${((1 - ee) * 3).toFixed(2)}px)`;
          }
        }
      }

      if (railRef.current && grid) {
        const rf = clamp01((grid.offsetTop + grid.offsetHeight - (sy + vh)) / (vh * 0.5));
        railRef.current.style.opacity = (rf * chrome).toFixed(3);
        railRef.current.style.pointerEvents = rf > 0.05 ? '' : 'none';
      }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(reMeasure);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('resize', onResize);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="proto protoe">
      <Nav />

      {/* hero copy — the first screen, scrolls away as the grid rises */}
      <section className="pe-hero" ref={heroRef}>
        <div className="pe-hero__inner">
          <span className="kicker lbl" data-warp>Brand — Product — Engineering</span>
          <h1 className="statement">
            {STATEMENT_WORDS.flatMap((w, i) => {
              const span = <span className="word" data-warp key={i}>{w}</span>;
              return i === 0 ? [span] : [' ', span];
            })}
          </h1>
        </div>
      </section>

      {/* the scrolling mosaic — every card carries its info strip below the image */}
      <div className="pe-grid" ref={gridRef}>
        <div className="pe-grid__plane" ref={planeRef}>
          {GRID.map((g, i) => (
            <div className={'pe-cell' + (g.ratio === 'wide' ? ' pe-cell--wide' : g.ratio === 'tall' ? ' pe-cell--tall' : '')} key={i}>
              <div className="pe-cell__media">
                <img className="pe-img pe-img--base" src={g.src} alt="" loading={i < 6 ? 'eager' : 'lazy'}
                     onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = phFor(g); }} />
                <img className="pe-img pe-img--hover" src={g.hover} alt="" loading="lazy"
                     onError={(e) => { const c = e.currentTarget.closest('.pe-cell'); if (c) c.classList.add('pe-cell--nohover'); e.currentTarget.remove(); }} />
              </div>
              <div className="pe-cell__info">
                <span className="pe-ttl lbl">{g.name}</span>
                <span className="pe-svc lbl">{g.services.join(' · ')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* rail — pinned at the bottom while the grid scrolls behind, fades as content arrives */}
      <div className="p-rail p-rail--a pe-rail" ref={railRef}>
        <span className="lbl lbl--bright">01 — Recent Highlights</span>
        <span className="lbl">Scroll to learn more</span>
        <span className="lbl">Product Architect</span>
      </div>

      <HomeSections />
    </div>
  );
}
