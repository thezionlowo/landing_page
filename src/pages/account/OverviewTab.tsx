import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { useRouter } from '../../router/Router';
import { accountPresentation } from '../../lib/accountPresentation';
import { SetupChecklist } from './SetupChecklist';
import { AddLicenseModal } from './AddLicenseModal';

export function OverviewTab() {
  const { customer, retryStoreConnection } = useCustomerAuth();
  const { setAccountTab } = useRouter();
  const [plansOpen, setPlansOpen] = useState(false);
  if (!customer) return null;
  const account = accountPresentation(customer);
  const needsPlan = ['trial_expired', 'paid_expired', 'past_due'].includes(account.state);
  return <div className="site-account-page">
    <header className="site-account-page-heading"><div><h1>Your workspace</h1><p>{customer.businessName || customer.fullName} · Manage your store and account.</p></div>{account.connected ? <a className="site-account-primary" href={`${account.store.replace(/\/$/, '')}/pos/`} target="_blank" rel="noopener noreferrer">Open POS<ArrowUpRight size={16} /></a> : <button className="site-account-primary" onClick={() => setAccountTab('store')}>Connect your store</button>}</header>
    {needsPlan && <div className="site-account-notice"><p>{account.status}. Choose a plan to continue using the POS.</p><button onClick={() => setPlansOpen(true)}>Choose a plan</button></div>}
    <div className="site-account-summary"><button onClick={() => setAccountTab('billing')}><span>Your plan</span><strong>{account.plan}</strong><small>{account.status}</small></button><button onClick={() => setAccountTab('store')}><span>Store connection</span><strong>{account.connected ? 'Connected' : 'Setup needed'}</strong><small>{account.store || 'Connect one WooCommerce store'}</small></button><button onClick={() => setAccountTab('devices')}><span>Devices</span><strong>{account.plan === 'Business' ? 'Unlimited registers' : 'Two registers'}</strong><small>Mobile, iPad, laptop & desktop</small></button></div>
    {!account.connected ? <SetupChecklist hasPaidPlan={account.state === 'paid_active'} connected={false} storeUrl={account.store} email={customer.email} checkConnection={retryStoreConnection} /> : <section className="site-account-panel"><h2>Your store is connected</h2><p>Open the POS on your chosen device. Finish its first sync, then check your products and prices before selling.</p><div className="site-account-actions"><button onClick={() => setAccountTab('store')}>Store settings</button><button onClick={() => setAccountTab('team')}>Manage team access</button></div></section>}
    <AddLicenseModal isOpen={plansOpen} onClose={() => setPlansOpen(false)} initialPlan="Business" />
  </div>;
}
export default OverviewTab;
