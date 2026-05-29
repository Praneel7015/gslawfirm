// site-home.jsx, full home page (used for both desktop and mobile frames)

const HERO_VARIANTS = [
  { l1: "Everyone's there for your next case.", l2: "Who's there for the one after?", em: "That's us." },
  { l1: "Counsel that returns.", l2: "Year after year, matter after matter.", em: "Forever." },
  { l1: "Not the loudest in the room.", l2: "The one still in it tomorrow.", em: "That's us." },
];

function Hero({ viewport, heroVariant = 0, motifDensity = 'moderate' }) {
  const v = HERO_VARIANTS[heroVariant] || HERO_VARIANTS[0];
  const isMobile = viewport === 'mobile';
  const showWatermark = motifDensity !== 'subtle';
  return (
    <section className="hero">
      <div className="hero-grid"></div>
      {showWatermark && (
        <span
          className={"hero-bg-mark " + (isMobile ? "mobile" : "desktop")}
          style={{
            opacity: motifDensity === 'heavy' ? 0.18 : (isMobile ? 0.12 : 0.10),
          }}
        />
      )}
      <div className={"hero-inner" + (isMobile ? " hero-inner-mobile" : "")}>
        <div className="hero-eyebrow">
          <span className="line"></span>
          <span>GS Law Firm · Est. 2023 · Kondapur, Hyderabad</span>
        </div>
        <h1 className={"hero-title" + (isMobile ? " hero-title-mobile" : "")}>
          <span className="line">{v.l1}</span>
          <span className="line">{v.l2}</span>
          <span className="line em-line"><span className="em">{v.em}</span></span>
        </h1>
        <a className="hero-cta" href="#contact" onClick={(e) => e.preventDefault()}>
          Request a confidential consultation <span className="arrow">→</span>
        </a>
      </div>
      <div className={"hero-foot" + (isMobile ? " hero-foot-mobile" : "")}>
        <span>Adv. Aitha Sunitha · Sole Advocate</span>
        <span>{isMobile ? '01 / 09' : 'Scroll ↓'}</span>
      </div>
    </section>
  );
}

function IntroStrip({ viewport }) {
  const isMobile = viewport === 'mobile';
  return (
    <section className={"intro" + (isMobile ? " intro-mobile" : "")}>
      <div className="intro-tag">Introduction · 01</div>
      <h2>
        Founded in 2023 in Kondapur, Hyderabad, the firm undertakes criminal and civil matters
        as a solo-advocate practice, quietly, attentively, and with the same hand on every brief.
      </h2>
    </section>
  );
}

function Practice({ viewport, onNav }) {
  const isMobile = viewport === 'mobile';
  if (isMobile) {
    return (
      <section className="practice practice-mobile">
        <div className="section-head section-head-mobile">
          <div>
            <div className="eyebrow">Practice · 02</div>
            <h2 style={{ marginTop: 14 }}>Areas of work</h2>
          </div>
        </div>
        <div className="practice-list-mobile">
          {PRACTICE_AREAS.map((a) => {
            const Icon = a.icon;
            return (
              <a key={a.id} className="practice-card" href="#"
                 onClick={(e) => { e.preventDefault(); onNav && onNav('practice'); }}>
                <div className="icon"><Icon size={28} /></div>
                <h3>{a.name}</h3>
                <span className="arrow-r">→</span>
                <p>{a.desc}</p>
              </a>
            );
          })}
        </div>
      </section>
    );
  }
  return (
    <section className="practice">
      <div className="section-head">
        <div>
          <div className="eyebrow" style={{ marginBottom: 18 }}>Practice · 02</div>
          <h2>Areas<br/>of work</h2>
        </div>
        <div style={{ maxWidth: 380, color:'var(--muted)', fontSize: 15, lineHeight: 1.55, paddingBottom: 8 }}>
          All areas, one advocate. Each matter receives the same attention from first hearing to final order, no handing off, no rotating juniors, no surprises on counsel.
        </div>
      </div>
      <div className="practice-grid">
        {PRACTICE_AREAS.map((a) => {
          const Icon = a.icon;
          return (
            <a key={a.id} className="practice-card" href="#"
               onClick={(e) => { e.preventDefault(); onNav && onNav('practice'); }}>
              <div className="num">{a.n}</div>
              <div className="icon"><Icon /></div>
              <h3>{a.name}</h3>
              <p>{a.desc}</p>
              <div className="learn"><span>Learn more</span><span>→</span></div>
            </a>
          );
        })}
      </div>
    </section>
  );
}

