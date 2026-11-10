import { useState, type FormEvent } from 'react';
import { Copy, Download } from 'lucide-react';
import { useCustomerAuth, type OrderItem } from '../../context/CustomerAuthContext';
import { accountPresentation } from '../../lib/accountPresentation';
import { downloadReceipt } from '../../lib/billing';
import { AccountDialog } from '../../components/AccountDialog';
import { AddLicenseModal } from './AddLicenseModal';

export function BillingTab() {
  const { customer, updateBillingAddress } = useCustomerAuth();
  const [plansOpen, setPlansOpen] = useState(false);
  const [addressOpen, setAddressOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [address, setAddress] = useState({ firstName: customer?.billingAddress?.firstName || customer?.fullName?.split(' ')[0] || '', lastName: customer?.billingAddress?.lastName || customer?.fullName?.split(' ').slice(1).join(' ') || '', company: customer?.billingAddress?.company || customer?.businessName || '', address: customer?.billingAddress?.address || '', city: customer?.billingAddress?.city || '', state: customer?.billingAddress?.state || '', country: customer?.billingAddress?.country || '', phone: customer?.billingAddress?.phone || customer?.phone || '' });
  if (!customer) return null;
  const account = accountPresentation(customer);
  async function receipt(order: OrderItem) {
    setBusy(true); setError(''); setMessage('');
    try { if (!order.transactionRef) throw new Error('No verified payment reference is available for this receipt.'); await downloadReceipt(order.transactionRef); setMessage(`Receipt ${order.invoiceNumber || order.orderNumber} downloaded.`); }
    catch (e) { setError(e instanceof Error ? e.message : 'Could not download receipt.'); }
    finally { setBusy(false); }
  }
  async function saveAddress(e: FormEvent) {
    e.preventDefault(); setBusy(true); setError('');
    try { const result = await updateBillingAddress(address); if (result.success) { setAddressOpen(false); setMessage('Billing address saved.'); } else setError(result.error || 'Could not save address.'); }
    catch { setError('Could not save address. Try again.'); }
    finally { setBusy(false); }
  }
  return <div className="site-account-page">
    <header className="site-account-page-heading"><div><h1>Plan & billing</h1><p>Your plan, licence and payment receipts.</p></div><button className="site-account-primary" onClick={() => setPlansOpen(true)}>{account.state === 'paid_active' ? 'View plans' : 'Choose a plan'}</button></header>
    {message && <p role="status" className="site-account-notice">{message}</p>}{error && !addressOpen && <p role="alert" className="site-account-error">{error}</p>}
    <section className="site-account-panel"><div className="site-account-panel-heading"><h2>{account.plan}</h2><span className="site-account-tag">{account.status}</span></div><p className="site-account-price">{account.price}{account.price !== 'Complimentary' && <small> / year</small>}</p><dl className="site-account-definition-list"><div><dt>Access ends</dt><dd>{account.date}</dd></div><div><dt>Included</dt><dd>{account.plan === 'Business' ? 'Unlimited products, staff and registers' : '500 products, two staff and two registers'}</dd></div><div><dt>Store coverage</dt><dd>One WooCommerce store and one physical location.</dd></div></dl>{account.state === 'trial_active' && <p className="site-account-help">You are on a free trial. The annual price applies when you buy a plan.</p>}
    {account.license?.licenseKey && <div className="site-account-license"><h3>Your licence key</h3><div className="site-account-copy-row"><code>{account.license.licenseKey}</code><button onClick={async () => { try { await navigator.clipboard.writeText(account.license!.licenseKey); setCopied(true); } catch { setError('Select the licence key above and copy it.'); } }}><Copy size={14} />{copied ? 'Copied' : 'Copy key'}</button></div><p className="site-account-help">Keep this key private.</p></div>}</section>
    <section className="site-account-panel"><div className="site-account-panel-heading"><h2>Billing address</h2><button onClick={() => { setError(''); setAddressOpen(true); }}>Edit address</button></div>{customer.billingAddress?.address ? <address>{customer.billingAddress.company}<br />{customer.billingAddress.address}<br />{[customer.billingAddress.city, customer.billingAddress.state, customer.billingAddress.country].filter(Boolean).join(', ')}</address> : <p>No billing address saved.</p>}</section>
    <section className="site-account-panel"><h2>Payment receipts</h2>{customer.orders?.length ? <div className="site-account-table-wrap" tabIndex={0} role="region" aria-label="Payment receipts"><table><thead><tr><th scope="col">Receipt</th><th scope="col">Date</th><th scope="col">Plan</th><th scope="col">Total</th><th scope="col">Status</th><th scope="col">Download</th></tr></thead><tbody>{customer.orders.map(order => <tr key={order.id}><th scope="row">{order.invoiceNumber || order.orderNumber}</th><td>{order.date}</td><td>{order.plan}</td><td>{order.total}</td><td>{order.status}</td><td><button disabled={busy || !order.transactionRef} onClick={() => receipt(order)} aria-label={`Download receipt ${order.invoiceNumber || order.orderNumber}`}><Download size={14} />PDF</button></td></tr>)}</tbody></table></div> : <p>Your receipts will appear here after payment.</p>}</section>
    <AddLicenseModal isOpen={plansOpen} onClose={() => setPlansOpen(false)} initialPlan={account.plan} />
    {addressOpen && <AccountDialog title="Billing address" onClose={() => setAddressOpen(false)}><form className="site-account-form" onSubmit={saveAddress}>{([['firstName', 'First name', 'given-name'], ['lastName', 'Last name', 'family-name'], ['company', 'Business name', 'organization'], ['address', 'Street address', 'street-address'], ['city', 'City', 'address-level2'], ['state', 'State or region', 'address-level1'], ['country', 'Country', 'country-name'], ['phone', 'Phone number', 'tel']] as const).map(([key, label, autoComplete]) => <label key={key}>{label}<input value={address[key]} autoComplete={autoComplete} type={key === 'phone' ? 'tel' : 'text'} required={['firstName', 'address', 'city', 'country'].includes(key)} onChange={e => setAddress({ ...address, [key]: e.target.value })} /></label>)}{error && <p role="alert" className="site-account-error">{error}</p>}<div className="site-account-actions"><button type="submit" className="site-account-primary" disabled={busy}>{busy ? 'Saving…' : 'Save address'}</button><button type="button" onClick={() => setAddressOpen(false)}>Cancel</button></div></form></AccountDialog>}
  </div>;
}
export default BillingTab;
