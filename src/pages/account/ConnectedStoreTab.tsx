import { useState } from 'react';
import { ExternalLink, RefreshCw } from 'lucide-react';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { accountPresentation } from '../../lib/accountPresentation';
import { SetupChecklist } from './SetupChecklist';

export function ConnectedStoreTab() {
  const { customer, retryStoreConnection, disconnectStore } = useCustomerAuth();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [confirmDisconnect, setConfirmDisconnect] = useState(false);
  if (!customer) return null;
  const account = accountPresentation(customer);
  async function check() {
    setBusy(true); setMessage('');
    try { const result = await retryStoreConnection(); setMessage(result.success ? 'Store connection confirmed. Check catalogue sync in your POS.' : result.error || 'Connection not confirmed.'); }
    catch { setMessage('Could not check the connection. Try again online.'); }
    finally { setBusy(false); }
  }
  async function disconnect() {
    setBusy(true);
    try { const result = await disconnectStore(); if (result.success) { setConfirmDisconnect(false); setMessage('Store disconnected.'); } else setMessage(result.error || 'Could not disconnect the store.'); }
    catch { setMessage('Could not disconnect the store. Try again.'); }
    finally { setBusy(false); }
  }
  return <div className="site-account-page">
    <header className="site-account-page-heading"><div><h1>Your store</h1><p>Connect WooCommerce and check its connection.</p></div><span className="site-account-tag">{account.connected ? 'Connected' : 'Not connected'}</span></header>
    {message && <p role="status" className="site-account-notice">{message}</p>}
    {account.connected ? <><section className="site-account-panel"><h2>{customer.connectedStore?.name || customer.businessName || 'WooCommerce store'}</h2><p className="site-account-store-url">{account.store}</p><div className="site-account-actions"><a className="site-account-primary" href={`${account.store.replace(/\/$/, '')}/pos/`} target="_blank" rel="noopener noreferrer">Open POS<ExternalLink size={14} /></a><button disabled={busy} onClick={check}><RefreshCw size={15} />{busy ? 'Checking…' : 'Check connection'}</button><a href={`${account.store.replace(/\/$/, '')}/wp-admin/admin.php?page=zameria-pos`} target="_blank" rel="noopener noreferrer">Plugin settings<ExternalLink size={14} /></a></div><p className="site-account-help">This checks the store connection. Product and order sync progress is shown on each POS device.</p></section>
    <section className="site-account-panel"><h2>Disconnect this store</h2><p>The POS will need a store connection to keep syncing.</p>{confirmDisconnect ? <div className="site-account-notice"><p>Disconnect {account.store}?</p><div className="site-account-actions"><button disabled={busy} onClick={disconnect}>{busy ? 'Disconnecting…' : 'Confirm disconnect'}</button><button disabled={busy} onClick={() => setConfirmDisconnect(false)}>Keep connected</button></div></div> : <button className="site-account-danger" onClick={() => setConfirmDisconnect(true)}>Disconnect store</button>}</section></> : <SetupChecklist connected={false} storeUrl={account.store} email={customer.email} checkConnection={retryStoreConnection} />}
  </div>;
}
export default ConnectedStoreTab;