function Approach({ viewport }) {
  const isMobile = viewport === 'mobile';
  const items = [
    { n: '01', t: 'Personal counsel', p: 'Your file is mine end to end. The same advocate who reads your brief is the one who argues your matter, and the one you call afterwards.' },
    { n: '02', t: 'Discreet representation', p: 'Most clients arrive at a difficult chapter. We keep the room small, the calls measured, and the documentation tight.' },
    { n: '03', t: 'Continuity beyond the verdict', p: 'A judgment is rarely the last page. We stay on for execution, appeals, and the quieter matters that follow.' },
  ];
  return (
    <section className={"approach" + (isMobile ? " approach-mobile" : "")}>
      <div className="approach-head">
        <div>
          <div className="eyebrow" style={{ marginBottom: 18 }}>Approach · 03</div>
          <h2>Three things we hold to.</h2>
        </div>
        {!isMobile && (
          <p>The razorbill, our quiet emblem, returns to the same cliff colony year after year. We borrow the metaphor with intent: continuity is the point.</p>
        )}
      </div>
      <div className="approach-grid">
        {items.map((it) => (
          <div key={it.n} className="approach-cell">
            <div className="num"><span className="dot"></span>{it.n}</div>
            <h3>{it.t}</h3>
            <p>{it.p}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Founder({ viewport }) {
  const isMobile = viewport === 'mobile';
  return (
    <section className={"founder" + (isMobile ? " founder-mobile" : "")}>
      <div className="founder-portrait">
        <div className="founder-monogram">
          <div className="mono-meta">
            <span>Sole Advocate</span>
            <span>Hyderabad, IN</span>
          </div>
          <div className="mono-letters">SS</div>
          <div className="mono-tag">Portrait · TBD</div>
        </div>
      </div>
      <div className="founder-body">
        <span className="eyebrow">Counsel · 04</span>
        <h2>Adv. Aitha Sunitha</h2>
        <div className="creds">B.Sc · M.Sc · LL.B · LL.M</div>
        <p>
          Ten-plus years of practice across criminal and civil matters in Hyderabad, with periodic appearances before the High Court of Telangana. Graduate of Padala Ram Reddy College of Law, enrolled with the Bar Council of Telangana.
        </p>
        <p>
          She founded the firm in 2023 to keep one promise plainly: to be the person you can call in the second year, and the fifth, and the tenth, not only on the day of your first hearing.
        </p>
        <dl className="founder-meta">
          <dt>Bar Council</dt><dd>Telangana · Enrolment ANE/####/2014</dd>
          <dt>Education</dt><dd>Padala Ram Reddy College of Law</dd>
          <dt>Languages</dt><dd>English · Telugu · Hindi</dd>
          <dt>Profile</dt><dd><a href="#" style={{ borderBottom:'1px solid currentColor', textDecoration:'none' }}>LinkedIn ↗</a></dd>
        </dl>
      </div>
    </section>
  );
}

function Location({ viewport }) {
  const isMobile = viewport === 'mobile';
  return (
    <section className={"location" + (isMobile ? " location-mobile" : "")}>
      <div className={"map" + (isMobile ? " map-mobile" : "")}>
        <div className="map-grid"></div>
        <div className="map-roads">
          <svg viewBox="0 0 600 540" preserveAspectRatio="none">
            <path d="M0,140 Q200,180 400,120 T600,160" stroke="rgba(255,255,255,.18)" strokeWidth="1.2" fill="none"/>
            <path d="M0,320 Q150,280 300,340 T600,300" stroke="rgba(255,255,255,.14)" strokeWidth="1" fill="none"/>
            <path d="M0,460 Q200,420 400,500 T600,440" stroke="rgba(255,255,255,.10)" strokeWidth=".8" fill="none"/>
            <path d="M120,0 Q160,200 100,420 T140,540" stroke="rgba(255,255,255,.10)" strokeWidth=".8" fill="none"/>
            <path d="M320,0 Q280,180 360,360 T300,540" stroke="rgba(255,255,255,.14)" strokeWidth="1" fill="none"/>
            <path d="M500,0 Q460,250 520,420 T480,540" stroke="rgba(255,255,255,.10)" strokeWidth=".8" fill="none"/>
          </svg>
        </div>
        <div className="map-pin">
          <div className="ring"></div>
          <div className="ring r2"></div>
          <div className="dot"></div>
          <div className="label">GS Law Firm · Sri Ramnagar</div>
        </div>
        <div className="map-attr">17.464°N · 78.366°E · Kondapur</div>
      </div>
      <div className="address">
        <span className="eyebrow">Visit · 05</span>
        <h3>Kondapur, Hyderabad</h3>
        <address className="addr-block">
          Sri Ramnagar Block C,<br/>
          Kondapur, Hyderabad,<br/>
          Telangana 500 084, India
        </address>
        <div className="address-row"><span className="k">Phone</span><a className="v" href="tel:+919963847704">+91 99638 47704</a></div>
        <div className="address-row"><span className="k">Email</span><a className="v" href="mailto:hello@gslawfirm.in">hello@gslawfirm.in</a></div>
        <div className="address-row"><span className="k">Hours</span><span className="v">Mon–Sat · 10:00–18:00 IST</span></div>
      </div>
    </section>
  );
}

function ContactForm({ viewport }) {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name:'', phone:'', email:'', message:'' });
  const isMobile = viewport === 'mobile';
  const onSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSent(true);
  };
  return (
    <section className={"contact" + (isMobile ? " contact-mobile" : "")}>
      <div className="contact-intro">
        <div className="eyebrow" style={{ marginBottom: 24 }}>Enquire · 06</div>
        <h2>{isMobile ? 'Send a brief note.' : 'Send a brief\u00A0note.'}</h2>
        <p>Tell us, in a few sentences, what you're dealing with. We respond within one working day, usually the same day.</p>
      </div>
      <div>
        {sent ? (
          <div className="form-success">
            <span className="ok">✓</span>
            <div>
              <h4>Note received.</h4>
              <p>We'll reach out to {form.email || 'you'} within one working day. For urgent matters, call +91 99638 47704.</p>
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit}>
            <div className="field-row">
              <div className="field">
                <label>Name</label>
                <input type="text" placeholder="Your full name" value={form.name}
                       onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="field">
                <label>Phone</label>
                <input type="tel" placeholder="+91" value={form.phone}
                       onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
            </div>
            <div className="field">
              <label>Email</label>
              <input type="email" placeholder="you@example.com" value={form.email}
                     onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="field">
              <label>Brief message</label>
              <textarea rows={3} placeholder="A few sentences about the matter, nothing confidential at this stage." value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })} />
            </div>
            <div className="form-foot">
              <button className="btn-submit" type="submit">Send enquiry <span>→</span></button>
              <div className="form-disclaim">
                Submitting this form does not create an attorney–client relationship. Nothing herein constitutes legal advice.
              </div>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

function Footer({ viewport, onNav }) {
  const isMobile = viewport === 'mobile';
  return (
    <footer className={"foot" + (isMobile ? " foot-mobile" : "")}>
      <div className="foot-top">
        <div className="foot-col foot-brand">
          <Lockup dark={true} />
          <p>A solo-advocate practice in Kondapur, Hyderabad. Founded 2023.</p>
        </div>
        <div className="foot-col">
          <h4>Practice</h4>
          <ul>
            {PRACTICE_AREAS.map(a => (
              <li key={a.id}>
                <a href="#" onClick={(e) => { e.preventDefault(); onNav && onNav('practice'); }}>{a.name}</a>
              </li>
            ))}
          </ul>
        </div>
        <div className="foot-col">
          <h4>Firm</h4>
          <ul>
            <li><a href="#" onClick={(e) => { e.preventDefault(); onNav && onNav('about'); }}>About</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); onNav && onNav('about'); }}>Approach</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); onNav && onNav('contact'); }}>Contact</a></li>
            <li><a href="#" onClick={(e) => e.preventDefault()}>LinkedIn ↗</a></li>
          </ul>
        </div>
        <div className="foot-col">
          <h4>Office</h4>
          <ul>
            <li>Sri Ramnagar Block C</li>
            <li>Kondapur, Hyderabad 500 084</li>
            <li><a href="tel:+919963847704">+91 99638 47704</a></li>
            <li><a href="mailto:hello@gslawfirm.in">hello@gslawfirm.in</a></li>
            <li>Mon–Sat · 10–18 IST</li>
          </ul>
        </div>
      </div>
      <div className="foot-bot">
        <div className="foot-disc">
          As per the rules of the Bar Council of India, advocates are not permitted to solicit work or advertise. The contents of this site are for informational purposes only and do not constitute legal advice or create any attorney–client relationship.
        </div>
        <div>© {new Date().getFullYear()} · GS Law Firm</div>
      </div>
    </footer>
  );
}

function HomePage({ viewport, scrolled, onNav, heroVariant, motifDensity }) {
  return (
    <>
      <SiteHeader viewport={viewport} scrolled={scrolled} onNav={onNav} active="home" currentPage="home" />
      <Hero viewport={viewport} heroVariant={heroVariant} motifDensity={motifDensity} />
      <IntroStrip viewport={viewport} />
      <Practice viewport={viewport} onNav={onNav} />
      <Approach viewport={viewport} />
      <Founder viewport={viewport} />
      <Location viewport={viewport} />
      <ContactForm viewport={viewport} />
      <Footer viewport={viewport} onNav={onNav} />
    </>
  );
}

Object.assign(window, {
  HomePage, Hero, IntroStrip, Practice, Approach, Founder, Location, ContactForm, Footer,
  HERO_VARIANTS,
});
