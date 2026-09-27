/**
 * ZAMERIA Lead Capture Client Service
 * Automatically captures website registrations and trial signups,
 * syncing authoritatively into ZAMERIA Admin Dashboard -> Leads.
 */

export type LeadStage =
  | 'New'
  | 'Contacted'
  | 'Interested'
  | 'Trial'
  | 'Customer'
  | 'Lost'
  | 'Qualified'
  | 'Demo'
  | 'Won';

export type LeadSource =
  | 'Website'
  | 'Website Signup'
  | 'Trial Signup'
  | 'Assessment'
  | 'Meta Ads'
  | 'Instagram'
  | 'Facebook'
  | 'WhatsApp'
  | 'Referral'
  | 'Manual'
  | 'Cold Outreach'
  | 'Other';

export interface LeadActivityEvent {
  id: string;
  leadId: string;
  timestamp: string;
  title: string;
  description: string;
  actor: string;
  stageChange?: { from?: LeadStage; to?: LeadStage };
}

export interface LeadInternalNote {
  id: string;
  leadId: string;
  adminId: string;
  adminName: string;
  note: string;
  createdAt: string;
}

export interface ReferralPartnerInfo {
  partnerName: string;
  partnerEmail?: string;
  partnerPhone?: string;
  partnerCode?: string;
  referralNotes?: string;
}

export interface LeadRecord {
  id: string;
  accountId?: string | null;
  contact: {
    name: string;
    email: string;
    phone: string;
    whatsapp?: string;
  };
  business: {
    name: string;
    website?: string;
    industry?: string;
    location?: string;
    hasPhysicalStore?: boolean;
    hasWooCommerce?: boolean;
  };
  qualification: {
    productCountRange?: string;
    storeLocationsCount?: number;
    currentPosSystem?: string;
    mainProblem?: string;
    assessmentAnswers?: Record<string, any>;
    customNotes?: string;
  };
  sales: {
    stage: LeadStage;
    source: LeadSource;
    campaign?: string;
    assignedStaffId?: string | null;
    assignedStaffName?: string | null;
    dateCaptured: string;
    lastContactAt?: string | null;
    nextFollowUpDate?: string | null;
    nextFollowUpNote?: string | null;
    notes: LeadInternalNote[];
    activityTimeline: LeadActivityEvent[];
  };
  conversion: {
    isConverted: boolean;
    convertedCustomerId?: string | null;
    convertedAt?: string | null;
    convertedPlan?: string | null;
  };
  trial?: {
    startDate?: string | null;
    endDate?: string | null;
    activationCode?: string | null;
    storeName?: string | null;
    storeUrl?: string | null;
  };
  referralPartner?: ReferralPartnerInfo;
}

const apiBase = (((import.meta as any).env?.VITE_SCOREFLIP_BACKEND_URL || (import.meta as any).env?.VITE_BACKEND_URL || '') as string).replace(/\/$/, '');
function postLead(payload: Record<string, unknown>): void {
  if (!apiBase) { console.error('Lead capture backend is not configured'); return; }
  void fetch(`${apiBase}/api/v1/zameria/lead/capture`, { method: 'POST', keepalive: true, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    .then(response => { if (!response.ok) throw new Error(`Lead capture failed (${response.status})`); })
    .catch(error => console.error('Could not record ZAMERIA lead:', error));
}
export const leadCaptureClient = {
  captureSignupLead(params: { name: string; businessName: string; email: string; phone?: string; accountId?: string; source?: LeadSource; plan?: string; storeUrl?: string; referralPartner?: ReferralPartnerInfo; campaign?: string; industry?: string }): { success: boolean; leadId: string; isDuplicate: boolean } {
    postLead({ event: 'signup', name: params.name, business_name: params.businessName, email: params.email, phone: params.phone || '', account_id: params.accountId || '', source: params.source || 'Website Signup', store_url: params.storeUrl || '' });
    return { success: true, leadId: '', isDuplicate: false };
  },
  recordTrialStarted(params: { accountId?: string; email?: string; phone?: string; startDate?: string; endDate?: string; activationCode?: string; storeName?: string; storeUrl?: string }): { success: boolean } {
    if (!params.email) return { success: false };
    postLead({ event: 'trial_started', email: params.email, name: params.storeName || 'Customer', business_name: params.storeName || '', account_id: params.accountId || '', store_url: params.storeUrl || '' });
    return { success: true };
  },
  recordPaidConversion(params: { accountId?: string; email?: string; phone?: string; plan: string; billingCycle?: 'yearly' | 'monthly'; licenseKey?: string; orderNumber?: string; amount?: string; transactionRef?: string }): { success: boolean } {
    if (!params.email) return { success: false };
    postLead({ event: 'paid_conversion', email: params.email, name: 'Customer', business_name: '', account_id: params.accountId || '' });
    return { success: true };
  },
};
