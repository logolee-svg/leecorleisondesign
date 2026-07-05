import { useEffect, useState } from 'react';

// dark editorial contact modal — opens from the nav "Contact" (via the global
// 'open-contact' event). No form: just the direct channels + availability + a live clock.
const CHANNELS = [
  { label: 'Email', value: 'leecorleison@gmail.com', href: 'mailto:leecorleison@gmail.com' },
  { label: 'Phone', value: '027 309 2926', href: 'tel:+64273092926' },
  { label: 'LinkedIn', value: 'LinkedIn', href: 'https://www.linkedin.com/in/lee-corleison-22bb8b106', external: true },
];

const clockFmt = new Intl.DateTimeFormat('en-NZ', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Pacific/Auckland' });

export default function ContactModal() {
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState('');

  // open on the global event the nav dispatches
  useEffect(() => {
    const openIt = () => setOpen(true);
    window.addEventListener('open-contact', openIt);
    return () => window.removeEventListener('open-contact', openIt);
  }, []);

  // while open: live clock, Esc-to-close, and lock the page scroll behind it
  useEffect(() => {
    if (!open) return;
    const tick = () => { try { setTime(clockFmt.format(new Date())); } catch { /* noop */ } };
    tick();
    const clockId = setInterval(tick, 20000);
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    window.__lenis?.stop();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      clearInterval(clockId);
      window.removeEventListener('keydown', onKey);
      window.__lenis?.start();
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  return (
    <div className={'cmodal' + (open ? ' is-open' : '')} aria-hidden={!open}>
      <div className="cmodal__scrim" onClick={() => setOpen(false)} />
      <div className="cmodal__panel" role="dialog" aria-modal="true" aria-label="Contact Lee Corleison">
        <button type="button" className="cmodal__close" onClick={() => setOpen(false)} aria-label="Close">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M4 4l12 12M16 4L4 16" /></svg>
        </button>

        <div className="cmodal__head">
          <span className="lbl"><span className="dot dot--inline" /> Available for work</span>
        </div>

        <h2 className="cmodal__cta">Let's build<br />something.</h2>

        <div className="cmodal__links">
          {CHANNELS.map((c) => (
            <a key={c.label} className="cmodal__link" href={c.href}
               {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
              <span className="cmodal__link-label lbl">{c.label}</span>
              <span className="cmodal__link-val">{c.value}</span>
              <svg className="cmodal__arr" width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M2 13L13 2M13 2H4M13 2V11" /></svg>
            </a>
          ))}
        </div>

        <div className="cmodal__foot">
          <span className="lbl">Working across NZ &amp; Australia</span>
          <span className="lbl cmodal__clock">{time ? `${time} · NZ` : 'NZ'}</span>
        </div>
      </div>
    </div>
  );
}
