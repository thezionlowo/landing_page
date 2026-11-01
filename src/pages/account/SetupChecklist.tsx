import { BRAND_SUPPORT } from '../../lib/brandMessaging';
import React, { useState } from 'react';
import { getPosAppUrl } from '../../lib/routes';

interface Props {
  connected: boolean;
  storeUrl: string;
  email: string;
  checkConnection: () => Promise<{ success: boolean; error?: string }>;
}
/** Store completion comes from server confirmation. Downloads and opening a till are not completion evidence. */
export function SetupChecklist({ connected, storeUrl, email, checkConnection }: Props) {
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
  return <section aria-labelledby="store-setup-heading" style={{ padding: '24px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', color: '#071a31' }}>
    <h2 id="store-setup-heading" style={{ margin: '0 0 8px', fontSize: '22px' }}>Set up your store</h2>
    <p style={{ color: '#64748b', lineHeight: 1.6 }}>{BRAND_SUPPORT} Use the same ZAMERIA account on the website and in the plugin, then follow these steps.</p>
    <ol style={{ paddingLeft: '22px', lineHeight: 1.7 }}>
      <li><strong>Account created</strong><p style={{ marginTop: 0 }}>{email} — use this account in the WordPress plugin too.</p></li>
      <li><strong>{connected ? 'Plugin installed and store connected' : 'Install the plugin and connect your store'}</strong>
        <p style={{ marginTop: 0 }}>On your computer, download the ZIP. In WordPress, go to Plugins → Add New → Upload Plugin, install and activate it. Open ZAMERIA and log in with your existing ZAMERIA account.</p>
        <a href="/downloads/zameria.zip" download>Download WordPress plugin</a>{' · '}
        <button type="button" disabled={checking} onClick={check}>{checking ? 'Checking…' : 'Check connection'}</button>
        <p role="status" style={{ color: '#475569' }}>{message || (connected ? 'Store connection confirmed by ZAMERIA.' : 'A website address or plugin download alone does not confirm a connection.')}</p>
      </li>
      <li><strong>Connect your POS device</strong><p style={{ marginTop: 0 }}>Once the store is connected, open POS on your till or phone. Use an authorised WordPress staff account. Ask your store administrator for access if you are joining a store.</p>
        {connected ? <a href={posUrl} target="_blank" rel="noopener noreferrer">Open POS</a> : <span>Connect the plugin before signing in to POS.</span>}
      </li>
      <li><strong>Finish the first sync and start selling</strong><p style={{ marginTop: 0 }}>Wait for the catalogue to finish syncing in POS. Check your products and prices before making your first sale. Device sync progress is shown on that device.</p></li>
    </ol>
    <p style={{ marginBottom: 0, color: '#64748b', fontSize: '13px' }}>For eligible stores, the trial begins when the store is successfully connected. Downloading the plugin or adding a device does not start another trial.</p>
  </section>;
}
