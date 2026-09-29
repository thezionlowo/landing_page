import React, { useState, useEffect, useRef } from 'react';

// --- QUESTION DATA ---
interface AnswerDef {
  label: string;
  score?: number;
  category?: string;
}

interface QuestionDef {
  id: string;
  number: number;
  category: string;
  prompt: string;
  answers: AnswerDef[];
}

const QUESTIONS: QuestionDef[] = [
  {
    id: 'q1_instore_website_knows',
    number: 1,
    category: 'inventory_sync',
    prompt: 'When you sell the last unit in your physical store, does your website know?',
    answers: [
      { label: 'Yes, it updates straight away', score: 0 },
      { label: 'Someone tells it later', score: 2 },
      { label: 'No, it keeps showing the item', score: 3 },
      { label: "I'm not sure", score: 2 }
    ]
  },
  {
    id: 'q2_online_store_knows',
    number: 2,
    category: 'order_visibility',
    prompt: 'When someone orders online, does your physical store know?',
    answers: [
      { label: 'Yes, it appears for the team', score: 0 },
      { label: 'Someone has to check the website', score: 2 },
      { label: 'Someone sends a WhatsApp or message', score: 3 },
      { label: 'Only if I remember to tell them', score: 3 }
    ]
  },
  {
    id: 'q3_shared_number',
    number: 3,
    category: 'overselling_risk',
    prompt: 'Is there one stock number that both your website and your store read from?',
    answers: [
      { label: 'Yes, one shared number', score: 0 },
      { label: 'Two numbers that should match', score: 2 },
      { label: 'Two numbers that rarely match', score: 3 },
      { label: "I don't know", score: 2 }
    ]
  },
  {
    id: 'q4_stock_system',
    number: 4,
    category: 'manual_reconciliation',
    prompt: 'How do you currently keep your online and physical stock aligned?',
    answers: [
      { label: 'One shared system', score: 0 },
      { label: 'Two separate systems', score: 2 },
      { label: 'A spreadsheet', score: 3 },
      { label: 'A notebook or manual counting', score: 3 }
    ]
  },
  {
    id: 'q5_confidence',
    number: 5,
    category: 'stock_visibility',
    prompt: 'How confident are you that the stock number on your website matches your physical store right now?',
    answers: [
      { label: 'Very confident', score: 0 },
      { label: 'Somewhat confident', score: 1 },
      { label: 'Not very confident', score: 2 },
      { label: "Honestly, I don't know", score: 3 }
    ]
  }
];

const Q6 = {
  id: 'q6_stress',
  number: 6,
  prompt: 'Which part of this bothers you most?',
  answers: [
    { label: "Selling something that's already gone", category: 'overselling_risk' },
    { label: 'Updating two places after every sale', category: 'inventory_sync' },
    { label: 'Online orders the store never sees', category: 'order_visibility' },
    { label: 'The two sets of numbers never matching', category: 'manual_reconciliation' }
  ]
};

const TOTAL_QUESTIONS = QUESTIONS.length + 1;

// --- GAPS DEFINITION ---
interface GapDetail {
  name: string;
  supporting: string;
  couldMean: string[];
  fixTitle: string;
  fixBody: string;
}

const GAPS: Record<string, GapDetail> = {
  inventory_sync: {
    name: 'Your website and store do not share stock',
    supporting: 'When something sells in one place, the other side does not find out. Your stock ends up living in two different versions.',
    couldMean: [
      'Your website keeps showing sold-out products',
      'Your store holds stock the website says is gone',
      'Someone has to update two places every day'
    ],
    fixTitle: 'Make your stock know about both sides',
    fixBody: 'When something sells, both your website and your store should update at the same time.'
  },
  order_visibility: {
    name: 'Online orders do not reach your store team',
    supporting: 'Your physical store has no direct way of knowing about online orders. It depends on someone noticing or relaying them.',
    couldMean: [
      'Online orders sit unread while the store is busy',
      'Staff do not know what to pack or hold',
      'One person becomes the bottleneck for every order'
    ],
    fixTitle: 'Send online orders straight to your team',
    fixBody: 'Online orders should appear for your team automatically, not through a message.'
  },
  overselling_risk: {
    name: 'Two stock numbers that rarely match',
    supporting: 'You are keeping track of stock in two places. As sales grow, the two versions drift further apart.',
    couldMean: [
      'Customers order items you no longer have',
      'You refund or cancel orders more often than you should',
      'Repeat buyers lose confidence in your store'
    ],
    fixTitle: 'Give both sides one stock number',
    fixBody: 'Online and store sales should read from the same stock level, so the last item can only be sold once.'
  },
  manual_reconciliation: {
    name: 'Manual updating is holding your stock together',
    supporting: 'Your team is updating two sets of records by hand. Every sale adds more work to that.',
    couldMean: [
      'Hours spent updating or reconciling every week',
      'Mistakes that are hard to trace back',
      'Stock counts that never fully line up'
    ],
    fixTitle: 'Remove the manual updating',
    fixBody: 'One record should update the other automatically, with no one retyping stock numbers.'
  },
  stock_visibility: {
    name: 'You cannot see your real stock position',
    supporting: 'You are not fully certain what your actual stock is right now. Every restocking decision becomes harder.',
    couldMean: [
      'Restocking becomes guesswork',
      'You hold too much of some items and too little of others',
      'You find out about problems from customers first'
    ],
    fixTitle: 'See your real stock in one place',
    fixBody: 'You should be able to see your stock without asking anyone or checking two systems.'
  },
  sales_visibility: {
    name: 'Sales are not visible in one place',
    supporting: 'You cannot see what sold online and what sold in the store together. Getting the full picture takes extra work.',
    couldMean: [
      'Slow decisions on what to restock',
      'Totals you have to combine by hand',
      'No clear picture of what is actually moving'
    ],
    fixTitle: 'See online and store sales together',
    fixBody: 'Both channels should be visible in one view, without combining reports by hand.'
  },
  staff_controls: {
    name: 'Staff can change stock without clear rules',
    supporting: 'Stock and price changes may be happening without a clear record of who did what.',
    couldMean: [
      'Stock errors are hard to trace',
      'Prices or records change without your knowledge',
      'It is unclear who last touched a stock level'
    ],
    fixTitle: 'Set clear staff permissions',
    fixBody: 'Give staff access based on their role instead of open access for everyone.'
  }
};

