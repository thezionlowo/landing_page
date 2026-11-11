import React, { useState } from 'react';
import { getPosAppUrl } from '../../lib/routes';

interface Props {
  connected: boolean;
  hasPaidPlan?: boolean;
  storeUrl: string;
  email: string;
  checkConnection: () => Promise<{ success: boolean; error?: string }>;
}
/** Store completion comes from server confirmation. Downloads and opening a till are not completion evidence. */
export function SetupChecklist({ connected, hasPaidPlan = false, storeUrl, email, checkConnection }: Props) {
  const [checking, setChecking] = useState(false);
  const [message, setMessage] = useState('');
  const check = async () => {
    setChecking(true); setMessage('');
    try {
      const result = await checkConnection();
      setMessage(result.success ? 'Your store connection is confirmed. Continue on your POS device.' : result.error || 'Connection not confirmed yet.');
    } catch { setMessage('Could not check your connection. Please retry online.'); }
    finally { setChecking(false); }
  };
  const posUrl = getPosAppUrl(`/login${connected && storeUrl ? `?store=${encodeURIComponent(storeUrl)}` : ''}`);
  return <section className="site-setup-checklist" aria-labelledby="store-setup-heading">
    <div className="site-setup-intro">
      <span className="hm-eyebrow">GET STARTED</span>
      <h2 id="store-setup-heading">Set up your store</h2>
      <p>Install the plugin, connect WooCommerce and open your POS.</p>
    </div>
    <ol>
      <li>
        <strong>Account created</strong>
        <p>{email} — use this account in the WordPress plugin too.</p>
      </li>
      <li>
        <strong>{connected ? 'Plugin installed and store connected' : 'Install the plugin and connect your store'}</strong>
        <p>Download the ZIP, then go to Plugins → Add New → Upload Plugin in WordPress. Install and activate ZAMERIA, then log in with your existing account.</p>
        <div className="site-setup-actions">
          <a href="/downloads/zameria.zip" download="zameria.zip">Download plugin</a>
          <button type="button" disabled={checking} onClick={check}>{checking ? 'Checking…' : 'Check connection'}</button>
        </div>
        <p role="status" className="site-setup-status">{message || (connected ? 'Store connection confirmed by ZAMERIA.' : 'Check after signing in to the plugin.')}</p>
      </li>
      <li>
        <strong>Connect your POS device</strong>
        <p>Open POS and sign in with your authorised WordPress staff account.</p>
        {connected ? <div className="site-setup-actions"><a href={posUrl} target="_blank" rel="noopener noreferrer">Open POS</a></div> : <p className="site-setup-status">Connect the plugin before signing in to POS.</p>}
      </li>
      <li>
        <strong>Finish the first sync and start selling</strong>
        <p>Wait for the first sync. Check your products and prices, then make a test sale.</p>
      </li>
    </ol>
    <p className="site-setup-footnote">{hasPaidPlan ? 'Your account’s access is applied when you connect the plugin.' : 'Your eligible seven-day trial starts when the store connection is confirmed.'}</p>
  </section>;
}
