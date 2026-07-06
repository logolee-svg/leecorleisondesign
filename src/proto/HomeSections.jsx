import { useState, useEffect } from 'react';
import { liveWork } from '../data/content';

// condense the manifest's verbose service arrays into short row tags
const SHORT = {
  'Brand Design': 'Brand', 'Brand Strategy': 'Brand', 'Product Design': 'Product',
  'Strategy': 'Strategy', 'Full-Stack Engineering': 'Engineering',
  'Web Design': 'Web', 'Web Development': 'Web', 'Website Development': 'Web',
  'Website Development Strategy': 'Web', 'Web Strategy': 'Web',
};
function shortServices(services = []) {
  const out = [];
  for (const s of services) {
    const v = SHORT[s] || s;
    if (!out.includes(v)) out.push(v);
  }
  return out.slice(0, 3).join(' · ');
}

const SERVICES = [
  { n: '01', name: 'Brand', items: ['Strategy & Positioning', 'Naming', 'Logo & Identity Systems', 'Visual Identity', 'Art Direction', 'Brand Architecture', 'Messaging & Voice', 'Guidelines'] },
  { n: '02', name: 'Product', items: ['UX / UI Design', 'Product Design', 'Design Systems', 'Interaction Design', 'Prototyping', 'User Research', 'Product Strategy', 'Design Ops'] },
  { n: '03', name: 'Engineering', items: ['Front-End Development', 'Full-Stack Build', 'React / Next.js', 'TypeScript', 'APIs & Integrations', 'Performance', 'Production Engineering', 'Shipping'] },
];

const EXPERIENCE = [
  { years: 'Ongoing', org: 'Lee Corleison Design', role: 'Principal', note: 'Brand, product, and full-stack engineering — direct with founders.' },
  { years: '2018 — 2026', org: 'Paloma', role: 'Executive Creative Director & Shareholder', note: 'Led brand and product across a venture portfolio now valued north of AUD $500M — fintech, healthtech, proptech, SaaS, and consumer.' },
  { years: '2015 — 2017', org: 'Afterpay', role: 'Product Designer', note: 'Designed the early app experience during its rapid growth phase.' },
  { years: '2011 — 2015', org: 'Carnival Labs', role: 'Mobile Product Design', note: 'Mobile products for Air New Zealand, DreamWorks, Kraft Foods, MAC Cosmetics, and AB InBev.' },
  { years: '2008 — 2010', org: '1-night.co.nz', role: 'Brand and product design. Shareholder.', note: "Creator of New Zealand's most advanced event ticketing and management software." },
  { years: '2005 — 2008', org: 'Massey University', role: 'Bachelor of Design — BDes', note: '' },
];

// Awards — NZ Best Design Awards (Designers Institute of NZ) + Australian Good Design
// Awards. `key` drives the medal-dot colour (see .aw__dot--* in proto.css). Newest first.
const AWARDS = [
  {
    body: 'New Zealand Best Design Awards',
    org: 'Designers Institute of New Zealand',
    items: [
      { year: '2024', tier: 'Silver',   key: 'silver',   entry: 'HUD',        cat: 'Digital Products', role: 'Creative Director', studio: 'Paloma' },
      { year: '2024', tier: 'Bronze',   key: 'bronze',   entry: 'WHEN',       cat: 'Digital Products', role: 'Design Director',   studio: 'Paloma × Universal Favourite' },
      { year: '2023', tier: 'Bronze',   key: 'bronze',   entry: 'Spinaway',   cat: 'Digital Products', role: 'Creative Director', studio: 'Paloma' },
      { year: '2023', tier: 'Finalist', key: 'finalist', entry: 'ChemCloud',  cat: 'Digital Products', role: 'Creative Director', studio: 'Paloma' },
      { year: '2022', tier: 'Silver',   key: 'silver',   entry: 'Authsignal', cat: 'Digital Products', role: 'Creative Director', studio: 'Dovetail Studios' },
    ],
  },
  {
    body: 'Australian Good Design Awards',
    org: 'Good Design Australia',
    items: [
      { year: '2024', tier: 'Winner', key: 'winner', entry: 'ChemCloud', cat: 'Apps & Software', role: 'Creative Director', studio: 'Paloma Group' },
    ],
  },
];

const TESTIMONIALS = [
  { quote: '“The clarity he brought to our brand and product was transformational — and then he shipped it.”', who: 'Placeholder Name — Role, Company' },
  { quote: '“He thinks like a founder and builds like an engineer. A genuine one-person studio.”', who: 'Placeholder Name — Role, Company' },
];

