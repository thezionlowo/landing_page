import { Users, ExternalLink } from 'lucide-react';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { useRouter } from '../../router/Router';

export function TeamTab() {
  const { customer } = useCustomerAuth();
  const { setAccountTab } = useRouter();
  if (!customer) return null;
  const store = customer.connectedStore?.url || (customer.licenses?.[0]?.connectedDomain ? `https://${customer.licenses[0].connectedDomain}` : '');
  const plan = String(customer.giftedDetails?.plan || customer.licenses?.[0]?.plan || customer.plan || customer.subscription?.planId || '').toLowerCase();
  const business = plan.includes('business');
  return <div className="site-account-page">
    <header className="site-account-page-heading"><div><h1>Team access</h1><p>Give staff their own logins and the right access.</p></div>{store ? <a className="site-account-primary" href={`${store.replace(/\/$/, '')}/wp-admin/users.php`} target="_blank" rel="noopener noreferrer"><Users size={16} />Manage staff<ExternalLink size={13} /></a> : <button className="site-account-primary" onClick={() => setAccountTab('store')}>Connect your store</button>}</header>
    <section className="site-account-panel"><h2>Your staff allowance</h2><p>{business ? 'Business supports unlimited staff members.' : 'Starter supports up to five staff members. Business supports unlimited staff.'}</p><p className="site-account-help">The staff role in WordPress controls which POS screens and actions they can use.</p></section>
    <section className="site-account-panel"><h2>Choose access by role</h2><dl className="site-account-definition-list"><div><dt>Cashier</dt><dd>Use checkout and the order actions allowed for the account.</dd></div><div><dt>Shop manager</dt><dd>Manage products, stock and orders where their permissions allow.</dd></div><div><dt>Administrator</dt><dd>Manage store settings, staff access and the POS.</dd></div></dl></section>
    <section className="site-account-panel"><h2>Add a staff member</h2><ol className="site-account-instructions"><li>Open your WordPress store and choose <strong>Users → Add New</strong>.</li><li>Add the staff member’s details and choose their role.</li><li>Check their permissions, then ask them to sign in to the POS with their store login.</li></ol></section>
  </div>;
}
export default TeamTab;
