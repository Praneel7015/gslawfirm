// site-shared.jsx, shared site atoms: Logo lockup, razorbill mark, icons, placeholder, WhatsApp button, mobile sticky bar

const { useState, useEffect, useRef, useMemo } = React;

// ─── Razorbill mark (image-based, using the actual logo asset) ───────────────
function Mark({ size = 36, tone = 'auto', style }) {
  // tone: 'dark' (black mark) | 'light' (white mark) | 'auto'
  const cls = tone === 'light' ? 'mark is-light' : tone === 'dark' ? 'mark is-dark' : 'mark is-dark';
  return <span className={cls} style={{ width: size, height: size, ...style }} />;
}

// ─── Logo lockup (horizontal: bird + wordmark) ───────────────────────────────
function Lockup({ size = 36, dark = false, onClick }) {
  return (
    <a className="lockup" href="#" onClick={(e) => { e.preventDefault(); onClick && onClick(); }}>
      <span
        className="lockup-mark"
      />
      <span className="lockup-text">
        <span className="lockup-name">GS Law Firm</span>
        <span className="lockup-tag">For your peace of mind. Forever.</span>
      </span>
    </a>
  );
}

// ─── Tiny abstract line icons for practice cards ─────────────────────────────
// Inspired by the razorbill mark's vertical strokes + beak curve. Minimal geometry.
function IconCriminal({ size = 36 }) {
  return (
    <svg viewBox="0 0 36 36" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="square">
      <line x1="6" y1="4" x2="6" y2="32" />
      <line x1="14" y1="4" x2="14" y2="32" />
      <line x1="22" y1="4" x2="22" y2="32" />
      <line x1="30" y1="4" x2="30" y2="32" />
      <line x1="3" y1="22" x2="33" y2="14" strokeWidth="1.2" />
    </svg>
  );
}
function IconCivil({ size = 36 }) {
  return (
    <svg viewBox="0 0 36 36" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1">
      <path d="M4 30 C 12 6, 24 6, 32 30" />
      <path d="M4 30 C 14 26, 22 26, 32 30" opacity=".55" />
      <circle cx="18" cy="14" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}
function IconCorporate({ size = 36 }) {
  return (
    <svg viewBox="0 0 36 36" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1">
      <rect x="4" y="6" width="28" height="2" />
      <rect x="4" y="14" width="28" height="2" />
      <rect x="4" y="22" width="28" height="2" />
      <line x1="4" y1="30" x2="32" y2="30" />
      <line x1="14" y1="2" x2="14" y2="34" opacity=".4" />
      <line x1="22" y1="2" x2="22" y2="34" opacity=".4" />
    </svg>
  );
}
function IconWill({ size = 36 }) {
  return (
    <svg viewBox="0 0 36 36" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1">
      <path d="M18 4 L18 32" />
      <path d="M10 12 C 14 14, 22 14, 26 12" />
      <path d="M8 20 C 13 23, 23 23, 28 20" opacity=".7" />
      <path d="M6 28 C 12 32, 24 32, 30 28" opacity=".4" />
    </svg>
  );
}
function IconHighCourt({ size = 36 }) {
  return (
    <svg viewBox="0 0 36 36" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1">
      <path d="M18 2 L18 34" />
      <path d="M18 6 L12 14 L18 22 L24 14 Z" opacity=".7" />
      <line x1="6" y1="14" x2="30" y2="14" opacity=".4" />
      <circle cx="18" cy="14" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

const PRACTICE_AREAS = [
  { id: 'criminal', n: '01', name: 'Criminal', icon: IconCriminal,
    desc: 'Bail, anticipatory bail, trial representation and appeals across magistrate and sessions courts.' },
  { id: 'civil', n: '02', name: 'Civil', icon: IconCivil,
    desc: 'Property, tenancy, contractual and consumer disputes, district court through appellate stages.' },
  { id: 'corporate', n: '03', name: 'Corporate', icon: IconCorporate,
    desc: 'Counsel on contracts, compliance, shareholder matters and commercial documentation for small firms.' },
  { id: 'succession', n: '04', name: 'Will & Succession', icon: IconWill,
    desc: 'Drafting of wills, probate, letters of administration, and inheritance disputes handled with discretion.' },
  { id: 'highcourt', n: '05', name: 'High Court', icon: IconHighCourt,
    desc: 'Writ petitions, criminal and civil revisions, and matters before the High Court of Telangana.' },
];

// ─── Placeholder image (mid-grey with crop marks) ────────────────────────────
function Placeholder({ label = 'Photo: TBD', ratio = '16/10', style }) {
  return (
    <div className="ph" style={{ aspectRatio: ratio, ...style }}>
      <span className="crop tl" /><span className="crop tr" />
      <span className="crop bl" /><span className="crop br" />
      <span className="ph-label">{label}</span>
    </div>
  );
}

// ─── Floating WhatsApp button ────────────────────────────────────────────────
function WhatsAppFab({ mobile = false }) {
  const onClick = (e) => {
    e.preventDefault();
    window.open(
      "https://wa.me/919963847704?text=" + encodeURIComponent("Hello, I'd like to enquire about a legal matter."),
      "_blank"
    );
  };
  return (
    <button className={"wa" + (mobile ? " wa-mobile" : "")} aria-label="Chat on WhatsApp" onClick={onClick}>
      <svg viewBox="0 0 32 32" fill="currentColor">
        <path d="M16.001 3.2C9.054 3.2 3.4 8.853 3.4 15.8c0 2.215.582 4.376 1.69 6.288L3.2 28.8l6.911-1.812a12.575 12.575 0 0 0 5.89 1.47h.005c6.946 0 12.6-5.653 12.6-12.6S22.948 3.2 16.001 3.2zm0 22.92h-.004c-1.876 0-3.716-.504-5.323-1.46l-.382-.227-3.954 1.037 1.057-3.857-.249-.395a10.42 10.42 0 0 1-1.602-5.617c.001-5.766 4.696-10.46 10.46-10.46 2.795 0 5.422 1.089 7.397 3.066a10.387 10.387 0 0 1 3.064 7.4c-.001 5.766-4.696 10.513-10.464 10.513zm5.736-7.823c-.314-.157-1.86-.918-2.149-1.022-.288-.105-.498-.157-.708.157-.21.314-.812 1.022-.996 1.232-.184.21-.367.236-.682.079-.314-.157-1.327-.489-2.527-1.56-.934-.834-1.564-1.862-1.748-2.176-.184-.314-.02-.484.138-.64.142-.141.314-.367.471-.55.157-.184.21-.315.314-.524.105-.21.053-.394-.026-.55-.079-.158-.708-1.706-.97-2.337-.255-.612-.514-.529-.708-.539-.183-.009-.394-.011-.604-.011a1.16 1.16 0 0 0-.838.394c-.288.314-1.1 1.075-1.1 2.621 0 1.546 1.127 3.04 1.283 3.25.157.21 2.214 3.382 5.366 4.74.75.324 1.336.518 1.793.663.753.24 1.439.206 1.981.125.604-.09 1.86-.76 2.122-1.494.262-.733.262-1.362.184-1.494-.079-.131-.288-.21-.604-.367z"/>
      </svg>
    </button>
  );
}

// ─── Mobile sticky bottom bar (Call · WhatsApp · Email) ──────────────────────
function MobileBar() {
  return (
    <div className="mbar">
      <a href="tel:+919963847704" aria-label="Call">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
        <span>Call</span>
      </a>
      <a href="https://wa.me/919963847704" aria-label="WhatsApp">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.6 6.32A7.85 7.85 0 0 0 12.05 4 7.94 7.94 0 0 0 4.1 11.94a7.84 7.84 0 0 0 1.06 3.97L4 20l4.2-1.1a7.93 7.93 0 0 0 3.84.98h.01a7.94 7.94 0 0 0 7.94-7.94 7.85 7.85 0 0 0-2.32-5.62zm-5.55 12.21h-.01a6.6 6.6 0 0 1-3.36-.92l-.24-.14-2.5.65.67-2.44-.16-.25a6.59 6.59 0 0 1-1.01-3.51 6.6 6.6 0 0 1 11.27-4.66 6.55 6.55 0 0 1 1.93 4.66 6.6 6.6 0 0 1-6.6 6.61z"/></svg>
        <span>Chat</span>
      </a>
      <a href="mailto:hello@gslawfirm.in" aria-label="Email">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="5" width="18" height="14" rx="1"/><path d="m3 7 9 6 9-6"/></svg>
        <span>Email</span>
      </a>
    </div>
  );
}

// ─── Site Header (with active link state) ────────────────────────────────────
function SiteHeader({ viewport, scrolled, onNav, active, currentPage }) {
  const [open, setOpen] = useState(false);
  if (viewport === 'mobile') {
    return (
      <>
        <header className={"site-header site-header-mobile" + (scrolled || currentPage !== 'home' ? " solid" : " on-dark")}>
          <Lockup dark={!(scrolled || currentPage !== 'home')} />
          <div style={{ display:'flex', alignItems:'center', gap:14 }}>
            <button className="btn-consult" style={{ padding:'7px 12px', fontSize:11 }} onClick={() => onNav && onNav('contact')}>
              Consult
            </button>
            <button className={"ham" + (open ? " open" : "")} aria-label="Menu" onClick={() => setOpen(o => !o)}>
              <span></span><span></span>
            </button>
          </div>
        </header>
        <div className={"mobile-menu" + (open ? " open" : "")}>
          {[
            ['About','about','01'],
            ['Practice','practice','02'],
            ['Approach','approach','03'],
            ['Contact','contact','04'],
          ].map(([label, key, num]) => (
            <a key={key} href="#" onClick={(e) => { e.preventDefault(); setOpen(false); onNav && onNav(key); }}>
              {label}<span className="num">{num}</span>
            </a>
          ))}
          <div className="menu-foot">
            +91 9963 847 704 · hello@gslawfirm.in<br/>
            Kondapur, Hyderabad
          </div>
        </div>
      </>
    );
  }
  // desktop
  return (
    <header className={"site-header" + (scrolled || currentPage !== 'home' ? " solid" : " on-dark")}>
      <Lockup dark={!(scrolled || currentPage !== 'home')} onClick={() => onNav && onNav('home')} />
      <nav className="nav">
        <a href="#" className={active === 'about' ? 'active' : ''} onClick={(e) => { e.preventDefault(); onNav && onNav('about'); }}>About</a>
        <a href="#" className={active === 'practice' ? 'active' : ''} onClick={(e) => { e.preventDefault(); onNav && onNav('practice'); }}>Practice</a>
        <a href="#" className={active === 'approach' ? 'active' : ''} onClick={(e) => { e.preventDefault(); onNav && onNav('approach'); }}>Approach</a>
        <a href="#" className={active === 'contact' ? 'active' : ''} onClick={(e) => { e.preventDefault(); onNav && onNav('contact'); }}>Contact</a>
        <button className="btn-consult" onClick={() => onNav && onNav('contact')}>
          Consult <span style={{ fontSize: 14 }}>→</span>
        </button>
      </nav>
    </header>
  );
}

Object.assign(window, {
  Mark, Lockup, Placeholder, WhatsAppFab, MobileBar, SiteHeader,
  PRACTICE_AREAS,
});
