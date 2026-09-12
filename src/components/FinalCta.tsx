import React from 'react';
import { ArrowRight, Sparkles, CheckCircle2, Zap, ShieldCheck } from 'lucide-react';
import { ROUTES } from '../lib/routes';

export const FinalCta: React.FC = () => {
  return (
    <section
      style={{
        paddingTop: '80px',
        paddingBottom: '110px',
        backgroundColor: 'var(--canvas-bg)',
      }}
    >
      <div className="container" style={{ maxWidth: '1080px' }}>
        {/* Premium Inset CTA Card */}
        <div
          className="final-cta-card"
          style={{
            background: 'linear-gradient(135deg, #071a31 0%, #0c2340 50%, #1e1b4b 100%)',
            borderRadius: '28px',
            padding: '72px 36px',
            textAlign: 'center',
            color: '#ffffff',
            boxShadow: '0 28px 64px -12px rgba(7, 26, 49, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.12)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Luminous Ambient Radial Lights */}
          <div
            style={{
              position: 'absolute',
              top: '-100px',
              right: '-80px',
              width: '320px',
              height: '320px',
              borderRadius: '50%',
              backgroundColor: 'rgba(99, 102, 241, 0.25)',
              filter: 'blur(60px)',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '-100px',
              left: '-80px',
              width: '320px',
              height: '320px',
              borderRadius: '50%',
              backgroundColor: 'rgba(37, 99, 235, 0.25)',
              filter: 'blur(60px)',
              pointerEvents: 'none',
            }}
          />

          <div style={{ position: 'relative', zIndex: 1, maxWidth: '680px', margin: '0 auto' }}>
            <div
              className="eyebrow-badge dark"
              style={{
                margin: '0 auto 20px',
              }}
            >
              <Sparkles size={12} color="#60a5fa" />
              <span>START TODAY • ZERO RISK</span>
            </div>

            <h2
              style={{
                fontSize: 'clamp(32px, 4.4vw, 52px)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                lineHeight: 1.15,
                color: '#ffffff',
                marginBottom: '16px',
              }}
            >
              Ready to bring your online and offline business together?
            </h2>

            <p
              style={{
                fontSize: '18px',
                color: '#cbd5e1',
                lineHeight: 1.6,
                maxWidth: '560px',
                margin: '0 auto 36px',
                fontWeight: 500,
              }}
            >
              Start your 7-day free trial.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '18px' }}>
              <a
                href={ROUTES.trial}
                className="btn btn-hero-gradient final-cta-btn"
                style={{
                  padding: '16px 44px',
                  fontSize: '16px',
                  borderRadius: '9999px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontWeight: 700,
                }}
              >
                <span>Get Started</span>
                <ArrowRight size={17} />
              </a>

              <div
                style={{
                  fontSize: '13px',
                  color: 'rgba(255, 255, 255, 0.85)',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  marginTop: '6px',
                }}
              >
                <span>✓ 7-day free trial</span>
                <span>✓ No license required to start</span>
                <span>✓ No credit card required</span>
                <span>✓ 2-minute setup</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .final-cta-card {
            padding: 48px 20px !important;
            border-radius: 20px !important;
          }
          .final-cta-btn {
            width: 100% !important;
            max-width: 280px !important;
          }
        }
      `}</style>
    </section>
  );
};
