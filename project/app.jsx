// app.jsx, Canvas wrapper: page tabs, side-by-side desktop+mobile frames, tweaks

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#6B0F1A",
  "headlineWeight": 300,
  "dark": false,
  "motifDensity": "moderate",
  "heroVariant": 0,
  "showDisclaimer": true
}/*EDITMODE-END*/;

// ─── Headline weight options ─────────────────────────────────────────────────
// All copy is Helvetica Neue; the only typographic dial is the weight used
// on display headings (h1/h2 across the site).
const HEADLINE_WEIGHTS = [
  { value: 300, label: 'Light · 300' },
  { value: 400, label: 'Regular · 400' },
  { value: 700, label: 'Bold · 700' },
];

const ACCENT_OPTIONS = [
  { value: '#6B0F1A', name: 'Oxblood' },
  { value: '#B8924A', name: 'Gold' },
  { value: '#1B3A2F', name: 'Forest' },
  { value: '#1a1a1a', name: 'Mono' },
];

const PAGES = [
  { id: 'home',       label: 'Home' },
  { id: 'practice',   label: 'Practice Detail' },
  { id: 'about',      label: 'About' },
  { id: 'contact',    label: 'Contact' },
  { id: 'disclaimer', label: 'Disclaimer Modal' },
];

// ─── A single page renderer that picks the right page component ──────────────
function renderPage(pageId, props) {
  switch (pageId) {
    case 'home':       return <HomePage {...props} />;
    case 'practice':   return <PracticeDetailPage areaId="criminal" {...props} />;
    case 'about':      return <AboutPage {...props} />;
    case 'contact':    return <ContactPage {...props} />;
    case 'disclaimer': return <HomePage {...props} />;
    default:           return <HomePage {...props} />;
  }
}

// ─── A scaled desktop frame (1440 internal, rendered narrower via transform) ──
function DesktopFrame({ children, pageId }) {
  const innerRef = React.useRef(null);
  const [clipHeight, setClipHeight] = React.useState(0);
  React.useLayoutEffect(() => {
    if (!innerRef.current) return;
    const inner = innerRef.current;
    const ro = new ResizeObserver(() => {
      // inner natural height × scale factor
      setClipHeight(inner.getBoundingClientRect().height); // already scaled
    });
    ro.observe(inner);
    return () => ro.disconnect();
  }, [pageId]);

  return (
    <div className="frame-desktop">
      <div className="frame-desktop-bar">
        <span className="dot" /><span className="dot" /><span className="dot" />
        <div className="url">gslawfirm.in{pageId !== 'home' ? '/' + pageId : ''}</div>
      </div>
      <div className="frame-desktop-clip" style={{ height: clipHeight }}>
        <div className="frame-desktop-inner" ref={innerRef}>
          {children}
        </div>
      </div>
    </div>
  );
}

// ─── A phone-shaped mobile frame with internal scroll ─────────────────────────
function MobileFrame({ children, pageId, dark }) {
  const scrollRef = React.useRef(null);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    setScrolled(false);
  }, [pageId]);

  const onScroll = (e) => {
    setScrolled(e.target.scrollTop > 60);
  };

  // pass `scrolled` down by cloning children with prop
  const cloned = React.Children.map(children, child =>
    React.isValidElement(child) ? React.cloneElement(child, { scrolled }) : child
  );

  return (
    <div className="frame-mobile">
      <div
        className="frame-mobile-screen"
        style={{ '--mobile-status': pageId === 'home' && !scrolled ? '#ffffff' : (dark ? '#fff' : '#0c0c0c') }}
      >
        <div className="frame-mobile-notch"></div>
        <div className="frame-mobile-status">
          <span>9:41</span>
          <span className="right-icons">
            <span className="signal"></span>
            <span style={{ marginLeft: 4, fontWeight: 600 }}>5G</span>
            <span className="battery" style={{ marginLeft: 6 }}></span>
          </span>
        </div>
        <div className="frame-mobile-scroll" ref={scrollRef} onScroll={onScroll}>
          {cloned}
        </div>
      </div>
    </div>
  );
}

