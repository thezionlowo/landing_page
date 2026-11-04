import { calculateTrialDaysRemaining, resolveSubscriptionState, type CustomerProfile } from '../context/CustomerAuthContext';
import { getAuthoritativePlanPrice } from './geoPricing';

export function accountPresentation(customer: CustomerProfile) {
  const license = customer.licenses?.[0];
  const state = resolveSubscriptionState(customer);
  const plan = String(customer.giftedDetails?.plan || license?.plan || customer.plan || customer.subscription?.planId || '').toLowerCase().includes('business') ? 'Business' : 'Starter';
  const complimentary = Boolean(customer.giftedDetails || customer.accessType === 'Gifted' || customer.accessType === 'Complimentary');
  const status = state === 'paid_active' ? (complimentary ? 'Complimentary access' : 'Active plan') : state === 'trial_active' ? `Trial · ${calculateTrialDaysRemaining(customer)} days left` : state === 'trial_expired' ? 'Trial ended' : state === 'paid_expired' ? 'Plan expired' : state === 'past_due' ? 'Payment needs attention' : 'No active plan';
  const expiry = state === 'trial_active' || state === 'trial_expired' ? customer.trial?.endDate || customer.trialEndsAt : customer.giftedDetails?.expiresAt || customer.subscription?.renewsAt || customer.nextBillingDate || license?.expiresAt;
  const date = expiry && Number.isFinite(new Date(expiry).getTime()) ? new Date(expiry).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Not available';
  const store = customer.connectedStore?.url || (license?.connectedDomain ? `https://${license.connectedDomain}` : '');
  return { license, state, plan, status, date, store, connected: customer.connectedStore?.status === 'connected' && Boolean(store), price: complimentary ? 'Complimentary' : getAuthoritativePlanPrice(customer.currency === 'USD' ? 'US' : customer.currency === 'NGN' ? 'NG' : customer.country || 'NG', plan).replace(/ \/ year$/, '') };
}
