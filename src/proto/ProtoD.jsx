import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import HomeSections from './HomeSections';
import { liveWork } from '../data/content';
import './proto.css';

// PROTO D — copy lift+fade intro on black, then a real SCROLLING grid of 16:9
// tiles (never cropped): 3 cols desktop / 2 tablet+phone / 1 narrow. Each tile
// blooms in from small+dark+blurred as it scrolls up into view, and recedes the
// same way as it leaves the top — the reveal/shrink now ride the scroll instead
// of firing on one locked screen. Click a tile to FLIP it to the centre of the
// viewport (title/services strip + arrow browse); scroll / Esc / click closes.
// (Sibling of proto-c, which keeps the original viewport-locked grid.)

const STATEMENT_WORDS = 'I design brands and build the products they become.'.split(' ');
// 4-column mosaic: each project's tile shape (wide 2:1 / tall 1:2 / square) comes from the manifest
const GRID = liveWork.slice(0, 12).map((w) => ({ slug: w.slug, url: w.url, name: w.name, src: w.media[0], ratio: w.tile }));
// placeholder image authored to each tile's ratio (until real per-project covers exist → no crop)
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

export default function ProtoD() {
  const gridRef = useRef(null);
  const planeRef = useRef(null);
  const stripRef = useRef(null);
  const heroRef = useRef(null);
  const railRef = useRef(null);

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);

    const lenis = new Lenis({ lerp: 0.09 });
    lenis.scrollTo(0, { immediate: true });

    const grid = gridRef.current;
    const navEl = document.querySelector('.protod .p-nav');
    const mount = performance.now();
    // smoothstep (ease-in-out) — gentle at both ends for an elegant fade from black
    const introLift = (elapsed, start, dur) => { const t = elapsed - start < 0 ? 0 : elapsed - start > dur ? 1 : (elapsed - start) / dur; return t * t * (3 - 2 * t); };
    const WARP_START = 0.42, WARP_END = 0.74; // copy holds, then dissolves between these fractions of a screen scrolled
    // --- first-load intro: one smooth fade-up of the statement → kicker → header/rail ---
    const STMT_START = 200;     // statement begins fading up from black
    const WORD_STAGGER = 45;    // gentle left-to-right wash (heavy overlap → continuous, not choppy)
    const WORD_DUR = 680;       // smooth per-word fade
    const LIFT = 10;            // px — barely-there up-lift; the fade carries it
    const STMT_END = STMT_START + 8 * WORD_STAGGER + WORD_DUR;
    const KICKER_START = STMT_END + 80;    // kicker fades in once the line has landed
    const KICKER_DUR = 460;
    const CHROME_START = KICKER_START + 140; // header (nav) + bottom rail fade in just after the kicker
    const CHROME_DUR = 520;
    const LOCK_DUR = STMT_END;             // scroll held only through the statement reveal
    const STRIP_H = 40;     // px — .pd-strip height
    const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

    let raf, vh = window.innerHeight, locked = true;
    let warpEls = [], gridEls = [], cellY = [], cellXN = [], measured = false;
    let featured = null, hovered = null, stripTimer = 0, closeTimer = 0;
    let wordEls = [], kickerEl = null; // statement word spans + kicker (collected once)

    // --- measure each tile's document-space centre (transform-independent) -----
    // 16:9 cells reserve their height via aspect-ratio, so layout is stable even
    // before images load. Re-run on resize / late layout.
    const measure = () => {
      if (!planeRef.current) return;
      gridEls = Array.from(planeRef.current.children);
      // square base: set the row height to the column track width so 1x1 = square
      const colW = parseFloat(getComputedStyle(planeRef.current).gridTemplateColumns.split(' ')[0]) || 0;
      if (colW) planeRef.current.style.gridAutoRows = colW + 'px';
      cellY = []; const cx = [];
      for (const el of gridEls) {
        const pt = el.style.transform; el.style.transform = 'none';
        const r = el.getBoundingClientRect();
        el.style.transform = pt;
        cellY.push(r.top + window.scrollY + r.height / 2);
        cx.push(r.left + r.width / 2);
      }
      const minX = Math.min(...cx), maxX = Math.max(...cx);
      cellXN = cx.map((x) => (maxX > minX ? (x - minX) / (maxX - minX) : 0)); // 0 (left) → 1 (right)
      vh = window.innerHeight;
      measured = true;
    };

    // --- click-to-expand (FLIP a tile to the centre of the viewport) -----------
    const layoutFeature = (cell) => {
      // measure the TRUE grid slot — suspend transform so the read isn't polluted
      cell.style.transition = 'none';
      cell.style.transform = 'none';
      const r = cell.getBoundingClientRect();
      cell.style.transition = ''; // hand back to .is-feat's transition for the open
      // the feature fills out to the page margins (40px desktop / 12px mobile), capped by
      // the vertical room left for the strip + caption beneath it
      const MARGIN = window.innerWidth <= 540 ? 12 : 40;
      const top = 50, bottom = vh - 56, cy = (top + bottom) / 2;
      const availH = (bottom - top) - STRIP_H, availW = window.innerWidth - MARGIN * 2;
      const s = +Math.min(availH / r.height, availW / r.width).toFixed(3);
      const tW = r.width * s, tH = r.height * s;
      const dx = +(window.innerWidth / 2 - (r.left + r.width / 2)).toFixed(1);
      const dy = +((cy - STRIP_H / 2) - (r.top + r.height / 2)).toFixed(1); // centre image+strip block on cy
      cell.style.transform = `translate(${dx}px, ${dy}px) scale(${s})`;
      cell.style.borderRadius = `${(3 / s).toFixed(2)}px ${(3 / s).toFixed(2)}px 0 0`; // ~3px, square at the seam
      if (stripRef.current) {
        const data = liveWork[gridEls.indexOf(cell)] || {};
        stripRef.current.children[0].textContent = data.name || '';
        stripRef.current.children[1].textContent = (data.services || []).join(' · ');
        const imageBottom = r.top + r.height / 2 + dy + tH / 2; // viewport Y (strip is position:fixed)
        stripRef.current.style.left = `${(window.innerWidth / 2 - tW / 2).toFixed(1)}px`;
        stripRef.current.style.width = `${tW.toFixed(1)}px`;
        stripRef.current.style.top = `${Math.round(imageBottom) - 1}px`;
      }
    };
    const clearHover = () => {
      if (!hovered) return;
      hovered.style.transform = ''; hovered.style.filter = ''; hovered.classList.remove('is-hover');
      hovered = null;
    };
    const feature = (cell) => {
      clearHover();
      if (featured && featured !== cell) { featured.classList.remove('is-feat'); featured.style.transform = ''; featured.style.borderRadius = ''; }
      clearTimeout(closeTimer);
      featured = cell;
      // strip inline styles off the others so the CSS recede/dim takes over cleanly
      for (const el of gridEls) {
        if (el === cell) continue;
        el.style.transform = ''; el.style.opacity = ''; el.style.filter = ''; el.classList.remove('is-hover');
      }
      cell.classList.add('is-feat');
      cell.classList.remove('is-hover');
      grid.classList.add('pd-grid--featuring');
      layoutFeature(cell);
      // strip only shows once the image has settled — never floats mid-motion
      clearTimeout(stripTimer);
      if (stripRef.current) stripRef.current.classList.remove('pd-strip--show');
      stripTimer = setTimeout(() => stripRef.current && stripRef.current.classList.add('pd-strip--show'), 360);
    };
    const dismiss = () => {
      if (!featured) return;
      const f = featured; featured = null;
      clearTimeout(stripTimer);
      if (stripRef.current) stripRef.current.classList.remove('pd-strip--show');
      grid.classList.remove('pd-grid--featuring');
      f.style.transform = ''; f.style.borderRadius = ''; // animates back via .is-feat transition
      clearTimeout(closeTimer);
      closeTimer = setTimeout(() => { f.classList.remove('is-feat'); }, 620);
    };
    const browse = (dir) => {
      if (!featured) return;
      const i = gridEls.indexOf(featured);
      if (i >= 0) feature(gridEls[(i + dir + gridEls.length) % gridEls.length]);
    };

    // --- ambient hover: the tile under the cursor tilts in 3D toward it ---------
    const onPointerMove = (e) => {
      if (locked || featured) return;
      const cell = e.target.closest && e.target.closest('.pd-cell');
      if (!cell || !cell.classList.contains('is-set')) { clearHover(); return; }
      if (hovered && hovered !== cell) clearHover();
      hovered = cell; cell.classList.add('is-hover');
      const r = cell.getBoundingClientRect();
      const nx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      const ny = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      const ry = Math.max(-1, Math.min(1, nx)) * 5;
      const rx = Math.max(-1, Math.min(1, -ny)) * 5;
      cell.style.transform = `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) scale(1.045)`;
      cell.style.filter = 'brightness(1.06)';
    };
    const onClickGrid = (e) => {
      if (locked) return;
      if (featured) { dismiss(); return; }
      const cell = e.target.closest && e.target.closest('.pd-cell');
      if (cell) feature(cell);
    };
    const onKeyFeat = (e) => {
      if (e.key === 'Escape') { dismiss(); return; }
      if (!featured) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); browse(1); }
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); browse(-1); }
    };

    // --- scroll gating: hold the page for the intro; close the feature first ----
    const onWheel = (e) => { if (featured) { e.preventDefault(); dismiss(); } else if (locked) e.preventDefault(); };
    const onKey = (e) => { if (!featured && locked && ['ArrowDown', 'PageDown', ' ', 'Spacebar'].includes(e.key)) e.preventDefault(); };
    let touchY = 0;
    const onTouchStart = (e) => { touchY = e.touches[0].clientY; };
    const onTouchMove = (e) => { if (featured) { e.preventDefault(); dismiss(); } else if (locked) e.preventDefault(); };
    const onResize = () => { measure(); if (featured) layoutFeature(featured); };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKey);
    window.addEventListener('keydown', onKeyFeat);
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('resize', onResize);
    if (grid) {
      grid.addEventListener('pointermove', onPointerMove, { passive: true });
      grid.addEventListener('pointerleave', clearHover, { passive: true });
      grid.addEventListener('click', onClickGrid);
    }
    const reMeasure = setTimeout(measure, 320); // catch late layout (fonts, etc.)

    const loop = (t) => {
      lenis.raf(t);
      const now = performance.now();
      const elapsed = now - mount;
      vh = window.innerHeight;
      if (locked) { if (elapsed >= LOCK_DUR) locked = false; else lenis.scrollTo(0, { immediate: true }); }
      const sy = window.scrollY;

      // hero copy: one smooth first-load fade-up — the whole statement washes up from
      // black (gentle L→R, heavily overlapped so it reads continuous), then the kicker
      // fades in, then the header/rail. On scroll the words warp away as tuned.
      if (!warpEls.length && heroRef.current) {
        warpEls = Array.from(heroRef.current.querySelectorAll('[data-warp]'));
        kickerEl = warpEls[0];
        wordEls = warpEls.slice(1);
      }
      const warp = clamp01((sy / vh - WARP_START) / (WARP_END - WARP_START));
      // statement: continuous fade + slight lift, word by word, composed with the scroll warp
      for (let i = 0; i < wordEls.length; i++) {
        const el = wordEls[i];
        const start = STMT_START + i * WORD_STAGGER;
        const lift = introLift(elapsed, start, WORD_DUR);
        const ee = Math.pow(clamp01((warp - i * 0.045) / 0.22), 2.2);
        el.style.opacity = (lift * (1 - ee)).toFixed(3);
        el.style.transform = `translateY(${((1 - lift) * LIFT * (1 - ee)).toFixed(2)}px) scale(${(1 - ee * 0.62).toFixed(4)})`;
        el.style.filter = ee > 0.001 ? `blur(${(ee * 14).toFixed(2)}px)` : 'none';
      }
      // kicker: fade + slight lift in after the statement, warp away on scroll
      if (kickerEl) {
        const kl = introLift(elapsed, KICKER_START, KICKER_DUR);
        const kee = Math.pow(clamp01(warp / 0.22), 2.2);
        kickerEl.style.opacity = (kl * (1 - kee)).toFixed(3);
        kickerEl.style.transform = `translateY(${((1 - kl) * LIFT * (1 - kee)).toFixed(2)}px) scale(${(1 - kee * 0.62).toFixed(4)})`;
        kickerEl.style.filter = kee > 0.001 ? `blur(${(kee * 14).toFixed(2)}px)` : 'none';
      }
      // header (nav) + bottom rail fade in just after the kicker
      const chrome = introLift(elapsed, CHROME_START, CHROME_DUR);
      if (navEl) navEl.style.opacity = chrome.toFixed(3);

      // grid: each tile blooms in as it rises into view, recedes as it leaves the
      // top. Fully-on-screen tiles drop their inline styles (.is-set) so CSS hover
      // + the JS tilt own them. Featured / closing tiles are left to the FLIP.
      if (!measured) measure();
      if (!featured) {
        // SNAPPY-but-smooth reveal: a thin transition band at the top/bottom edges (so the
        // crisp, full tiles fill the middle), tiles coming from further (bigger scale + a
        // vertical rise), resolving fast via easeOutQuart. Grabbable across most of the view.
        const RD = vh * 0.15, TOP = 64, TRAVEL = 50, STAGGER = 80;
        for (let i = 0; i < gridEls.length; i++) {
          const el = gridEls[i];
          if (el.classList.contains('is-feat')) continue;
          const cy = cellY[i] - sy + cellXN[i] * STAGGER; // L→R cascade (leftmost leads, like the hero copy)
          const eIn = clamp01((vh - cy) / RD), eOut = clamp01((cy - TOP) / RD);
          const e = Math.min(eIn, eOut);
          if (e >= 0.85) { // full + hoverable across the bulk of the viewport
            if (!el._set) { el.style.transform = ''; el.style.opacity = ''; el.style.filter = ''; el.classList.add('is-set'); el._set = true; }
          } else {
            if (el._set) { el.classList.remove('is-set'); el._set = false; }
            if (el === hovered) hovered = null;
            const ee = 1 - Math.pow(1 - e, 4);                       // easeOutQuart — snappy, still smooth
            const ty = (eIn <= eOut ? 1 : -1) * (1 - ee) * TRAVEL;   // rise up into / out of the slot
            el.style.opacity = ee.toFixed(3);
            el.style.transform = `translateY(${ty.toFixed(1)}px) scale(${(0.5 + 0.5 * ee).toFixed(4)})`;
            el.style.filter = `brightness(${(0.45 + 0.55 * ee).toFixed(3)}) blur(${((1 - ee) * 3).toFixed(2)}px)`;
          }
        }
      }

      // rail: pinned at the bottom, fades out as the content rises (hidden while featuring)
      if (railRef.current && grid) {
        const rf = clamp01((grid.offsetTop + grid.offsetHeight - (sy + vh)) / (vh * 0.5));
        railRef.current.style.opacity = featured ? '0' : (rf * chrome).toFixed(3);
        railRef.current.style.pointerEvents = (!featured && rf > 0.05) ? '' : 'none';
      }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(stripTimer); clearTimeout(closeTimer); clearTimeout(reMeasure);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('keydown', onKeyFeat);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('resize', onResize);
      if (grid) {
        grid.removeEventListener('pointermove', onPointerMove);
        grid.removeEventListener('pointerleave', clearHover);
        grid.removeEventListener('click', onClickGrid);
      }
      lenis.destroy();
    };
  }, []);

  return (
    <div className="proto protod">
      <Nav />

      {/* hero copy — the first screen, scrolls away as the grid rises */}
      <section className="pd-hero" ref={heroRef}>
        <div className="pd-hero__inner">
          <span className="kicker lbl" data-warp>Brand — Product — Engineering</span>
          <h1 className="statement">
            {STATEMENT_WORDS.flatMap((w, i) => {
              const span = <span className="word" data-warp key={i}>{w}</span>;
              return i === 0 ? [span] : [' ', span];
            })}
          </h1>
        </div>
      </section>

      {/* the scrolling 16:9 grid */}
      <div className="pd-grid" ref={gridRef} aria-hidden="true">
        <div className="pd-grid__plane" ref={planeRef}>
          {GRID.map((g, i) => (
            <div className={'pd-cell' + (g.ratio === 'wide' ? ' pd-cell--wide' : g.ratio === 'tall' ? ' pd-cell--tall' : '')} key={i}>
              <img src={g.src} alt="" loading={i < 6 ? 'eager' : 'lazy'}
                   onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = phFor(g); }} />
            </div>
          ))}
        </div>
      </div>

      {/* rail — pinned at the bottom while the grid scrolls behind, fades as content arrives */}
      <div className="p-rail p-rail--a pd-rail" ref={railRef}>
        <span className="lbl lbl--bright">01 — Recent Highlights</span>
        <span className="lbl">Scroll to learn more</span>
        <span className="lbl">Product Architect</span>
      </div>

      {/* feature overlays (fixed to the viewport) */}
      <div className="pd-strip" ref={stripRef}>
        <span className="pd-strip__title lbl" />
        <span className="pd-strip__svc lbl" />
      </div>
      <span className="pd-caption lbl">← → to browse&ensp;·&ensp;Escape to close</span>

      <HomeSections />
    </div>
  );
}
