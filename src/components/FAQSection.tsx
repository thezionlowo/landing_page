import React, { useState } from 'react';
import { ChevronDown, MessageSquare, ShieldCheck, ArrowRight } from 'lucide-react';
import { ROUTES } from '../lib/routes';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'What is ZAMERIA?',
    answer:
      'ZAMERIA is a point of sale (POS) and inventory platform that connects a merchant\'s online WooCommerce store with their physical retail store. You can manage products, inventory, orders, and counter sales from one unified system.',
  },
  {
    question: 'How does the free trial work?',
    answer:
      'You get a 7-day free trial with full access to test ZAMERIA. No payment or credit card is required to start your trial, and no license key is needed.',
  },
  {
    question: 'Do I need WooCommerce?',
    answer:
      'Yes. ZAMERIA connects directly with WooCommerce so that your online catalog, orders, and counter checkout remain connected in real time.',
  },
  {
    question: 'Does ZAMERIA sync inventory?',
    answer:
      'Yes. When a sale occurs at your physical counter, WooCommerce inventory decreases automatically. When an online order is placed, your in-store POS immediately reflects the updated stock.',
  },
  {
    question: 'Can multiple staff use ZAMERIA?',
    answer:
      'Yes. You can add cashiers and managers with individual user accounts and quick PIN access to ring up sales and print receipts.',
  },
  {
    question: 'What happens when my trial ends?',
    answer:
      'When your 7-day free trial ends, your account remains intact. You can choose a paid plan (such as the Business plan at ₦30,000/month) to continue using ZAMERIA. If you do not choose a plan, you will not be charged.',
  },
  {
    question: 'When do I receive a license?',
    answer:
      'Your official ZAMERIA license is generated automatically only after you successfully pay for a paid subscription plan. Trial users do not receive or need a license.',
  },
  {
    question: 'Can I cancel my subscription?',
    answer:
      'Yes. You can cancel your subscription at any time directly from your Account portal with one click. There are no contracts or cancellation penalties.',
  },
  {
    question: 'What happens if my subscription expires?',
    answer:
      'If your subscription expires without renewal, your license becomes inactive until you renew your plan. Your account, store settings, and order history remain safely preserved.',
  },
];

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section
      id="faq"
      style={{
        paddingTop: '100px',
        paddingBottom: '100px',
        backgroundColor: '#ffffff',
        borderTop: '1px solid var(--border-subtle)',
      }}
    >
      <div className="container" style={{ maxWidth: '1180px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.6fr',
            gap: '64px',
            alignItems: 'start',
          }}
          className="faq-split-grid"
        >
          {/* Left Column: Sticky Reassurance & Editorial Heading */}
          <div style={{ position: 'sticky', top: '100px' }}>
            <div className="eyebrow-badge purple" style={{ marginBottom: '16px' }}>
              <span>CLEAR ANSWERS</span>
            </div>
            <h2
              style={{
                fontSize: 'clamp(32px, 3.8vw, 48px)',
                fontWeight: 800,
                color: 'var(--brand-navy)',
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
                marginBottom: '18px',
              }}
            >
              Frequently Asked Questions
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--text-body)', lineHeight: 1.6, marginBottom: '32px' }}>
              Everything you need to know about connecting your WooCommerce store, counter checkouts, and growing with ZAMERIA.
            </p>

            {/* Reassurance Callout Card */}
            <div
              style={{
                backgroundColor: 'var(--canvas-bg)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '20px',
                padding: '24px 22px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <MessageSquare size={18} color="#4f46e5" />
                <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--brand-navy)' }}>
                  Need personal assistance?
                </span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0, marginBottom: '16px' }}>
                Our team is ready to assist you with store connections, staff onboarding, or hardware setup.
              </p>
              <a
                href={ROUTES.trial}
                className="btn btn-hero-gradient"
                style={{
                  fontSize: '13px',
                  padding: '10px 20px',
                  borderRadius: '9999px',
                  width: '100%',
                }}
              >
                <span>Try It Free for 7 Days</span>
                <ArrowRight size={14} />
              </a>
            </div>
          </div>

          {/* Right Column: Accordion Items */}
          <div
            style={{
              borderTop: '1px solid var(--border-subtle)',
            }}
          >
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openIndex === idx;
              const contentId = `faq-answer-${idx}`;
              const buttonId = `faq-btn-${idx}`;

              return (
                <div
                  key={idx}
                  style={{
                    borderBottom: '1px solid var(--border-subtle)',
                  }}
                >
                  <button
                    id={buttonId}
                    onClick={() => toggleFAQ(idx)}
                    aria-expanded={isOpen}
                    aria-controls={contentId}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '22px 0',
                      backgroundColor: 'transparent',
                      border: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      gap: '16px',
                      color: 'var(--brand-navy)',
                      fontSize: '16px',
                      fontWeight: 700,
                      lineHeight: 1.4,
                      transition: 'color 0.15s ease',
                    }}
                    className="faq-trigger"
                  >
                    <span>{item.question}</span>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: isOpen ? '#eef2ff' : '#f8fafc',
                        color: isOpen ? '#4f46e5' : 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.25s ease, background-color 0.2s ease, color 0.2s ease',
                      }}
                    >
                      <ChevronDown size={17} />
                    </div>
                  </button>

                  <div
                    id={contentId}
                    role="region"
                    aria-labelledby={buttonId}
                    style={{
                      display: isOpen ? 'block' : 'none',
                      paddingBottom: '22px',
                    }}
                  >
                    <p
                      style={{
                        fontSize: '14.5px',
                        color: 'var(--text-body)',
                        lineHeight: 1.65,
                        margin: 0,
                        maxWidth: '680px',
                      }}
                    >
                      {item.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        .faq-trigger:hover {
          color: #4f46e5 !important;
        }
        @media (max-width: 960px) {
          .faq-split-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          .faq-split-grid > div:first-child {
            position: static !important;
          }
        }
      `}</style>
    </section>
  );
};