// work-row thumbnail: always use image 02, fall back to 01 if that's the only one.
// each is tried as .jpg → .png → .gif; if nothing exists, render nothing (no placeholder).
// the thumb keeps the image's own aspect ratio (square → square, wide → wide) — see CSS.
const THUMB_ORDER = (slug) => [
  `/work/${slug}/02.jpg`, `/work/${slug}/02.png`, `/work/${slug}/02.gif`,
  `/work/${slug}/01.jpg`, `/work/${slug}/01.png`, `/work/${slug}/01.gif`,
];
function WorkThumb({ slug }) {
  const order = THUMB_ORDER(slug);
  const [i, setI] = useState(0);
  if (i >= order.length) return null;
  return (
    <img className="work__thumb" src={order[i]} alt="" loading="lazy" onError={() => setI(i + 1)} />
  );
}

const SHOW_TESTIMONIALS = false; // temporarily hidden — awaiting real quotes

export default function HomeSections() {
  // subtle scroll-reveal: fade + lift each tagged block as it enters the viewport.
  // IntersectionObserver only — fully decoupled from scroll/rAF, so it cannot affect
  // scroll performance or the mobile momentum behaviour. Reveal-once (unobserve after).
  useEffect(() => {
    const els = document.querySelectorAll('.protof .rvl');
    if (!els.length) return;
    const revealAll = () => els.forEach((el) => el.classList.add('rvl--on'));
    // Show everything (no animation) if motion is reduced or IO is unavailable.
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) { revealAll(); return; }
    let io, fallback;
    try {
      let fired = false;
      io = new IntersectionObserver((entries, obs) => {
        fired = true;
        for (const e of entries) {
          if (e.isIntersecting) { e.target.classList.add('rvl--on'); obs.unobserve(e.target); }
        }
      }, { threshold: 0.15 }); // full viewport, no bottom margin → last element (footer) always reveals
      els.forEach((el) => io.observe(el));
      // Last-resort net: if the observer never delivers a callback, reveal everything so
      // content can't be stuck hidden. No-op in real browsers (initial callback fires at once).
      fallback = setTimeout(() => { if (!fired) revealAll(); }, 1800);
    } catch {
      revealAll(); // any observer failure → content must still be visible
    }
    return () => { clearTimeout(fallback); if (io) io.disconnect(); };
  }, []);

  // smooth scroll to top — use the page's Lenis instance if present, else native smooth
  const backToTop = () => {
    if (window.__lenis) window.__lenis.scrollTo(0, { duration: 1.1 });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return (
    <>
      {/* Profile */}
      <section className="sec sec--profile">
        <h2 className="lbl rvl">Who I Am</h2>
        <p className="rvl" style={{ '--i': 1 }}>
          For twenty years I've shaped brands and the products they become: identity, product
          design, and the engineering to ship them. As Executive Creative Director at Paloma, I led
          brand and product across a venture portfolio now worth more than half a billion, and
          designed the early Afterpay app that became an overnight success. I've also designed for
          DreamWorks, MAC, AB InBev and Air New Zealand. Today I work with founders directly,
          carrying the whole line myself, from the first mark to production code.
        </p>
      </section>

      {/* Services */}
      <section className="sec sec--svc">
        <div className="sec__head rvl">
          <h2 className="lbl lbl--bright">(02) Services</h2>
          <span className="lbl">What you can hire me for</span>
        </div>
        <div className="svc">
          {SERVICES.map((s, idx) => (
            <div className="svc__col rvl" key={s.n} style={{ '--i': idx + 1 }}>
              <span className="lbl">{s.n}</span>
              <h3 className="svc__name">{s.name}</h3>
              <ul className="svc__list">
                {s.items.map((it) => <li key={it}>{it}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Work */}
      <section className="sec sec--work">
        <div className="sec__head rvl">
          <h2 className="lbl lbl--bright">(03) Selected Work</h2>
          <span className="lbl">{liveWork.length} Projects — 2020 / 2026</span>
        </div>
        <ul className="work">
          {liveWork.map((w, i) => {
            const Tag = w.url ? 'a' : 'div';
            return (
              <li key={w.slug} className="rvl">
                <Tag className="work__row" {...(w.url ? { href: w.url, target: '_blank', rel: 'noopener noreferrer' } : {})}>
                  <span className="work__idx lbl">{String(i + 1).padStart(2, '0')}</span>
                  <span className="work__name">{w.name}</span>
                  <span className="work__svc lbl">{shortServices(w.services)}</span>
                  <span className="work__media" aria-hidden="true">
                    <WorkThumb slug={w.slug} />
                  </span>
                  <svg className="work__arr" width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M2 13L13 2M13 2H4M13 2V11" /></svg>
                </Tag>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Awards — NZ Best Design Awards + Australian Good Design Awards, grouped by body */}
      <section className="sec sec--awards">
        <div className="sec__head rvl">
          <h2 className="lbl lbl--bright">(04) Awards</h2>
          <span className="lbl">New Zealand &amp; Australia</span>
        </div>
        {AWARDS.map((grp) => (
          <div className="awgrp" key={grp.body}>
            <div className="awgrp__head rvl">
              <span className="awgrp__body lbl lbl--bright">{grp.body}</span>
              <span className="awgrp__org lbl">{grp.org}</span>
            </div>
            <ul className="awards">
              {grp.items.map((a, i) => (
                <li className="aw__row rvl" key={a.entry + a.year + i}>
                  <span className="aw__meta">
                    <span className={`aw__dot aw__dot--${a.key}`} aria-hidden="true" />
                    <span className="aw__tier">{a.tier}</span>
                    <span className="aw__year lbl">{a.year}</span>
                  </span>
                  <div className="aw__mid">
                    <span className="aw__entry">{a.entry}</span>
                    <span className="aw__cat lbl">{a.cat}</span>
                  </div>
                  <span className="aw__role">{a.role} — {a.studio}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* Experience */}
      <section className="sec sec--exp">
        <div className="sec__head rvl">
          <h2 className="lbl lbl--bright">(05) Experience</h2>
          <span className="lbl">Aotearoa &amp; Australia</span>
        </div>
        <ul className="exp">
          {EXPERIENCE.map((e) => (
            <li className="exp__row rvl" key={e.org}>
              <span className="exp__years lbl">{e.years}</span>
              <div className="exp__mid">
                <span className="exp__org">{e.org}</span>
                <span className="exp__role lbl">{e.role}</span>
              </div>
              <span className="exp__note">{e.note}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Testimonials — temporarily hidden via SHOW_TESTIMONIALS while awaiting real quotes */}
      {SHOW_TESTIMONIALS && (
      <section className="sec sec--test">
        <div className="sec__head">
          <span className="lbl lbl--bright">(06) Words</span>
          <span className="lbl" style={{ color: 'var(--faint)' }}>Placeholder — awaiting real quotes</span>
        </div>
        <blockquote className="test__featured">
          <p>“Lee is the rare designer who takes an idea from a blank page to a shipped product without ever losing the thread — brand, product, and code, from one mind.”</p>
          <cite className="lbl">Placeholder Name — Founder &amp; CEO, Company</cite>
        </blockquote>
        <div className="test__support">
          {TESTIMONIALS.map((t, i) => (
            <blockquote className="test__item" key={i}>
              <p>{t.quote}</p>
              <cite className="lbl">{t.who}</cite>
            </blockquote>
          ))}
        </div>
      </section>
      )}

      {/* Contact */}
      <section className="sec sec--contact">
        <div className="sec__head rvl">
          <h2 className="lbl lbl--bright">({SHOW_TESTIMONIALS ? '07' : '06'}) Contact</h2>
        </div>
        <h2 className="contact__cta rvl" style={{ '--i': 1 }}>Let's build<br />something.</h2>
        <div className="contact__links rvl" style={{ '--i': 2 }}>
          <a className="contact__link" href="mailto:leecorleison@gmail.com">
            <span className="lbl">Email</span>
            <span className="contact__val">leecorleison@gmail.com</span>
          </a>
          <a className="contact__link" href="tel:+64273092926">
            <span className="lbl">Phone</span>
            <span className="contact__val">027 309 2926</span>
          </a>
          <a className="contact__link" href="https://www.linkedin.com/in/lee-corleison-22bb8b106" target="_blank" rel="noopener noreferrer">
            <span className="lbl">Elsewhere</span>
            <span className="contact__val">LinkedIn ↗</span>
          </a>
        </div>
      </section>

      <footer className="p-footer rvl">
        <span className="lbl">Lee Corleison Design © 2026</span>
        <span className="lbl" style={{ color: 'var(--faint)' }}>Designed &amp; Built by Lee Corleison</span>
        <button type="button" className="p-totop lbl lbl--bright" onClick={backToTop}>
          Back to Top <span className="p-totop__arrow" aria-hidden="true">↑</span>
        </button>
      </footer>
    </>
  );
}