const CATEGORY_PRIORITY = [
  'inventory_sync',
  'order_visibility',
  'overselling_risk',
  'manual_reconciliation',
  'stock_visibility',
  'sales_visibility',
  'staff_controls'
];

interface RiskLevel {
  key: string;
  label: string;
  cardClass: string;
  levelClass: string;
  copy: string;
}

const RISK_LEVELS: Record<string, RiskLevel> = {
  LOW: {
    key: 'LOW',
    label: 'IT KNOWS',
    cardClass: 'low',
    levelClass: 'low',
    copy: 'Your stock appears to know about both your website and your physical store. There may still be small gaps worth tightening as you grow.'
  },
  MODERATE: {
    key: 'MODERATE',
    label: 'IT PARTLY KNOWS',
    cardClass: 'moderate',
    levelClass: 'moderate',
    copy: 'Some of your stock stays in sync, but other parts still depend on manual updates or separate systems.'
  },
  HIGH: {
    key: 'HIGH',
    label: 'IT HAS NO IDEA',
    cardClass: 'high',
    levelClass: 'high',
    copy: 'Your stock is living in two different versions. Your website and your store are being tracked separately, and it is already causing gaps.'
  }
};

function calculateResult(answers: Record<string, number>) {
  const allScored = QUESTIONS.every((q) => typeof answers[q.id] === 'number');
  if (!allScored) return null;

  let rawScore = 0;
  let maxPossible = 0;
  const bucketRaw: Record<string, number> = {};

  for (let i = 0; i < QUESTIONS.length; i++) {
    const q = QUESTIONS[i];
    const idx = answers[q.id];
    const def = q.answers[idx];
    if (!def || typeof def.score !== 'number') return null;
    rawScore += def.score;
    maxPossible += Math.max(...q.answers.map((a) => a.score ?? 0));
    bucketRaw[q.category] = (bucketRaw[q.category] || 0) + def.score;
  }

  const ratio = rawScore / maxPossible;
  const riskLevel =
    ratio <= 0.25 ? RISK_LEVELS.LOW : ratio <= 0.55 ? RISK_LEVELS.MODERATE : RISK_LEVELS.HIGH;

  const ranked = CATEGORY_PRIORITY.slice().sort((a, b) => {
    const ra = bucketRaw[a] || 0;
    const rb = bucketRaw[b] || 0;
    if (rb !== ra) return rb - ra;
    return CATEGORY_PRIORITY.indexOf(a) - CATEGORY_PRIORITY.indexOf(b);
  });

  let topGapKey = ranked[0];
  let topGapScore = bucketRaw[topGapKey] || 0;

  if (typeof answers[Q6.id] === 'number') {
    const q6Cat = Q6.answers[answers[Q6.id]].category!;
    const q6Score = bucketRaw[q6Cat] || 0;
    if (q6Score >= topGapScore && q6Score > 0) {
      topGapKey = q6Cat;
      topGapScore = q6Score;
    }
  }

  const topGap = topGapScore > 0 ? GAPS[topGapKey] : null;
  const defaultRecs = ['inventory_sync', 'order_visibility', 'manual_reconciliation'];
  let recKeys: string[];
  if (topGap && defaultRecs.includes(topGapKey)) {
    recKeys = [topGapKey, ...defaultRecs.filter((k) => k !== topGapKey)];
  } else if (topGap) {
    recKeys = [topGapKey, defaultRecs[0], defaultRecs[1]];
  } else {
    recKeys = defaultRecs.slice();
  }

  const recommendations = recKeys.map((k) => ({
    key: k,
    title: GAPS[k].fixTitle,
    body: GAPS[k].fixBody
  }));

  return {
    rawScore,
    maxPossible,
    riskLevel,
    biggestGap: topGap
      ? {
          key: topGapKey,
          name: topGap.name,
          supporting: topGap.supporting,
          couldMean: topGap.couldMean
        }
      : null,
    consequences: topGap ? topGap.couldMean : [],
    recommendations
  };
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function normaliseWhatsApp(input: string) {
  const trimmed = (input || '').trim();
  if (!trimmed) return null;
  const hadPlus = trimmed.charAt(0) === '+';
  const digits = trimmed.replace(/[^\d]/g, '');
  if (!digits) return null;
  if (hadPlus && digits.indexOf('234') !== 0) return digits.length >= 8 && digits.length <= 15 ? '+' + digits : null;
  if (digits.indexOf('234') === 0) return digits.length === 13 ? '+' + digits : null;
  if (digits.charAt(0) === '0') return digits.length === 11 ? '+234' + digits.slice(1) : null;
  if (digits.length === 10) return '+234' + digits;
  return null;
}

function normaliseWebsite(input: string) {
  const trimmed = (input || '').trim();
  if (!trimmed) return null;
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : 'https://' + trimmed;
  try {
    const u = new URL(withProtocol);
    if (!u.hostname || u.hostname.indexOf('.') === -1) return null;
    const parts = u.hostname.split('.');
    const tld = parts[parts.length - 1];
    if (!tld || tld.length < 2) return null;
    return u.href.replace(/\/$/, '');
  } catch (e) {
    return null;
  }
}

export const LeadCapture1Page: React.FC = () => {
  const [step, setStep] = useState<'hero' | 'question' | 'lead' | 'result' | 'celebrate'>('hero');
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [vslPlaying, setVslPlaying] = useState(false);

  // Form states
  const [fullName, setFullName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const confettiCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Confetti animation
  useEffect(() => {
    if (step !== 'celebrate') return;
    const canvas = confettiCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.scale(dpr, dpr);

    const colors = ['#7C3AED', '#6D28D9', '#A78BFA', '#C4B5FD', '#059669', '#34D399', '#F59E0B', '#FCD34D', '#F472B6'];
    const particles: any[] = [];
    const originX = w * 0.5;
    const originY = h * 0.42;

    for (let i = 0; i < 150; i++) {
      const angle = -Math.PI + Math.random() * Math.PI;
      const speed = 5 + Math.random() * 10;
      particles.push({
        x: originX + (Math.random() - 0.5) * 40,
        y: originY + (Math.random() - 0.5) * 40,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        gravity: 0.28,
        drag: 0.985,
        size: 4 + Math.random() * 8,
        rotation: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.35,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1,
        decay: 0.004 + Math.random() * 0.005,
        shape: Math.random() > 0.55 ? 'rect' : 'circle'
      });
    }

    let animId: number;
    const startTime = performance.now();
    const maxDuration = 4000;

    const frame = (now: number) => {
      const elapsed = now - startTime;
      ctx.clearRect(0, 0, w, h);
      if (elapsed > maxDuration) return;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.vy += p.gravity;
        p.vx *= p.drag;
        p.vy *= p.drag;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.vr;
        p.life -= p.decay;
        if (p.life <= 0 || p.y > h + 40) continue;

        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, p.life));
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        if (p.shape === 'rect') ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
      animId = requestAnimationFrame(frame);
    };

    animId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(animId);
  }, [step]);

  // Handle question answering
  const currentQ = qIndex < QUESTIONS.length ? QUESTIONS[qIndex] : Q6;
  const hasAnswer = typeof answers[currentQ.id] === 'number';
  const isLastQuestion = qIndex === TOTAL_QUESTIONS - 1;

  const handleSelectAnswer = (idx: number) => {
    setAnswers((prev) => ({ ...prev, [currentQ.id]: idx }));
  };

  const handleNext = () => {
    if (!hasAnswer) return;
    if (qIndex < TOTAL_QUESTIONS - 1) {
      setQIndex((prev) => prev + 1);
    } else {
      setStep('lead');
    }
  };

  const handleBack = () => {
    if (qIndex > 0) setQIndex((prev) => prev - 1);
    else setStep('hero');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!fullName.trim() || fullName.trim().length < 2) {
      newErrors.fullName = 'Please enter your full name.';
    }
    if (!whatsapp.trim()) {
      newErrors.whatsapp = 'Please enter your WhatsApp number.';
    } else if (!normaliseWhatsApp(whatsapp)) {
      newErrors.whatsapp = 'Enter a valid number, e.g. 0801 234 5678.';
    }
    if (!email.trim()) {
      newErrors.email = 'Please enter your business email.';
    } else if (!EMAIL_RE.test(email.trim())) {
      newErrors.email = 'Enter a valid email address.';
    }
    if (website.trim() && !normaliseWebsite(website)) {
      newErrors.website = 'Enter a valid website, or leave it blank.';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setSubmitting(true);
    // Move to result
    setTimeout(() => {
      setSubmitting(false);
      setStep('result');
      window.scrollTo(0, 0);
    }, 400);
  };

  const result = calculateResult(answers);

  return (
    <div className="zameria-lead-page">
      {/* Header */}
      <header className="z-header">
        <div className="z-header-inner">
          <a href="/" className="z-header-logo-link" aria-label="ZAMERIA Home">
            <img src="/zameria-logo-white.png" alt="ZAMERIA" className="z-header-logo" />
          </a>
        </div>
      </header>

      {/* Main Container */}
      <main className="z-main">
        {/* STEP: HERO */}
        {step === 'hero' && (
          <div className="z-anim">
            <p className="z-eyebrow">STOCK AWARENESS CHECK</p>
            <h1 className="z-h1">
              <span className="z-h1-line">You have a website.</span>
              <span className="z-h1-line">You have a physical store.</span>
              <span className="z-h1-hl">But does your stock know that?</span>
            </h1>
            <p className="z-h3-sub">
              Find out how well your online and physical inventory stay in sync with a quick 30-second check.
            </p>
            <div className="z-cta-wrap">
              <button
                type="button"
                className="z-btn z-btn-primary"
                onClick={() => {
                  setStep('question');
                  setQIndex(0);
                  window.scrollTo(0, 0);
                }}
              >
                <span>Get My Stock Sync Score</span>
                <svg className="z-btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </div>
            <div className="z-micro-badge-wrap">
              <span className="z-micro-item">
                <svg viewBox="0 0 20 20" fill="currentColor" className="z-micro-icon">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                6 quick questions
              </span>
              <span className="z-micro-dot">&bull;</span>
              <span className="z-micro-item">30-Seconds</span>
              <span className="z-micro-dot">&bull;</span>
              <span className="z-micro-item">Instant results</span>
            </div>
          </div>
        )}

        {/* STEP: QUESTION */}
        {step === 'question' && (
          <div className="z-anim">
            <p className="z-eyebrow z-eyebrow-muted">STOCK AWARENESS CHECK</p>
            {/* Progress bar */}
            <div className="z-progress">
              <div className="z-progress-labels">
                <span className="z-progress-label">Question {qIndex + 1} of {TOTAL_QUESTIONS}</span>
                <span className="z-progress-label z-progress-pct">{Math.round(((qIndex + 1) / TOTAL_QUESTIONS) * 100)}%</span>
              </div>
              <div className="z-progress-bar">
                <div
                  className="z-progress-fill"
                  style={{ width: `${Math.round(((qIndex + 1) / TOTAL_QUESTIONS) * 100)}%` }}
                />
              </div>
            </div>

            <h2 className="z-h2 z-q-title">{currentQ.prompt}</h2>

            <div className="z-answers">
              {currentQ.answers.map((ans, i) => {
                const checked = answers[currentQ.id] === i;
                return (
                  <label key={i} className="z-answer" onClick={() => handleSelectAnswer(i)}>
                    <input
                      type="radio"
                      className="z-answer-input"
                      name={currentQ.id}
                      checked={checked}
                      onChange={() => handleSelectAnswer(i)}
                    />
                    <span className="z-answer-body">
                      <span className="z-dot" />
                      <span className="z-answer-label">{ans.label}</span>
                    </span>
                  </label>
                );
              })}
            </div>

            <div className="z-q-actions">
              <button type="button" className="z-btn z-btn-ghost" onClick={handleBack}>
                Back
              </button>
              <button
                type="button"
                className="z-btn z-btn-primary"
                disabled={!hasAnswer}
                onClick={handleNext}
              >
                <span>{isLastQuestion ? 'See My Results' : 'Next'}</span>
                <svg className="z-btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* STEP: LEAD FORM */}
        {step === 'lead' && (
          <form className="z-anim" onSubmit={handleFormSubmit} noValidate>
            <p className="z-eyebrow">ALMOST DONE</p>
            <h2 className="z-h2 z-h2-lg">Your Stock Awareness Check is ready.</h2>
            <p className="z-body-muted" style={{ marginTop: '16px' }}>
              We&rsquo;ve worked out whether your stock actually knows about both your website and your store. Enter your details to see the result.
            </p>

            <div className="z-result-preview-card">
              <div className="z-result-preview-header">
                <span className="z-result-preview-badge">Instant Breakdown</span>
                <span className="z-result-preview-title">Your result includes</span>
              </div>
              <ul className="z-result-preview-list">
                <li className="z-result-preview-item">
                  <span className="z-check-circle" aria-hidden="true">
                    <svg viewBox="0 0 16 16" fill="currentColor" width="12" height="12">
                      <path fillRule="evenodd" d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span>Whether your stock knows about both sides</span>
                </li>
                <li className="z-result-preview-item">
                  <span className="z-check-circle" aria-hidden="true">
                    <svg viewBox="0 0 16 16" fill="currentColor" width="12" height="12">
                      <path fillRule="evenodd" d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span>Your biggest blind spot</span>
                </li>
                <li className="z-result-preview-item">
                  <span className="z-check-circle" aria-hidden="true">
                    <svg viewBox="0 0 16 16" fill="currentColor" width="12" height="12">
                      <path fillRule="evenodd" d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span>What it is costing you</span>
                </li>
                <li className="z-result-preview-item">
                  <span className="z-check-circle" aria-hidden="true">
                    <svg viewBox="0 0 16 16" fill="currentColor" width="12" height="12">
                      <path fillRule="evenodd" d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span>What to fix first</span>
                </li>
              </ul>
            </div>

            <div className="z-fields">
              <div className="z-field">
                <label htmlFor="fullName">Full Name</label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="e.g. Tunde Adebayo"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  aria-invalid={!!errors.fullName}
                />
                {errors.fullName && <p className="z-err">{errors.fullName}</p>}
              </div>

              <div className="z-field">
                <label htmlFor="whatsapp">WhatsApp Number</label>
                <input
                  id="whatsapp"
                  name="whatsapp"
                  type="tel"
                  placeholder="e.g. 0801 234 5678"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  aria-invalid={!!errors.whatsapp}
                />
                {errors.whatsapp && <p className="z-err">{errors.whatsapp}</p>}
              </div>

              <div className="z-field">
                <label htmlFor="email">Business Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="e.g. tunde@store.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={!!errors.email}
                />
                {errors.email && <p className="z-err">{errors.email}</p>}
              </div>

              <div className="z-field">
                <label htmlFor="website">Website URL <span className="z-optional">(optional)</span></label>
                <input
                  id="website"
                  name="website"
                  type="text"
                  placeholder="e.g. www.yourstore.com"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  aria-invalid={!!errors.website}
                />
                {errors.website && <p className="z-err">{errors.website}</p>}
              </div>
            </div>

            <div className="z-cta-wrap" style={{ marginTop: '32px' }}>
              <button type="submit" className="z-btn z-btn-primary" disabled={submitting}>
                <span>{submitting ? 'Submitting…' : 'Show My Result'}</span>
                <svg className="z-btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </div>

            <p className="z-micro">We&rsquo;ll use your details to send your result and relevant ZAMERIA information.</p>
          </form>
        )}

        {/* STEP: RESULT */}
        {step === 'result' && result && (
          <div className="z-anim z-space-y">
            {/* Risk Card */}
            <section>
              <div className={`z-risk-card ${result.riskLevel.cardClass}`}>
                <p className="z-risk-label">Does your stock know?</p>
                <h2 className={`z-risk-level ${result.riskLevel.levelClass}`}>{result.riskLevel.label}</h2>
                <p className="z-body-muted" style={{ marginTop: '20px' }}>{result.riskLevel.copy}</p>
              </div>
            </section>

            {/* Blind Spot */}
            <section className="z-card z-card-danger">
              <p className="z-card-label" style={{ color: 'var(--z-danger)' }}>Your Biggest Blind Spot</p>
              <p className="z-gap-title">{result.biggestGap ? result.biggestGap.name : 'Your stock already knows about both sides'}</p>
              <p className="z-body-muted" style={{ marginTop: '14px' }}>
                {result.biggestGap
                  ? result.biggestGap.supporting
                  : 'Your answers suggest your stock is aware of both your website and your store.'}
              </p>
            </section>

            {/* What this is costing you */}
            <section>
              <p className="z-eyebrow z-eyebrow-muted">What This Is Costing You</p>
              <ul className="z-mark-list" style={{ marginTop: '16px' }}>
                {result.consequences.map((line, i) => (
                  <li key={i}>
                    <span className="z-x">&bull;</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* What to fix first */}
            <section>
              <p className="z-eyebrow z-eyebrow-muted">What to Fix First</p>
              <ol className="z-mark-list" style={{ marginTop: '20px' }}>
                {result.recommendations.map((rec, i) => (
                  <li key={i} style={{ alignItems: 'flex-start' }}>
                    <span className="z-num">{i + 1}</span>
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--z-text)', fontSize: '16.5px', lineHeight: 1.4 }}>
                        {rec.title}
                      </div>
                      <div style={{ color: 'var(--z-text-muted)', fontSize: '15px', lineHeight: 1.55, marginTop: '4px' }}>
                        {rec.body}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            {/* VSL Video */}
            <section className="z-section-divider">
              <p className="z-eyebrow">SEE IT IN ACTION</p>
              <h2 className="z-h2 z-h2-lg">Watch how ZAMERIA connects your store.</h2>
              <p className="z-body-muted" style={{ marginTop: '16px' }}>
                Watch this short video to see how ZAMERIA connects your Website and physical sales into one system.
              </p>
              <div className="z-vsl">
                {!vslPlaying ? (
                  <button
                    type="button"
                    className="z-vsl-facade"
                    onClick={() => setVslPlaying(true)}
                    aria-label="Play video"
                  >
                    <span className="z-vsl-poster z-vsl-poster-fallback"></span>
                    <span className="z-vsl-play">
                      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.14v13.72a1 1 0 0 0 1.54.84l10.29-6.86a1 1 0 0 0 0-1.68L9.54 4.3A1 1 0 0 0 8 5.14z"/></svg>
                    </span>
                  </button>
                ) : (
                  <iframe
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1"
                    title="How ZAMERIA connects your Website and physical sales"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                )}
              </div>
              <p className="z-micro">Takes about 30 seconds &bull; No signup needed to watch</p>
            </section>

            {/* Bottom CTA directly following VSL */}
            <section style={{ textAlign: 'center', marginTop: '32px' }}>
              <div className="z-cta-wrap" style={{ marginTop: '0' }}>
                <button
                  type="button"
                  className="z-btn z-btn-primary"
                  onClick={() => {
                    setStep('celebrate');
                    window.scrollTo(0, 0);
                  }}
                >
                  <span>Start My 7-Day Free Trial</span>
                  <svg className="z-btn-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
              </div>
              <p className="z-micro">Free for 7 days &bull; No credit card required</p>
            </section>
          </div>
        )}

        {/* STEP: CELEBRATION */}
        {step === 'celebrate' && (
          <div className="z-celebrate">
            <canvas ref={confettiCanvasRef} className="z-celebrate-confetti" />
            <div className="z-celebrate-inner">
              <div className="z-celebrate-badge">
                <svg viewBox="0 0 52 52">
                  <circle className="z-celebrate-check-circle" cx="26" cy="26" r="24" fill="none" />
                  <path className="z-celebrate-check-mark" fill="none" d="M14 27l8 8 16-16" />
                </svg>
              </div>
              <p className="z-celebrate-eyebrow">You&rsquo;re in</p>
              <h1 className="z-celebrate-title">Thank you for your attention.</h1>
              <p className="z-celebrate-sub">
                It&rsquo;s the one thing no one gets back &mdash; and you gave us yours. We don&rsquo;t take that lightly.
              </p>
              <p className="z-celebrate-body">
                Our team is reviewing your store right now. You&rsquo;ll hear from us on WhatsApp within the next few hours, and we&rsquo;ll have you fully set up before you know it.
              </p>
              <div className="z-celebrate-steps">
                <div className="z-celebrate-step">
                  <span className="z-celebrate-step-num">1</span>
                  <span className="z-celebrate-step-text">A human from our team reviews your store</span>
                </div>
                <div className="z-celebrate-step">
                  <span className="z-celebrate-step-num">2</span>
                  <span className="z-celebrate-step-text">We reach out on WhatsApp &mdash; usually within a few hours</span>
                </div>
                <div className="z-celebrate-step">
                  <span className="z-celebrate-step-num">3</span>
                  <span className="z-celebrate-step-text">We get you live &mdash; usually in under 15 minutes</span>
                </div>
              </div>
              <p className="z-celebrate-footer">Keep an eye on your phone. We&rsquo;re already on it.</p>
              <div style={{ marginTop: '28px' }}>
                <a href="/" className="z-btn z-btn-ghost" style={{ display: 'inline-flex' }}>
                  Return to Home
                </a>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Scoped CSS to ensure 100% pixel-perfect alignment */}
      <style>{`
        :root {
          --z-bg: #FFFFFF;
          --z-bg-alt: #F8FAFC;
          --z-surface: #FFFFFF;
          --z-surface-2: #F1F5F9;
          --z-border: #E2E8F0;
          --z-border-strong: #CBD5E1;
          --z-text: #0F172A;
          --z-text-muted: #64748B;
          --z-text-soft: #94A3B8;
          --z-accent: #7C3AED;
          --z-accent-hover: #6D28D9;
          --z-accent-soft: #F3E8FF;
          --z-on-accent: #FFFFFF;
          --z-dark: #071A31;
          --z-success: #059669;
          --z-success-soft: #ECFDF5;
          --z-success-border: #A7F3D0;
          --z-warn: #D97706;
          --z-warn-soft: #FFFBEB;
          --z-warn-border: #FDE68A;
          --z-danger: #DC2626;
          --z-danger-soft: #FEF2F2;
          --z-danger-border: #FECACA;
          --z-radius: 16px;
          --z-radius-sm: 10px;
          --z-shadow-sm: 0 1px 2px rgba(15,23,42,.04);
          --z-shadow: 0 1px 3px rgba(15,23,42,.06), 0 8px 24px -12px rgba(15,23,42,.10);
          --z-shadow-lg: 0 4px 14px rgba(15,23,42,.06), 0 20px 40px -12px rgba(15,23,42,.16);
        }

        .zameria-lead-page {
          min-height: 100vh;
          background: #FFFFFF;
          color: #0F172A;
          font-family: 'Plus Jakarta Sans', ui-sans-serif, system-ui, -apple-system, sans-serif;
          display: flex;
          flex-direction: column;
        }

        .z-header {
          background: #071A31;
          padding: 16px 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          position: sticky;
          top: 0;
          z-index: 50;
        }
        .z-header-inner {
          max-width: 640px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .z-header-logo-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
        }
        .z-header-logo {
          height: 32px;
          width: auto;
          max-width: 170px;
          object-fit: contain;
          display: block;
        }

        .z-main {
          max-width: 640px;
          width: 100%;
          margin: 0 auto;
          padding: 44px 20px 72px;
          flex: 1;
        }
        @media (min-width: 640px) {
          .z-main { padding: 60px 24px 88px; }
        }

        .z-eyebrow {
          margin: 0 auto 16px;
          font-size: 12px; font-weight: 800;
          letter-spacing: 0.16em; color: var(--z-accent);
          text-transform: uppercase;
          text-align: center;
        }
        .z-eyebrow-muted { color: var(--z-text-muted); }

        .z-h1 {
          margin: 0 auto;
          max-width: 580px;
          font-size: 32px;
          font-weight: 800;
          line-height: 1.2;
          letter-spacing: -0.035em;
          color: var(--z-text);
          text-align: center;
        }
        @media (min-width: 640px) {
          .z-h1 { font-size: 42px; line-height: 1.16; }
        }
        .z-h1-line { display: block; }
        .z-h1-hl {
          display: block;
          margin-top: 6px;
          background: linear-gradient(135deg, #7C3AED 0%, #6366F1 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          color: var(--z-accent);
        }

        .z-h3-sub {
          max-width: 480px;
          margin: 20px auto 0;
          font-size: 17px;
          font-weight: 500;
          line-height: 1.6;
          color: var(--z-text-muted);
          text-align: center;
        }
        @media (min-width: 640px) {
          .z-h3-sub { font-size: 18px; }
        }

        .z-h2 {
          margin: 0 auto;
          font-size: 24px;
          font-weight: 800;
          line-height: 1.25;
          letter-spacing: -0.025em;
          color: var(--z-text);
          text-align: center;
        }
        @media (min-width: 640px) { .z-h2 { font-size: 28px; } }
        .z-h2-lg { font-size: 28px; font-weight: 800; line-height: 1.2; }
        @media (min-width: 640px) { .z-h2-lg { font-size: 34px; line-height: 1.18; } }

        .z-q-title { max-width: 540px; margin: 0 auto; }

        .z-body { margin: 0; font-size: 16px; line-height: 1.65; color: var(--z-text); text-align: center; }
        .z-body-muted {
          margin: 0 auto;
          max-width: 500px;
          font-size: 16px;
          line-height: 1.6;
          color: var(--z-text-muted);
          text-align: center;
        }

        .z-cta-wrap {
          max-width: 440px;
          margin: 32px auto 0;
          width: 100%;
          display: flex;
          justify-content: center;
        }
        .z-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          padding: 18px 32px;
          border-radius: 9999px;
          font-family: inherit;
          font-size: 16.5px;
          font-weight: 700;
          line-height: 1.2;
          cursor: pointer;
          text-decoration: none;
          border: 1px solid transparent;
          transition: transform 150ms ease, background-color 150ms ease, box-shadow 150ms ease;
          box-sizing: border-box;
        }
        .z-btn-primary {
          background: var(--z-accent);
          color: #FFFFFF;
          box-shadow: 0 4px 14px -2px rgba(124,58,237,.35), 0 2px 6px -1px rgba(124,58,237,.2);
        }
        .z-btn-primary:hover:not(:disabled) {
          background: var(--z-accent-hover);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px -4px rgba(124,58,237,.45);
        }
        .z-btn-ghost {
          background: transparent;
          border-color: var(--z-border);
          color: var(--z-text-muted);
          padding: 18px 24px;
          width: auto;
        }
        .z-btn-ghost:hover {
          border-color: var(--z-text);
          color: var(--z-text);
          background: var(--z-surface-2);
        }
        .z-btn:disabled {
          opacity: 0.55;
          cursor: not-allowed;
          transform: none !important;
        }
        .z-btn-arrow {
          width: 18px;
          height: 18px;
          transition: transform 150ms ease;
        }
        .z-btn:hover:not(:disabled) .z-btn-arrow {
          transform: translateX(4px);
        }

        .z-micro-badge-wrap {
          margin-top: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 8px 12px;
          font-size: 13.5px;
          font-weight: 500;
          color: var(--z-text-muted);
        }
        .z-micro-item { display: inline-flex; align-items: center; gap: 5px; }
        .z-micro-icon { width: 15px; height: 15px; color: var(--z-success); }
        .z-micro-dot { opacity: 0.4; }
        .z-micro { margin: 16px auto 0; text-align: center; font-size: 13.5px; color: var(--z-text-muted); }

        .z-progress { margin-bottom: 32px; }
        .z-progress-labels { display: flex; justify-content: space-between; margin-bottom: 10px; }
        .z-progress-label { font-size: 12px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: var(--z-text-muted); }
        .z-progress-pct { color: var(--z-accent); }
        .z-progress-bar { height: 8px; width: 100%; border-radius: 999px; background: var(--z-surface-2); overflow: hidden; }
        .z-progress-fill { height: 100%; border-radius: 999px; background: var(--z-accent); transition: width 300ms ease; }

        .z-answers { margin-top: 32px; display: flex; flex-direction: column; gap: 12px; }
        .z-answer { display: block; cursor: pointer; }
        .z-answer-input { position: absolute; opacity: 0; pointer-events: none; }
        .z-answer-body {
          display: flex; align-items: center; gap: 16px;
          padding: 18px 22px;
          border-radius: var(--z-radius);
          border: 2px solid var(--z-border);
          background: var(--z-surface);
          transition: border-color 150ms, background-color 150ms, box-shadow 150ms, transform 150ms;
        }
        .z-answer:hover .z-answer-body { border-color: var(--z-border-strong); transform: translateY(-1px); }
        .z-answer-input:checked + .z-answer-body {
          border-color: var(--z-accent);
          background: var(--z-accent-soft);
          box-shadow: 0 0 0 4px rgba(124,58,237,.14);
        }
        .z-dot {
          width: 22px; height: 22px; border-radius: 50%;
          border: 2px solid var(--z-border-strong);
          background: var(--z-surface);
          flex-shrink: 0;
        }
        .z-answer-input:checked + .z-answer-body .z-dot {
          border-color: var(--z-accent);
          background: var(--z-accent);
          box-shadow: inset 0 0 0 4px var(--z-accent-soft);
        }
        .z-answer-label { font-size: 16.5px; line-height: 1.45; color: var(--z-text); font-weight: 600; text-align: left; }

        .z-q-actions { margin-top: 36px; display: flex; align-items: center; gap: 14px; max-width: 520px; margin-left: auto; margin-right: auto; }
        .z-q-actions .z-btn-primary { flex: 1; }

        .z-result-preview-card {
          margin-top: 28px;
          background: #F0FDF4;
          border: 1.5px solid #BBF7D0;
          border-radius: 16px;
          padding: 22px 24px;
          text-align: left;
          box-shadow: 0 1px 3px rgba(16, 185, 129, 0.08);
        }
        .z-result-preview-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
        }
        .z-result-preview-badge {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #15803D;
          background: #DCFCE7;
          padding: 3px 8px;
          border-radius: 6px;
          border: 1px solid #86EFAC;
        }
        .z-result-preview-title {
          font-size: 13.5px;
          font-weight: 700;
          color: #166534;
          letter-spacing: -0.01em;
        }
        .z-result-preview-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .z-result-preview-item {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 15.5px;
          line-height: 1.45;
          color: #14532D;
          font-weight: 600;
        }
        .z-check-circle {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #059669;
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 1px 3px rgba(5, 150, 105, 0.25);
        }

        .z-card { padding: 24px; border-radius: var(--z-radius); border: 1px solid var(--z-border); background: var(--z-surface); box-shadow: var(--z-shadow-sm); text-align: center; }
        .z-card-success { border-color: var(--z-success-border); background: var(--z-success-soft); }
        .z-card-danger { border-color: var(--z-danger-border); background: var(--z-danger-soft); }
        .z-card-label { margin: 0 0 14px; font-size: 11px; font-weight: 800; letter-spacing: 0.16em; text-transform: uppercase; text-align: center; }

        .z-mark-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 14px; }
        .z-mark-list li { display: flex; align-items: flex-start; gap: 12px; font-size: 15.5px; line-height: 1.5; color: var(--z-text); font-weight: 500; text-align: left; }
        .z-mark-list .z-c { color: var(--z-success); font-weight: 800; font-size: 18px; }
        .z-mark-list .z-x { color: var(--z-danger); font-weight: 800; font-size: 18px; }
        .z-mark-list .z-num {
          flex-shrink: 0; width: 28px; height: 28px; border-radius: 50%;
          border: 1.5px solid var(--z-border-strong);
          display: grid; place-items: center; font-size: 13.5px; font-weight: 800; color: var(--z-text); background: var(--z-surface);
        }

        .z-fields { margin-top: 32px; display: flex; flex-direction: column; gap: 18px; }
        .z-field { text-align: left; }
        .z-field label { display: block; margin-bottom: 8px; font-size: 14px; font-weight: 700; color: var(--z-text); }
        .z-field .z-optional { margin-left: 5px; opacity: 0.6; font-weight: 500; color: var(--z-text-muted); font-size: 13px; }
        .z-field input {
          display: block; width: 100%; padding: 16px 20px;
          border-radius: 12px; border: 1.5px solid var(--z-border);
          background: var(--z-surface); color: var(--z-text); font-size: 16px; font-family: inherit;
        }
        .z-field input:focus { outline: none; border-color: var(--z-accent); box-shadow: 0 0 0 4px rgba(124,58,237,.14); }
        .z-err { margin: 6px 0 0; font-size: 13px; color: var(--z-danger); font-weight: 600; text-align: left; }

        .z-risk-card { padding: 36px 24px; border-radius: var(--z-radius); border: 1.5px solid var(--z-border); background: var(--z-surface); box-shadow: var(--z-shadow-lg); text-align: center; }
        .z-risk-card.low { border-color: var(--z-success-border); background: var(--z-success-soft); }
        .z-risk-card.moderate { border-color: var(--z-warn-border); background: var(--z-warn-soft); }
        .z-risk-card.high { border-color: var(--z-danger-border); background: var(--z-danger-soft); }
        .z-risk-label { font-size: 12px; font-weight: 800; letter-spacing: 0.16em; text-transform: uppercase; color: var(--z-text-muted); margin: 0 0 12px; }
        .z-risk-level { font-size: 36px; font-weight: 900; letter-spacing: -0.03em; line-height: 1.08; margin: 0; text-transform: uppercase; }
        @media (min-width: 640px) { .z-risk-level { font-size: 44px; } }
        .z-risk-level.low { color: var(--z-success); }
        .z-risk-level.moderate { color: var(--z-warn); }
        .z-risk-level.high { color: var(--z-danger); }

        .z-gap-title { margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.025em; color: var(--z-text); text-align: center; }
        @media (min-width: 640px) { .z-gap-title { font-size: 30px; } }

        .z-section-divider { padding-top: 40px; border-top: 1px solid var(--z-border); text-align: center; }
        .z-stack > * + * { margin-top: 10px; }
        .z-space-y > * + * { margin-top: 40px; }

        .z-vsl { position: relative; margin-top: 28px; border-radius: var(--z-radius); border: 1px solid var(--z-border); background: var(--z-dark); overflow: hidden; aspect-ratio: 16/9; }
        .z-vsl iframe { width: 100%; height: 100%; border: 0; }
        .z-vsl-facade { position: absolute; inset: 0; display: grid; place-items: center; width: 100%; height: 100%; background: transparent; cursor: pointer; border: 0; }
        .z-vsl-poster-fallback {
          position: absolute; inset: 0;
          background: radial-gradient(circle at 50% 45%, rgba(124,58,237,.55), transparent 62%), linear-gradient(160deg, #1F2937 0%, #071A31 100%);
        }
        .z-vsl-play {
          position: relative; display: grid; place-items: center; width: 76px; height: 76px; border-radius: 50%;
          background: var(--z-accent); color: #FFF; box-shadow: 0 10px 30px -6px rgba(124,58,237,.75);
          transition: transform 150ms ease;
        }
        .z-vsl-facade:hover .z-vsl-play { transform: scale(1.06); }
        .z-vsl-play svg { width: 26px; height: 26px; margin-left: 4px; }

        .z-celebrate {
          position: fixed; inset: 0; z-index: 100; background: var(--z-bg);
          display: flex; align-items: flex-start; justify-content: center; padding: 48px 20px 64px; overflow-y: auto;
        }
        .z-celebrate-confetti { position: fixed; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1; }
        .z-celebrate-inner { position: relative; z-index: 2; width: 100%; max-width: 520px; margin: auto 0; text-align: center; }
        .z-celebrate-badge {
          width: 96px; height: 96px; border-radius: 50%; background: var(--z-accent-soft);
          display: grid; place-items: center; margin: 0 auto 28px;
        }
        .z-celebrate-badge svg { width: 50px; height: 50px; }
        .z-celebrate-check-circle { stroke: var(--z-accent); stroke-width: 2.5; stroke-dasharray: 152; stroke-dashoffset: 0; }
        .z-celebrate-check-mark { stroke: var(--z-accent); stroke-width: 4; stroke-linecap: round; stroke-linejoin: round; }
        .z-celebrate-eyebrow { font-size: 12px; font-weight: 800; letter-spacing: 0.18em; text-transform: uppercase; color: var(--z-accent); margin: 0 0 14px; }
        .z-celebrate-title { font-size: 32px; font-weight: 800; line-height: 1.15; letter-spacing: -0.035em; color: var(--z-text); margin: 0 auto; }
        @media (min-width: 640px) { .z-celebrate-title { font-size: 40px; } }
        .z-celebrate-sub { margin: 18px auto 0; font-size: 16px; line-height: 1.55; color: var(--z-text); font-weight: 500; }
        .z-celebrate-body { margin: 14px auto 0; font-size: 15px; line-height: 1.65; color: var(--z-text-muted); }
        .z-celebrate-steps { margin-top: 32px; display: flex; flex-direction: column; gap: 10px; text-align: left; }
        .z-celebrate-step { display: flex; align-items: flex-start; gap: 14px; padding: 16px 18px; border-radius: var(--z-radius); background: var(--z-bg-alt); border: 1px solid var(--z-border); }
        .z-celebrate-step-num {
          flex-shrink: 0; width: 26px; height: 26px; border-radius: 50%; background: var(--z-surface);
          border: 1.5px solid var(--z-accent); color: var(--z-accent); display: grid; place-items: center; font-size: 12px; font-weight: 800;
        }
        .z-celebrate-step-text { font-size: 15px; line-height: 1.5; color: var(--z-text); font-weight: 500; }
        .z-celebrate-footer { margin: 32px 0 0; font-size: 14px; color: var(--z-text-muted); font-weight: 600; }

        .z-anim { animation: z-fade-up 320ms cubic-bezier(0.16, 1, 0.3, 1) both; }
        @keyframes z-fade-up {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default LeadCapture1Page;
