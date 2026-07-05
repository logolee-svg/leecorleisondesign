import { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import HomeSections from './HomeSections';
import ContactModal from './ContactModal';
import { liveWork } from '../data/content';
import './proto.css';

// PROTO F — fork of proto-e. Same cinematic intro, snappy L→R reveal, 01→02 crossfade
// on hover, service shimmer and full-tile hairline frame. ONLY the grid differs:
// two shapes only — square (1:1) and horizontal rectangle (2:1). They sit SIDE BY SIDE:
// a 3-col grid (square = 1 col, wide = 2 cols) so every row is a clean square+wide pair,
// alternating sides left→right. Collapses to a single column at tablet width (900px).

const STATEMENT_WORDS = 'I design brands and build the products they become.'.split(' ');
// proto-f owns its own layout — 6 wide / 6 square, ordered so each row is a clean
// square+wide pair with the wide alternating left/right. (Independent of the shared TILE
// map, so proto-e is untouched.) 5 wide / 5 square = 5 clean rows.
const PF_LAYOUT = [
  ['tracksynk', 'wide'],  ['authsignal', 'square'],  // row 1  [ wide | square ]
  ['nextwork', 'square'], ['gondola', 'wide'],       // row 2  [ square | wide ]
  ['planna', 'wide'],     ['sucasa', 'square'],      // row 3  [ wide | square ]
  ['klippr', 'square'],   ['sipper', 'wide'],        // row 4  [ square | wide ]
  ['paloma', 'wide'],     ['geodde', 'square'],      // row 5  [ wide | square ]
];
const bySlug = Object.fromEntries(liveWork.map((w) => [w.slug, w]));
const GRID = PF_LAYOUT.filter(([slug]) => bySlug[slug]).map(([slug, ratio]) => {
  const w = bySlug[slug];
  return { slug, url: w.url, name: w.name, services: w.services || [], src: w.media[0], hover: w.media[1], ratio };
});
const RATIO_DIMS = { wide: '1200/600', square: '900/900' };
const phFor = (g) => `https://picsum.photos/seed/lcd-${g.slug}-1/${RATIO_DIMS[g.ratio] || '900/900'}`;

function Nav() {
  return (
    <nav className="p-nav">
      <div className="l"><span className="lbl lbl--bright">Lee Corleison</span></div>
      <div className="c">
        <span className="dot" />
        <span className="lbl">Available for Work</span>
      </div>
      <div className="r"><button type="button" className="p-navbtn lbl lbl--bright" onClick={() => window.dispatchEvent(new CustomEvent('open-contact'))}>Contact</button></div>
    </nav>
  );
}

// image only. 01 = cover, 02 = hover crossfade. Any of .jpg / .png / .gif (tried in that
// order, then a placeholder). GIFs animate natively in the <img>. No video.
function Tile({ g, i }) {
  const [base, setBase] = useState(g.src);      // /work/<slug>/01.jpg
  const [hover, setHover] = useState(g.hover);  // /work/<slug>/02.jpg
  const [noHover, setNoHover] = useState(false);
  const hoverRef = useRef(null);

  const onBaseError = () => {
    if (base.endsWith('01.jpg')) setBase(base.replace(/01\.jpg$/, '01.png'));
    else if (base.endsWith('01.png')) setBase(base.replace(/01\.png$/, '01.gif'));
    else if (!base.startsWith('http')) setBase(phFor(g));
  };
  const onHoverError = () => {
    if (hover.endsWith('02.jpg')) setHover(hover.replace(/02\.jpg$/, '02.png'));
    else if (hover.endsWith('02.png')) setHover(hover.replace(/02\.png$/, '02.gif'));
    else setNoHover(true);
  };
  // if the hover layer is a GIF, replay it from frame 1 on each hover (it's loop-once,
  // so it plays through and freezes on the last frame). src reload restarts from cache.
  const onEnter = () => {
    const el = hoverRef.current;
    if (el && /\.gif$/.test(hover)) { const s = el.src; el.src = ''; el.src = s; }
  };

  return (
    <div className={'pf-cell' + (g.ratio === 'wide' ? ' pf-cell--wide' : '') + (noHover ? ' pf-cell--nohover' : '')}
         onMouseEnter={onEnter}>
      <div className="pf-cell__media">
        <img className="pf-img pf-img--base" src={base} alt={g.name + (g.services.length ? ' — ' + g.services.slice(0, 2).join(', ') : '')} loading={i < 6 ? 'eager' : 'lazy'} onError={onBaseError} />
        {!noHover && (
          <img ref={hoverRef} className="pf-img pf-img--hover" src={hover} alt="" loading="lazy" onError={onHoverError} />
        )}
      </div>
      <div className="pf-cell__info">
        <span className="pf-ttl lbl">{g.name}</span>
        <span className="pf-svc lbl">{g.services.join(' · ')}</span>
      </div>
    </div>
  );
}

export default function ProtoF() {
  const gridRef = useRef(null);
  const planeRef = useRef(null);
  const heroRef = useRef(null);
  const railRef = useRef(null);

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);

    const lenis = new Lenis({ lerp: 0.09 });
    lenis.scrollTo(0, { immediate: true });
    window.__lenis = lenis; // let shared chrome (e.g. footer "Back to Top") drive it

    const grid = gridRef.current;
    const navEl = document.querySelector('.protof .p-nav');
    const mount = performance.now();
    const introLift = (elapsed, start, dur) => { const t = elapsed - start < 0 ? 0 : elapsed - start > dur ? 1 : (elapsed - start) / dur; return t * t * (3 - 2 * t); };
    const WARP_START = 0.42, WARP_END = 0.74;
    const STMT_START = 200, WORD_STAGGER = 45, WORD_DUR = 680, LIFT = 10;
    const STMT_END = STMT_START + 8 * WORD_STAGGER + WORD_DUR;
    const KICKER_START = STMT_END + 80, KICKER_DUR = 460;
    const CHROME_START = KICKER_START + 140, CHROME_DUR = 520;
    const LOCK_DUR = STMT_END;
    const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

    let raf, vh = window.innerHeight, locked = true;
    let warpEls = [], gridEls = [], cellY = [], cellXN = [], measured = false;
    let wordEls = [], kickerEl = null;

    // cells size themselves (aspect-ratio) — we just record each cell's centre for the reveal
    const measure = () => {
      if (!planeRef.current) return;
      gridEls = Array.from(planeRef.current.children);
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
    // keep the section you're viewing anchored to the top across a browser resize
    const NAV_H = 40;
    let anchorEl = null, anchorTimer = null;
    const captureAnchor = () => {
      anchorEl = Array.from(document.querySelectorAll('.protof .pf-hero, .protof .pf-grid, .protof .sec, .protof .p-footer'))
        .find((el) => el.getBoundingClientRect().bottom > NAV_H + 4) || null;
    };
    // Only re-anchor on a genuine WIDTH change (desktop window resize / orientation flip
    // that actually reflows the layout). On mobile, scrolling shows/hides the URL bar,
    // which fires `resize` with a changed HEIGHT only — repositioning on that snaps the
    // page back mid-flick and kills momentum scrolling. Ignore height-only changes.
    let lastW = window.innerWidth;
    const onResize = () => {
      const widthChanged = window.innerWidth !== lastW;
      lastW = window.innerWidth;
      measure();
      if (!widthChanged) return;   // mobile URL-bar toggle (height-only) — never reposition
      if (anchorTimer === null) captureAnchor();   // start of a resize burst — remember where we were
      else clearTimeout(anchorTimer);
      anchorTimer = setTimeout(() => {
        anchorTimer = null;
        if (anchorEl) {
          if (window.__lenis) window.__lenis.scrollTo(anchorEl, { immediate: true, offset: -NAV_H });
          else anchorEl.scrollIntoView();
        }
        anchorEl = null;
      }, 160);
    };

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

      // grid: snappy L→R reveal (CSS handles the subtle hover crossfade)
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
      clearTimeout(anchorTimer);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('resize', onResize);
      if (window.__lenis === lenis) window.__lenis = null;
      lenis.destroy();
    };
  }, []);

  return (
    <div className="proto protof">
      <Nav />

      {/* hero copy — the first screen, scrolls away as the grid rises */}
      <section className="pf-hero" ref={heroRef}>
        <div className="pf-hero__inner">
          <span className="kicker lbl" data-warp>Brand — Product — Engineering</span>
          <h1 className="statement">
            {STATEMENT_WORDS.flatMap((w, i) => {
              const span = <span className="word" data-warp key={i}>{w}</span>;
              return i === 0 ? [span] : [' ', span];
            })}
          </h1>
        </div>
      </section>

      {/* the scrolling grid — 2 cols max, square + wide only, every card carries its strip */}
      <div className="pf-grid" ref={gridRef}>
        <div className="pf-grid__plane" ref={planeRef}>
          {GRID.map((g, i) => <Tile key={i} g={g} i={i} />)}
        </div>
      </div>

      {/* rail — pinned at the bottom while the grid scrolls behind, fades as content arrives */}
      <div className="p-rail p-rail--a pf-rail" ref={railRef}>
        <span className="lbl lbl--bright">01 — Recent Highlights</span>
        <span className="lbl pf-rail__mid">Scroll to learn more</span>
        <span className="lbl">Product Architect</span>
      </div>

      <HomeSections />
      <ContactModal />
    </div>
  );
}
