import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import HomeSections from './HomeSections';
import { liveWork, shotFallback } from '../data/content';
import './proto.css';

// PROTO C — same start as proto-b (black, copy lift+fade intro, two-step scroll
// gate), but the first scroll reveals a perfect responsive grid (3 cols x 4 rows)
// that fills the space between the header and the bottom rail. Cells rush in from
// small + dark + blurred → full + bright, staggered top-to-bottom.

const STATEMENT_WORDS = 'I design brands and build the products they become.'.split(' ');
// the 12 tiles map 1:1 to the live projects — each shows that project's cover (media[0])
const GRID = liveWork.slice(0, 12).map((w) => ({ slug: w.slug, url: w.url, src: w.media[0] }));

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

export default function ProtoC() {
  const gridRef = useRef(null);
  const planeRef = useRef(null);
  const stripRef = useRef(null);
  const heroRef = useRef(null);

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);

    const lenis = new Lenis({ lerp: 0.09 });
    lenis.scrollTo(0, { immediate: true });

    let phase = 'intro'; // intro → stars → revealing → open → unrevealing → stars
    let prog = 0, animStart = performance.now(), raf, warpEls = [], gridEls = [];
    const DUR = 1800;       // ms — grid reveal duration
    const INTRO_DUR = 1000; // ms — on-load copy lift + fade
    const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
    const clamp01 = (v) => Math.max(0, Math.min(1, v));

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
    const onWheel = (e) => {
      if (featured) { e.preventDefault(); dismiss(); return; } // any scroll minimises the open image first
      if (advance(e.deltaY > 0)) e.preventDefault();
    };
    const onKey = (e) => {
      if (featured) return; // while an image is featured, arrows page it (see onKeyFeat)
      if (['ArrowDown', 'PageDown', ' ', 'Spacebar'].includes(e.key)) { if (advance(true)) e.preventDefault(); }
      else if (['ArrowUp', 'PageUp'].includes(e.key)) { if (advance(false)) e.preventDefault(); }
    };
    let touchY = 0;
    const onTouchStart = (e) => { touchY = e.touches[0].clientY; };
    const onTouchMove = (e) => {
      if (featured) { e.preventDefault(); dismiss(); return; }
      if (advance(e.touches[0].clientY < touchY)) e.preventDefault();
    };
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKey);
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });

    // --- post-reveal interaction ---------------------------------------------
    // Ambient: the plane tilts in 3D toward the cursor (lerped in the loop) and
    // the hovered tile lifts forward. Click: the tile flies (FLIP) to centre to
    // own the prime space, the rest dim. Click the feature / a gap / Esc to
    // dismiss; click another tile to switch. Only active once settled.
    const grid = gridRef.current;
    const MAX_TILT = 6; // degrees
    let gridSettled = false, featured = null, gridRect = null, stripTimer = 0;
    const tilt = { x: 0, y: 0 }, tiltTarget = { x: 0, y: 0 };
    const lerp = (a, b, n) => a + (b - a) * n;
    const cacheRect = () => { if (grid) gridRect = grid.getBoundingClientRect(); };

    const STRIP_H = 40; // px — matches .pc-strip / .sec__head height
    const layoutFeature = (cell) => { // FLIP from grid slot → centred, framed feature box
      if (!gridRect) cacheRect();
      tilt.x = tilt.y = tiltTarget.x = tiltTarget.y = 0;       // snap flat for a clean read
      if (planeRef.current) planeRef.current.style.transform = '';
      // measure the TRUE grid slot — suspend the transition + transform so the read
      // isn't polluted by an in-flight reveal/hover animation, then restore for the FLIP
      cell.style.transition = 'none';
      cell.style.transform = 'none';
      const r = cell.getBoundingClientRect();
      cell.style.transition = '';
      const top = 48, bottom = window.innerHeight - 96, cy = (top + bottom) / 2; // leave room for the caption
      const availH = bottom - top, availW = window.innerWidth - 112;
      // round scale + offsets so the strip can be pinned to the EXACT rendered edge
      const s = +Math.min((availH * 0.78) / r.height, (availW * 0.72) / r.width).toFixed(3); // framed margin
      const tW = r.width * s, tH = r.height * s;
      const dx = +(window.innerWidth / 2 - (r.left + r.width / 2)).toFixed(1);
      const dy = +((cy - STRIP_H / 2) - (r.top + r.height / 2)).toFixed(1); // lift: centre the image+strip block on cy
      cell.style.transform = `translate(${dx}px, ${dy}px) scale(${s})`;
      cell.style.borderRadius = `${(3 / s).toFixed(2)}px ${(3 / s).toFixed(2)}px 0 0`; // ~3px once scaled; square at the strip seam
      // pure-black title + services strip butted directly below the image (rides with each one)
      if (stripRef.current && gridRect) {
        const data = liveWork[gridEls.indexOf(cell)] || {};
        stripRef.current.children[0].textContent = data.name || '';
        stripRef.current.children[1].textContent = (data.services || []).join(' · ');
        const imageBottom = r.top + r.height / 2 + dy + tH / 2;
        const featLeft = window.innerWidth / 2 - tW / 2;
        stripRef.current.style.left = `${featLeft.toFixed(1)}px`;
        stripRef.current.style.width = `${tW.toFixed(1)}px`;
        stripRef.current.style.top = `${Math.round(imageBottom - gridRect.top) - 1}px`; // 1px tuck → no gap
      }
    };
    const feature = (cell) => {
      if (featured && featured !== cell) { featured.classList.remove('is-feat'); featured.style.transform = ''; featured.style.borderRadius = ''; }
      featured = cell;
      cell.classList.add('is-feat');
      grid.classList.add('pc-grid--featuring');
      layoutFeature(cell);
      // the strip only shows once the image has zoomed into place — never mid-motion,
      // so it never floats detached during open / close / toggle
      clearTimeout(stripTimer);
      if (stripRef.current) stripRef.current.classList.remove('pc-strip--show');
      stripTimer = setTimeout(() => stripRef.current && stripRef.current.classList.add('pc-strip--show'), 330);
    };
    const dismiss = () => {
      if (!featured) return;
      clearTimeout(stripTimer);
      if (stripRef.current) stripRef.current.classList.remove('pc-strip--show');
      featured.classList.remove('is-feat');
      featured.style.transform = '';
      featured.style.borderRadius = '';
      featured = null;
      grid.classList.remove('pc-grid--featuring');
    };
    const onMove = (e) => {
      if (!gridSettled || featured) return;
      if (!gridRect) cacheRect();
      const nx = (e.clientX - (gridRect.left + gridRect.width / 2)) / (gridRect.width / 2);
      const ny = (e.clientY - (gridRect.top + gridRect.height / 2)) / (gridRect.height / 2);
      tiltTarget.y = Math.max(-1, Math.min(1, nx)) * MAX_TILT;   // rotateY ← horizontal
      tiltTarget.x = Math.max(-1, Math.min(1, -ny)) * MAX_TILT;  // rotateX ← vertical
    };
    const onLeave = () => { tiltTarget.x = 0; tiltTarget.y = 0; };
    const onClickGrid = (e) => {
      if (!gridSettled) return;
      if (featured) { dismiss(); return; }   // featured → any click closes cleanly
      const cell = e.target.closest && e.target.closest('.pc-cell');
      if (cell) feature(cell);               // not featured → click a tile to open it
    };
    const browse = (dir) => {                // arrow-key paging while featured
      if (!featured) return;
      const i = gridEls.indexOf(featured);
      if (i >= 0) feature(gridEls[(i + dir + gridEls.length) % gridEls.length]);
    };
    const onKeyFeat = (e) => {
      if (e.key === 'Escape') { dismiss(); return; }
      if (!featured) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); browse(1); }
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); browse(-1); }
    };
    const onResizeC = () => { cacheRect(); if (featured) layoutFeature(featured); };
    if (grid) {
      grid.addEventListener('pointermove', onMove, { passive: true });
      grid.addEventListener('pointerleave', onLeave, { passive: true });
      grid.addEventListener('click', onClickGrid);
    }
    window.addEventListener('keydown', onKeyFeat);
    window.addEventListener('resize', onResizeC);

    // drive every tile from a 0→1 reveal value (reverse-staggers when it falls)
    const driveCells = (p) => {
      for (let i = 0; i < gridEls.length; i++) {
        const e = easeOutCubic(clamp01((p - i * 0.04) / 0.45));
        const el = gridEls[i];
        el.style.opacity = e.toFixed(3);
        el.style.transform = `scale(${(0.5 + 0.5 * e).toFixed(4)})`;
        el.style.filter = `brightness(${(0.25 + 0.75 * e).toFixed(3)}) blur(${((1 - e) * 6).toFixed(2)}px)`;
      }
    };

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

      // hero copy: on-load lift + fade, then scroll-away warp (same as proto-b)
      if (!warpEls.length && heroRef.current) warpEls = Array.from(heroRef.current.querySelectorAll('[data-warp]'));
      if (phase === 'intro') {
        const ip = Math.min(1, (performance.now() - animStart) / INTRO_DUR);
        for (let i = 0; i < warpEls.length; i++) {
          const e = easeOutCubic(clamp01((ip - i * 0.067) / 0.4));
          const el = warpEls[i];
          el.style.opacity = e.toFixed(3);
          el.style.transform = `translateY(${((1 - e) * 16).toFixed(2)}px)`;
          el.style.filter = 'none';
        }
        if (ip >= 1) phase = 'stars';
      } else {
        for (let i = 0; i < warpEls.length; i++) {
          const lp = clamp01((prog - i * 0.05) / 0.22);
          const e = Math.pow(lp, 2.2);
          const el = warpEls[i];
          el.style.transform = `scale(${(1 - e * 0.62).toFixed(4)})`;
          el.style.opacity = (1 - e).toFixed(3);
          el.style.filter = `blur(${(e * 14).toFixed(2)}px)`;
        }
      }

      // grid: rushes in on reveal, settles for interaction, then — once you scroll
      // into the content ('open') — shrinks away tile-by-tile tied to scroll, the
      // same reverse-stagger as scrolling back to the top. Copy stays gone (uses prog).
      if (!gridEls.length && planeRef.current) gridEls = Array.from(planeRef.current.children);
      const gridReveal = phase === 'open'
        ? 1 - clamp01(window.scrollY / (window.innerHeight * 0.7)) // finishes ~30% sooner
        : prog;
      if (phase === 'open') {
        if (gridSettled) { gridSettled = false; if (grid) grid.classList.remove('pc-grid--live'); }
        driveCells(gridReveal);
      } else if (gridSettled) {
        if (phase === 'unrevealing') { // scrolling back up — hand control back to the reveal
          gridSettled = false;
          dismiss();
          tilt.x = tilt.y = tiltTarget.x = tiltTarget.y = 0;
          if (planeRef.current) planeRef.current.style.transform = '';
          if (grid) grid.classList.remove('pc-grid--live');
        } else if (!featured && planeRef.current) {
          // ambient 3D tilt — lerp toward the cursor target, one transform write
          tilt.x = lerp(tilt.x, tiltTarget.x, 0.08);
          tilt.y = lerp(tilt.y, tiltTarget.y, 0.08);
          planeRef.current.style.transform = `rotateX(${tilt.x.toFixed(2)}deg) rotateY(${tilt.y.toFixed(2)}deg)`;
        }
      } else {
        driveCells(gridReveal);
        if (gridReveal >= 1 && phase === 'revealed') {
          gridSettled = true; // release inline styles so CSS/interaction can take over
          gridEls.forEach((el) => { el.style.transform = ''; el.style.opacity = ''; el.style.filter = ''; });
          if (grid) grid.classList.add('pc-grid--live');
          cacheRect();
        }
      }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      if (grid) {
        grid.removeEventListener('pointermove', onMove);
        grid.removeEventListener('pointerleave', onLeave);
        grid.removeEventListener('click', onClickGrid);
      }
      window.removeEventListener('keydown', onKeyFeat);
      window.removeEventListener('resize', onResizeC);
      clearTimeout(stripTimer);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="proto protoc">
      <Nav />
      <div className="pc-grid" ref={gridRef} aria-hidden="true">
        <div className="pc-grid__plane" ref={planeRef}>
          {GRID.map((g, i) => (
            <div className="pc-cell" key={i}>
              <img src={g.src} alt="" loading="eager"
                   onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = shotFallback(g.slug, 0); }} />
            </div>
          ))}
        </div>
        <div className="pc-strip" ref={stripRef}>
          <span className="pc-strip__title lbl" />
          <span className="pc-strip__svc lbl" />
        </div>
        <span className="pc-caption lbl">← → to browse&ensp;·&ensp;Escape to close</span>
      </div>

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
            <span className="lbl lbl--bright">01 — Recent Highlights</span>
            <span className="lbl">Scroll to learn more</span>
            <span className="lbl">Product Architect</span>
          </div>
        </div>
      </section>

      <HomeSections />
    </div>
  );
}