// ─── Main App ────────────────────────────────────────────────────────────────
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [page, setPage] = React.useState('home');
  const [showModal, setShowModal] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  // when page changes to "disclaimer", show modal
  React.useEffect(() => {
    setShowModal(page === 'disclaimer');
  }, [page]);

  // detect canvas scroll
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 200);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Apply accent + dark mode + headline weight via CSS vars
  const siteStyle = {
    '--accent': t.accent,
    '--headline-weight': t.headlineWeight,
  };

  const navTo = (pageId) => {
    setPage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const pageProps = {
    onNav: navTo,
    heroVariant: t.heroVariant,
    motifDensity: t.motifDensity,
  };

  const siteCls = "site" + (t.dark ? " is-dark" : "");
  const isModalPage = page === 'disclaimer';

  return (
    <div className="canvas">
      <header className="canvas-head">
        <div className="canvas-head-inner">
          <div className="canvas-brand">
            <span className="pip"></span>
            <span><b>GS Law Firm</b> · Brand & Site Design</span>
          </div>
          <nav className="tabs">
            {PAGES.map(p => (
              <button
                key={p.id}
                className={"tab" + (page === p.id ? " is-active" : "")}
                onClick={() => navTo(p.id)}
              >
                {p.label}
              </button>
            ))}
          </nav>
          <div className="canvas-meta">
            {ACCENT_OPTIONS.find(a => a.value === t.accent)?.name || 'Custom'} · Helvetica Neue {t.headlineWeight === 300 ? 'Light' : t.headlineWeight === 400 ? 'Regular' : 'Bold'} · {t.dark ? 'Dark' : 'Light'}
          </div>
        </div>
      </header>

      <div className="frames-cap">
        <div className="cap cap-desktop">
          <b>Desktop</b> · 1440 × auto · scaled to fit
        </div>
        <div className="cap cap-mobile">
          <b>Mobile</b> · 390 × 760 · iOS frame
        </div>
      </div>

      <div className="frames">
        {/* Desktop frame */}
        <DesktopFrame pageId={page}>
          <div className={siteCls} style={{ ...siteStyle, position: 'relative' }}>
            {renderPage(page, { viewport: 'desktop', scrolled, ...pageProps })}
            <WhatsAppFab />
            {isModalPage && showModal && (
              <DisclaimerModal viewport="desktop" onClose={() => setShowModal(false)} />
            )}
          </div>
        </DesktopFrame>

        {/* Mobile frame */}
        <div style={{ position: 'sticky', top: 92, alignSelf: 'flex-start' }}>
          <MobileFrame pageId={page} dark={t.dark}>
            <MobileSite siteCls={siteCls} siteStyle={siteStyle} page={page} pageProps={pageProps} showModal={isModalPage && showModal} onCloseModal={() => setShowModal(false)} />
          </MobileFrame>
        </div>
      </div>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Accent color" />
        <TweakColor
          label="Accent"
          value={t.accent}
          options={ACCENT_OPTIONS.map(o => o.value)}
          onChange={(v) => setTweak('accent', v)}
        />

        <TweakSection label="Typography" />
        <TweakSelect
          label="Headline weight"
          value={String(t.headlineWeight)}
          options={HEADLINE_WEIGHTS.map(w => ({ value: String(w.value), label: w.label }))}
          onChange={(v) => setTweak('headlineWeight', Number(v))}
        />
        <div style={{ fontSize: 10.5, color:'rgba(41,38,27,.5)', fontFamily:'Helvetica Neue, sans-serif', letterSpacing:'.08em', textTransform:'uppercase', marginTop: 4 }}>
          One family · line-height 0.9 · tracking -4%
        </div>

        <TweakSection label="Theme" />
        <TweakToggle label="Dark mode" value={t.dark} onChange={(v) => setTweak('dark', v)} />

        <TweakSection label="Hero copy" />
        <TweakRadio
          label="Wording"
          value={String(t.heroVariant)}
          options={['0', '1', '2']}
          onChange={(v) => setTweak('heroVariant', Number(v))}
        />
        <div style={{ fontSize: 10.5, color:'rgba(41,38,27,.5)', fontFamily:'ui-monospace,monospace', letterSpacing:'.04em', marginTop: 4 }}>
          {HERO_VARIANTS[t.heroVariant].l1} / {HERO_VARIANTS[t.heroVariant].em}
        </div>

        <TweakSection label="Razorbill motif" />
        <TweakRadio
          label="Density"
          value={t.motifDensity}
          options={['subtle', 'moderate', 'heavy']}
          onChange={(v) => setTweak('motifDensity', v)}
        />
      </TweaksPanel>
    </div>
  );
}

// ─── Mobile site wrapper (handles status bar tint via scroll) ─────────────────
function MobileSite({ siteCls, siteStyle, page, pageProps, showModal, onCloseModal, scrolled }) {
  return (
    <div className={siteCls} style={{ ...siteStyle, position: 'relative', minHeight: '100%' }}>
      {renderPage(page, { viewport: 'mobile', scrolled, ...pageProps })}
      <WhatsAppFab mobile={true} />
      <MobileBar />
      {showModal && (
        <DisclaimerModal viewport="mobile" onClose={onCloseModal} />
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
