// site-pages.jsx — Practice detail, About, Contact pages + Disclaimer modal

function PracticeDetailPage({ viewport, onNav, areaId = 'criminal', motifDensity = 'moderate' }) {
  const isMobile = viewport === 'mobile';
  const area = PRACTICE_AREAS.find(a => a.id === areaId) || PRACTICE_AREAS[0];
  const adjacent = PRACTICE_AREAS.filter(a => a.id !== area.id);

  const COPY = {
    criminal: {
      lede: 'Representation in criminal matters at every stage — from the first notice to appellate review.',
      paragraphs: [
        'Most clients meet us at a particular kind of moment: a phone call, a notice, a knock at the door. The work that follows is rarely linear. We start by listening, then by reading what is already on file, and then by deciding — together — what the most measured next step looks like.',
        'The practice covers the routine and the unusual. Bail applications and anticipatory bail. Quashing petitions. Trial representation across magistrate and sessions courts. Cross-examination of witnesses where the file calls for it. Appeals and revisions when the verdict warrants further argument.',
        'We keep the room small. The same advocate who reads your brief is the one who appears for you, and the one you call afterwards. No rotating juniors. No surprise on counsel at the next date.',
      ],
      handle: [
        'Anticipatory & regular bail',
        'FIR quashing under § 482',
        'Sessions court trial representation',
        'Cross-examination of witnesses',
        'Criminal appeals & revisions',
        'White-collar & economic offences',
        'Cheque dishonour (N.I. Act § 138)',
        'Matrimonial offences (§ 498A)',
      ],
    },
    civil: {
      lede: 'Civil matters handled with patience — the kind that often outlast the criminal calendar.',
      paragraphs: [
        'Civil work is slower work. A property dispute can take years; a tenancy matter, months; a consumer complaint, weeks. We plan for the time the work actually takes, not the time anyone wishes it would take.',
        'The firm appears in district and city civil courts, with periodic matters before the High Court where appellate or writ relief is sought. We draft carefully, file deliberately, and avoid arguments we are not asked to make.',
      ],
      handle: [
        'Property & title disputes',
        'Partition & inheritance suits',
        'Tenancy & eviction',
        'Specific performance of contracts',
        'Consumer disputes',
        'Recovery suits',
        'Injunctions & interim relief',
        'Family & matrimonial (civil)',
      ],
    },
    corporate: {
      lede: 'Counsel to small and mid-size firms on contracts, compliance, and quieter commercial matters.',
      paragraphs: [
        'The corporate practice is deliberately modest in scope. We work with founders and small-firm owners on the documents that matter — and on the questions that surface before the documents do.',
        'Common engagements include shareholder agreements, employment contracts, vendor and service agreements, and ongoing counsel on compliance posture. We try, where we can, to write contracts that read.',
      ],
      handle: [
        'Shareholder & founders\u2019 agreements',
        'Employment & contractor contracts',
        'Vendor & service agreements',
        'Commercial dispute resolution',
        'Regulatory & compliance counsel',
        'NDAs & IP assignments',
      ],
    },
    succession: {
      lede: 'Wills, probate and inheritance work — handled quietly, and as fully as such matters require.',
      paragraphs: [
        'Succession work asks for two things from counsel: precision in the paperwork and discretion in the room. Family matters are rarely only legal matters.',
        'We draft wills, obtain probate, file letters of administration, and represent parties in inheritance disputes. Where the situation permits, we encourage settlement; where it does not, we contest carefully.',
      ],
      handle: [
        'Will drafting & execution',
        'Probate applications',
        'Letters of administration',
        'Succession certificates',
        'Inheritance disputes',
        'Family settlement deeds',
      ],
    },
    highcourt: {
      lede: 'Selected appearances before the High Court of Telangana on writ, criminal and civil revision matters.',
      paragraphs: [
        'High Court work is not the bulk of the practice, but it is regular. The firm appears periodically before the High Court of Telangana — primarily on writ petitions, criminal and civil revisions, and matters arising from district-court orders.',
        'We are selective about the matters we take to the High Court. The bar is higher than it appears in print, and not every grievance reads as a question of law.',
      ],
      handle: [
        'Writ petitions (Article 226)',
        'Criminal revisions',
        'Civil revisions & second appeals',
        'Quashing petitions',
        'Bail applications (High Court)',
        'PILs (selective)',
      ],
    },
  };

  const c = COPY[area.id] || COPY.criminal;
  const Icon = area.icon;

  return (
    <>
      <SiteHeader viewport={viewport} scrolled={true} onNav={onNav} active="practice" currentPage="practice" />
      <section className={"pd-hero" + (isMobile ? " pd-hero-mobile" : "")}>
        <div className="crumb">
          <a href="#" onClick={(e) => { e.preventDefault(); onNav && onNav('home'); }} style={{ color:'inherit', textDecoration:'none' }}>Home</a>
          <span>/</span>
          <a href="#" onClick={(e) => e.preventDefault()} style={{ color:'inherit', textDecoration:'none' }}>Practice</a>
          <span>/</span>
          <span style={{ color:'#fff' }}>{area.name}</span>
        </div>
        <h1>{area.name}.</h1>
        <p className="lede">{c.lede}</p>
        <span
          className="pd-hero-mark"
        />
      </section>
      <section className={"pd-body" + (isMobile ? " pd-body-mobile" : "")}>
        <div className="pd-content">
          <p className="lede" style={{ display:'flex', gap:24, alignItems:'flex-start' }}>
            <span style={{ color:'var(--accent)', flexShrink:0, marginTop:4 }}><Icon size={isMobile ? 28 : 36} /></span>
            <span>{c.paragraphs[0]}</span>
          </p>
          {c.paragraphs.slice(1).map((p, i) => <p key={i}>{p}</p>)}
          <div className="pd-handle">
            <h3>What we handle</h3>
            <ul>
              {c.handle.map((h, i) => (
                <li key={i}>
                  <span className="li-num">{String(i + 1).padStart(2, '0')}</span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <aside className="pd-side">
          <div className="pd-cta">
            <h4>Discuss your {area.name.toLowerCase()} matter in confidence.</h4>
            <p>A first conversation, by phone or in office, with no obligation.</p>
            <a href="#" onClick={(e) => { e.preventDefault(); onNav && onNav('contact'); }}>
              Request a consultation →
            </a>
          </div>
          <div className="pd-adj">
            <h4>Adjacent areas</h4>
            <ul>
              {adjacent.map(a => (
                <li key={a.id}>
                  <a href="#" onClick={(e) => { e.preventDefault(); }}>{a.name}</a>
                  <span style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--soft)' }}>→</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </section>
      <Footer viewport={viewport} onNav={onNav} />
    </>
  );
}

function AboutPage({ viewport, onNav }) {
  const isMobile = viewport === 'mobile';
  return (
    <>
      <SiteHeader viewport={viewport} scrolled={true} onNav={onNav} active="about" currentPage="about" />
      <section className={"about-hero" + (isMobile ? " about-hero-mobile" : "")}>
        <span className="eyebrow">About · GS Law Firm</span>
        <h1>A small practice, kept small on purpose.</h1>
      </section>
      <section className={"about-symbol" + (isMobile ? " about-symbol-mobile" : "")}>
        <div className="mark-big"></div>
        <div className="text">
          <span className="eyebrow">On the mark</span>
          <h2>The razorbill returns to the same cliff colony year after year — mating for life, hewing close to family.</h2>
          <p>It is a quiet bird, not a striking one. It does not announce itself. It is, however, reliable in a way that few seabirds are.</p>
          <p>We took the metaphor on purpose. The work of a small law practice, done well, is the work of returning — to the same client, the same court, the same files, with the same attention as the first day.</p>
        </div>
      </section>
      <section className={"about-story" + (isMobile ? " about-story-mobile" : "")}>
        <div className="col-label">Founding · 2023</div>
        <div className="about-story-content">
          <p>The firm opened its doors in 2023 in Kondapur, Hyderabad. The premise was unfashionable: one advocate, working on one file at a time, available for as long as the matter lasts — and, where the relationship calls for it, well beyond.</p>
          <p>Adv. Sunitha Sindhole spent more than a decade in the trenches of criminal and civil practice before founding the firm. The decision to go out alone was not made lightly. It was made because, in her view, the larger the room a client's file passes through, the more often something quiet but important gets lost in the crossing.</p>
          <p>The firm takes a small number of matters at any one time. It is not a question of preference; it is a question of mathematics. There is one set of hands on every file, and those hands have a finite week.</p>
          <p>This site exists to make finding us straightforward. It is not a billboard. We have no rankings to claim and no testimonials to print. What we have is the willingness to sit with you and decide, plainly, whether we are the right firm for what you are dealing with.</p>
        </div>
      </section>
      <Footer viewport={viewport} onNav={onNav} />
    </>
  );
}

function ContactPage({ viewport, onNav }) {
  const isMobile = viewport === 'mobile';
  return (
    <>
      <SiteHeader viewport={viewport} scrolled={true} onNav={onNav} active="contact" currentPage="contact" />
      <section className={"cp-hero" + (isMobile ? " cp-hero-mobile" : "")}>
        <span className="eyebrow">Contact · GS Law Firm</span>
        <h1>Three ways to reach us.</h1>
        <p className="lede">We answer the phone between 10 and 18 IST, Monday through Saturday. Outside those hours, the form and WhatsApp are read first thing the next working day.</p>
      </section>
      <section className={"cp-grid" + (isMobile ? " cp-grid-mobile" : "")}>
        <div className="cp-cell">
          <h3>By Phone · 01</h3>
          <a href="tel:+919963847704">
            <div className="big">+91 99638 47704</div>
          </a>
          <p>Direct to the advocate, not a desk. If we don't pick up, we are in court — leave a message and we will return your call by close of business.</p>
        </div>
        <div className="cp-cell">
          <h3>By Email · 02</h3>
          <a href="mailto:hello@gslawfirm.in">
            <div className="big">hello@gslawfirm.in</div>
          </a>
          <p>For longer enquiries or sharing documents. Please do not send anything confidential or privileged in the first message — we will reply with a secure channel.</p>
        </div>
        <div className="cp-cell">
          <h3>In Person · 03</h3>
          <div className="big">Sri Ramnagar Block C</div>
          <p>Kondapur, Hyderabad 500 084 · Telangana, India.<br/>Appointments preferred. Most consults can be done by phone or video first.</p>
        </div>
      </section>
      <ContactForm viewport={viewport} />
      <Location viewport={viewport} />
      <Footer viewport={viewport} onNav={onNav} />
    </>
  );
}

// ─── Disclaimer modal ────────────────────────────────────────────────────────
function DisclaimerModal({ viewport, onClose }) {
  const isMobile = viewport === 'mobile';
  return (
    <div className="modal-scrim" onClick={(e) => { if (e.target === e.currentTarget) onClose && onClose(); }}>
      <div className={"modal" + (isMobile ? " modal-mobile" : "")}>
        <div className="modal-mark"></div>
        <span className="eyebrow">Bar Council of India · Notice</span>
        <h2>Disclaimer.</h2>
        <p>
          The Bar Council of India does not permit advocates to solicit work or advertise. By entering this site, the user acknowledges that they are seeking information about GS Law Firm of their own accord and that no part of this site constitutes advertisement, personal communication, solicitation, invitation or inducement of any sort whatsoever from the firm or any of its members.
        </p>
        <p>
          The information provided on this site is for general informational purposes only and should not be construed as legal advice or a substitute for it. GS Law Firm does not assume any responsibility for the consequences of any action taken on the basis of information provided herein. No attorney–client relationship is created by accessing this site or by sending a message through it.
        </p>
        <div className={"modal-foot" + (isMobile ? " modal-foot-mobile" : "")}>
          <button className="modal-btn secondary" onClick={() => onClose && onClose('exit')}>Exit</button>
          <button className="modal-btn primary" onClick={() => onClose && onClose('agree')}>I Agree</button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  PracticeDetailPage, AboutPage, ContactPage, DisclaimerModal,
});
