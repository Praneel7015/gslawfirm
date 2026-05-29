// app-print.jsx, Static print layout: cover + every design page in both viewports.

const PRINT_PAGES = [
  { id: 'home',         num: '01', label: 'Home',             desc: 'Landing experience' },
  { id: 'practice',     num: '02', label: 'Practice Detail',  desc: 'Criminal practice page (representative)' },
  { id: 'about',        num: '03', label: 'About',            desc: 'Firm & mark, founding story' },
  { id: 'contact',      num: '04', label: 'Contact',          desc: 'Three channels + enquiry form' },
  { id: 'disclaimer',   num: '05', label: 'Disclaimer Modal', desc: 'BCI-compliant gating modal' },
];

function renderPagePrint(pageId, props) {
  switch (pageId) {
    case 'home':       return <HomePage {...props} />;
    case 'practice':   return <PracticeDetailPage areaId="criminal" {...props} />;
    case 'about':      return <AboutPage {...props} />;
    case 'contact':    return <ContactPage {...props} />;
    case 'disclaimer': return <DisclaimerModal {...props} onClose={() => {}} />;
    default:           return null;
  }
}

function PrintDesktopFrame({ pageId, children }) {
  return (
    <div className="print-frame-desktop">
      <div className="print-frame-desktop-shell">
        <div className="print-frame-desktop-bar">
          <span className="dot" /><span className="dot" /><span className="dot" />
          <div className="url">gslawfirm.in{pageId !== 'home' ? '/' + pageId : ''}</div>
        </div>
        <div className="print-frame-desktop-inner">
          {children}
        </div>
      </div>
    </div>
  );
}

function PrintMobileFrame({ pageId, children }) {
  return (
    <div className="print-frame-mobile">
      <div
        className="print-frame-mobile-screen"
        style={{ '--mobile-status': pageId === 'home' ? '#ffffff' : '#0c0c0c' }}
      >
        <div className="print-frame-mobile-notch"></div>
        <div className="print-frame-mobile-status">
          <span>9:41</span>
          <span className="right-icons">
            <span className="signal"></span>
            <span style={{ marginLeft: 4, fontWeight: 700 }}>5G</span>
            <span className="battery" style={{ marginLeft: 6 }}></span>
          </span>
        </div>
        {children}
      </div>
    </div>
  );
}

function PrintSection({ page, viewport }) {
  const isDisclaimer = page.id === 'disclaimer';
  const pageProps = { viewport, scrolled: true, onNav: () => {}, heroVariant: 0, motifDensity: 'moderate' };

  return (
    <section className="print-section">
      <div className="print-section-head">
        <div className="num"><b>{page.num}</b> · {page.label}</div>
        <h2>{page.label}.</h2>
        <div className="right">{viewport === 'desktop' ? 'Desktop · 1440 px' : 'Mobile · 390 px'}</div>
      </div>
      <div className="print-cap">
        <span>{page.desc}</span>
        <span>{viewport === 'desktop' ? 'Browser frame, scaled to fit sheet' : 'iOS bezel, full content height'}</span>
      </div>
      <div className="site" style={{ '--accent': '#6B0F1A', '--headline-weight': 300 }}>
        {viewport === 'desktop' ? (
          <PrintDesktopFrame pageId={page.id}>
            {isDisclaimer ? (
              <div style={{ background: '#0a0a0a', padding: '120px 60px', minHeight: 720, display: 'grid', placeItems: 'center' }}>
                <div style={{ background: '#fff', maxWidth: 560, width: '100%' }}>
                  {renderPagePrint('disclaimer', pageProps)}
                </div>
              </div>
            ) : (
              renderPagePrint(page.id, pageProps)
            )}
          </PrintDesktopFrame>
        ) : (
          <PrintMobileFrame pageId={page.id}>
            {isDisclaimer ? (
              <div style={{ background: '#0a0a0a', padding: '60px 18px', minHeight: 760, display: 'grid', placeItems: 'center' }}>
                <div style={{ background: '#fff', width: '100%' }}>
                  {renderPagePrint('disclaimer', { ...pageProps, viewport: 'mobile' })}
                </div>
              </div>
            ) : (
              renderPagePrint(page.id, { ...pageProps, viewport: 'mobile' })
            )}
          </PrintMobileFrame>
        )}
      </div>
    </section>
  );
}

function Cover() {
  const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
  return (
    <section className="print-cover">
      <header className="print-cover-head">
        <div className="pip">
          <div className="pip-mark" />
          <span>GS Law Firm · Brand & Site Design</span>
        </div>
        <div className="date">{today} · v1</div>
      </header>
      <div className="print-cover-body">
        <h1>
          Counsel that <span className="em">returns.</span><br/>
          Year after year,<br/>
          matter after matter.
        </h1>
        <p className="lede">
          Visual & interaction design for the firm's first web presence, a solo-advocate practice in Kondapur, Hyderabad. Editorial-minimal, Bar-Council-compliant, single-family typography (Helvetica Neue) throughout.
        </p>
      </div>
      <footer className="print-cover-foot">
        <div className="cell"><span className="k">Pages</span><span className="v">Home · Practice · About · Contact · Disclaimer</span></div>
        <div className="cell"><span className="k">Viewports</span><span className="v">Desktop 1440 · Mobile 390</span></div>
        <div className="cell"><span className="k">Type system</span><span className="v">Helvetica Neue · 0.9 / -4%</span></div>
        <div className="cell"><span className="k">Palette</span><span className="v">Oxblood · Black · Bone</span></div>
      </footer>
    </section>
  );
}

function PrintApp() {
  // Trigger window.print() once fonts and layout are settled.
  React.useEffect(() => {
    // Auto-print only when explicitly opened via print tab
    if (!location.search.includes('print=1') && !window.__AUTO_PRINT) return;
    const run = async () => {
      if (document.fonts && document.fonts.ready) {
        try { await document.fonts.ready; } catch {}
      }
      // Layout settle delay, long-form pages with lots of content need time.
      await new Promise(r => setTimeout(r, 900));
      window.print();
    };
    run();
  }, []);

  return (
    <div className="print-canvas">
      <Cover />
      {PRINT_PAGES.map(page => (
        <React.Fragment key={page.id}>
          <PrintSection page={page} viewport="desktop" />
          <PrintSection page={page} viewport="mobile" />
        </React.Fragment>
      ))}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<PrintApp />);
