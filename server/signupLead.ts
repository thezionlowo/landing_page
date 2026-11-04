import { backendBase } from './accountSession.js';
export interface SignupLead {
  event: 'signup'; account_id: string; email: string; name: string; business_name: string;
  phone: string; store_url: string; source: 'Website Signup'; registration_source: 'website';
  event_id: string; campaign: string;
}
const text = (value: unknown, limit: number) => typeof value === 'string' ? value.trim().slice(0, limit) : '';
export function signupLead(account: any, submitted: any): SignupLead {
  const id = String(account.id);
  return { event: 'signup', account_id: id, email: account.email.trim().toLowerCase(),
    name: text(account.full_name || account.fullName || submitted.full_name, 80),
    business_name: text(account.business_name || account.businessName || submitted.business_name, 100),
    phone: text(account.phone || submitted.phone, 30), store_url: text(submitted.store_url, 256),
    source: 'Website Signup', registration_source: 'website', event_id: `signup:${id}`, campaign: text(submitted.campaign, 100) };
}
/** Never claim capture until the service acknowledges it. Reuse the key on every retry. */
export async function deliverSignupLead(lead: SignupLead, token: string): Promise<boolean> {
  try {
    const response = await fetch(`${backendBase()}/lead/capture`, { method: 'POST', redirect: 'error', cache: 'no-store', signal: AbortSignal.timeout(4000),
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, 'Idempotency-Key': lead.event_id }, body: JSON.stringify(lead) });
    const data = await response.json().catch(() => null);
    return response.ok && data !== null && data.success !== false && Boolean(data.success === true || data.lead?.id || data.lead_id || data.leadId);
  } catch { return false; }
}
