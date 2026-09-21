import React, { useState } from 'react';
import { Check, Copy, Loader2, RefreshCw } from 'lucide-react';
import { useTrialCode } from '../../lib/useTrialCode';

type Trial = ReturnType<typeof useTrialCode>;

const statusLine = (trial: Trial): { text: string; colour: string } | null => {
  if (trial.license?.status === 'active') {
    return { text: 'This store has a paid licence — no trial needed.', colour: '#16a34a' };
  }
  if (trial.trial?.status === 'active') {
    const days = trial.trial.daysRemaining;
    return { text: `Activated in your plugin — ${days} day${days === 1 ? '' : 's'} left on your trial.`, colour: '#16a34a' };
  }
  if (trial.trial?.status === 'expired') {
    return { text: 'This trial has ended. Choose a plan to keep using ZAMERIA.', colour: '#b45309' };
  }
  if (trial.trial?.status === 'issued' || trial.code) {
    return { text: 'Waiting for you to enter this code in the plugin.', colour: '#64748b' };
  }
  return null;
};

/**
 * The website half of store activation: it asks the licensing service for a
 * code, then keeps checking what the plugin did with it, so the merchant is not
 * told "trial not started" on a store where they have already activated.
 */
export const TrialCodePanel: React.FC<{ trial: Trial }> = ({ trial }) => {
  const [copied, setCopied] = useState(false);
  const status = statusLine(trial);

  const copy = () => {
    if (!trial.code) return;
    navigator.clipboard?.writeText(trial.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '8px' }}>
      {trial.needsStoreUrl && !trial.code && (
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#071A31' }}>
          Your WooCommerce store address
          <input
            value={trial.storeUrl}
            onChange={(e) => trial.setStoreUrl(e.target.value)}
            placeholder="https://yourstore.com"
            style={{
              display: 'block',
              width: '100%',
              maxWidth: '420px',
              marginTop: '5px',
              padding: '10px 12px',
              boxSizing: 'border-box',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '13px',
            }}
          />
          <span style={{ display: 'block', marginTop: '5px', fontSize: '11.5px', color: '#94a3b8', fontWeight: 500 }}>
            One free trial per store. Your 7 days start when you enter the code in the plugin.
          </span>
        </label>
      )}

      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '14px',
          backgroundColor: '#f8fafc',
          border: '2px dashed #94a3b8',
          borderRadius: '12px',
          padding: '12px 18px',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ flex: 1, minWidth: '190px' }}>
          <div
            style={{
              fontSize: '10.5px',
              fontWeight: 800,
              color: '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            Trial Activation Code
          </div>
          <div
            style={{
              fontSize: '20px',
              fontWeight: 900,
              fontFamily: 'var(--font-mono)',
              color: '#071A31',
              letterSpacing: '0.08em',
            }}
          >
            {trial.code || 'Not issued yet'}
          </div>
          {trial.error && <div style={{ fontSize: '12px', color: '#b91c1c', marginTop: '4px' }}>{trial.error}</div>}
          {!trial.error && status && (
            <div style={{ fontSize: '12px', color: status.colour, marginTop: '4px', fontWeight: 600 }}>{status.text}</div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            type="button"
            disabled={trial.isRequesting}
            onClick={trial.code ? copy : trial.request}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              backgroundColor: copied ? '#16a34a' : '#071A31',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '12.5px',
              fontWeight: 700,
              cursor: trial.isRequesting ? 'progress' : 'pointer',
              opacity: trial.isRequesting ? 0.75 : 1,
            }}
          >
            {trial.isRequesting ? <Loader2 size={14} /> : copied ? <Check size={14} /> : <Copy size={14} />}
            <span>{trial.isRequesting ? 'Issuing…' : trial.code ? (copied ? 'Copied!' : 'Copy Code') : 'Get my code'}</span>
          </button>

          {trial.code && !trial.isRedeemed && (
            <button
              type="button"
              onClick={() => void trial.refresh()}
              title="Check whether the plugin has activated this store"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 12px',
                backgroundColor: '#ffffff',
                color: '#475569',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <RefreshCw size={13} />
              <span>Check</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
