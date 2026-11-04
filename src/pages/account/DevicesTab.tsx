import { useState } from 'react';
import { Copy, Check, Monitor, ExternalLink } from 'lucide-react';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { useRouter } from '../../router/Router';

export function DevicesTab() {
  const { customer } = useCustomerAuth();
  const { setAccountTab } = useRouter();
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState('');
  if (!customer) return null;
  const store = customer.connectedStore?.url || (customer.licenses?.[0]?.connectedDomain ? `https://${customer.licenses[0].connectedDomain}` : '');
  const posUrl = store ? `${store.replace(/\/$/, '')}/pos/` : '';
  const plan = String(customer.giftedDetails?.plan || customer.licenses?.[0]?.plan || customer.plan || customer.subscription?.planId || '').toLowerCase();
  const allowance = plan.includes('business') ? 'Unlimited registers' : 'Up to two registers on Starter';
  return <div className="site-account-page">
    <header className="site-account-page-heading"><div><h1>Devices & hardware</h1><p>Open the POS and check your counter setup.</p></div>{posUrl ? <a className="site-account-primary" href={posUrl} target="_blank" rel="noopener noreferrer"><Monitor size={16} />Open POS<ExternalLink size={13} /></a> : <button className="site-account-primary" onClick={() => setAccountTab('store')}>Connect your store</button>}</header>
    <section className="site-account-panel"><div className="site-account-panel-heading"><h2>Your POS link</h2><span className="site-account-tag">{allowance}</span></div>{posUrl ? <><p>Use this link on your mobile, iPad, laptop or desktop. Sign in with your authorised staff account.</p><div className="site-account-copy-row"><code>{posUrl}</code><button type="button" onClick={async () => { try { await navigator.clipboard.writeText(posUrl); setCopied(true); setCopyError(''); } catch { setCopyError('Copy the link above to use it on another device.'); } }}>{copied ? <Check size={15} /> : <Copy size={15} />}{copied ? 'Copied' : 'Copy link'}</button></div>{copyError && <p role="status" className="site-account-help">{copyError}</p>}</> : <p>Connect your WooCommerce store to get its POS link.</p>}</section>
    <section className="site-account-panel"><h2>Before the first sale</h2><dl className="site-account-definition-list"><div><dt>Browser & screen</dt><dd>Sign in, finish the first sync and try product search and checkout on your chosen device.</dd></div><div><dt>Barcode scanner</dt><dd>Test a scanner that enters the code like keyboard input. Check that it finds the correct product.</dd></div><div><dt>Receipt printer</dt><dd>Preview a 58mm or 80mm receipt. Test your exact printer, browser and connection.</dd></div><div><dt>Connection gaps</dt><dd>Eligible sales can save on a previously synced device with valid access. Reconnect to upload them and receive stock updates.</dd></div></dl><a className="site-account-text-link" href="/hardware-compatibility">Read the device setup guide<ExternalLink size={13} /></a></section>
  </div>;
}
export default DevicesTab;
