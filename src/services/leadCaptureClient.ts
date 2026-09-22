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

const ADMIN_LEADS_STORAGE_KEY = 'zameria_admin_leads_v1';
const BROADCAST_CHANNEL_NAME = 'zameria_leads_channel';

function getStoredLeads(): LeadRecord[] {
  try {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(ADMIN_LEADS_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveStoredLeads(leads: LeadRecord[]): void {
  try {
    if (typeof window === 'undefined') return;
    localStorage.setItem(ADMIN_LEADS_STORAGE_KEY, JSON.stringify(leads));
    window.dispatchEvent(new CustomEvent('zameria_leads_update'));
    try {
      const bc = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      bc.postMessage({ type: 'LEADS_UPDATED', count: leads.length });
      bc.close();
    } catch {}
  } catch (err) {
    console.warn('Failed to save leads to storage:', err);
  }
}

function normalizePhone(p?: string): string {
  if (!p) return '';
  return p.replace(/[^0-9+]/g, '');
}

export const leadCaptureClient = {
  /**
   * Captures or updates a lead when a user registers or signs up for a trial.
   * Enforces:
   * 1. Deduplication by Email OR Phone.
   * 2. If lead already exists, links Account ID and appends activity without duplicate creation.
   * 3. Account Registration != Trial Start. Status is always 'New'.
   */
  captureSignupLead(params: {
    name: string;
    businessName: string;
    email: string;
    phone?: string;
    accountId?: string;
    source?: LeadSource;
    plan?: string;
    storeUrl?: string;
    referralPartner?: ReferralPartnerInfo;
    campaign?: string;
    industry?: string;
  }): { success: boolean; leadId: string; isDuplicate: boolean } {
    try {
      const leads = getStoredLeads();
      const nowIso = new Date().toISOString();
      const cleanEmail = params.email.trim().toLowerCase();
      const cleanPhone = normalizePhone(params.phone);
      const source: LeadSource = params.source || 'Website Signup';

      // Duplicate check: check existing leads by email OR phone
      const existingIndex = leads.findIndex((l) => {
        if (l.contact.email.toLowerCase() === cleanEmail) return true;
        if (cleanPhone && cleanPhone.length >= 7) {
          const lPhone = normalizePhone(l.contact.phone);
          if (lPhone === cleanPhone) return true;
          if (lPhone.length >= 10 && cleanPhone.length >= 10 && lPhone.slice(-10) === cleanPhone.slice(-10)) return true;
        }
        return false;
      });

      if (existingIndex !== -1) {
        const existing = leads[existingIndex];

        // Link Account ID if provided
        if (params.accountId) {
          existing.accountId = params.accountId;
        }
        if (params.storeUrl && !existing.business.website) {
          existing.business.website = params.storeUrl;
        }
        if (params.referralPartner && !existing.referralPartner) {
          existing.referralPartner = params.referralPartner;
        }

        // Add activity event (do not overwrite original acquisition source)
        existing.sales.activityTimeline.unshift({
          id: `lact_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          leadId: existing.id,
          timestamp: nowIso,
          title: 'Account Registered',
          description: `Customer completed account registration for ${params.businessName || existing.business.name}. Account ID: ${params.accountId || 'Linked'}. Original source (${existing.sales.source}) preserved. Current status: ${existing.sales.stage}.`,
          actor: 'ZAMERIA Signup Service',
        });

        leads[existingIndex] = existing;
        saveStoredLeads(leads);
        return { success: true, leadId: existing.id, isDuplicate: true };
      }

      // Create new LeadRecord
      const leadId = `zm_lead_${Date.now().toString().slice(-4)}_${Math.random().toString(36).substring(2, 5)}`;
      const newLead: LeadRecord = {
        id: leadId,
        accountId: params.accountId || null,
        contact: {
          name: params.name.trim(),
          email: cleanEmail,
          phone: (params.phone || '+234 800 000 0000').trim(),
          whatsapp: (params.phone || '+234 800 000 0000').trim(),
        },
        business: {
          name: params.businessName.trim(),
          website: params.storeUrl,
          industry: params.industry || 'General Retail',
          location: 'Nigeria',
          hasPhysicalStore: true,
          hasWooCommerce: true,
        },
        qualification: {
          productCountRange: '100 - 1,000 products',
          mainProblem: 'Seeking synchronized POS and WooCommerce store inventory',
        },
        sales: {
          stage: 'New', // Strict requirement: Registration is 'New', not 'Trial'
          source,
          campaign: params.campaign || 'Direct Signup',
          assignedStaffId: null,
          assignedStaffName: null,
          dateCaptured: nowIso,
          lastContactAt: null,
          nextFollowUpDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          nextFollowUpNote: 'New account registered. Ready for initial onboarding outreach.',
          notes: [],
          activityTimeline: [
            {
              id: `lact_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
              leadId,
              timestamp: nowIso,
              title: 'Account Registered',
              description: `New customer account registered (${params.name} - ${params.businessName}). Account ID: ${params.accountId || 'N/A'}. Initial CRM status: New.`,
              actor: 'ZAMERIA Signup Service',
            },
          ],
        },
        conversion: {
          isConverted: false,
          convertedCustomerId: null,
          convertedAt: null,
          convertedPlan: null,
        },
        referralPartner: params.referralPartner,
      };

      leads.unshift(newLead);
      saveStoredLeads(leads);
      return { success: true, leadId: newLead.id, isDuplicate: false };
    } catch (err) {
      console.error('Lead capture error:', err);
      return { success: false, leadId: '', isDuplicate: false };
    }
  },

  /**
   * Authoritative Trial Activation Event: Triggered when WooCommerce plugin is activated
   * Updates Lead status -> Trial and records trial telemetry
   */
  recordTrialStarted(params: {
    accountId?: string;
    email?: string;
    phone?: string;
    startDate?: string;
    endDate?: string;
    activationCode?: string;
    storeName?: string;
    storeUrl?: string;
  }): { success: boolean } {
    try {
      const leads = getStoredLeads();
      const cleanEmail = params.email?.trim().toLowerCase();
      const cleanPhone = normalizePhone(params.phone);

      const lead = leads.find((l) => {
        if (params.accountId && l.accountId === params.accountId) return true;
        if (cleanEmail && l.contact.email.toLowerCase() === cleanEmail) return true;
        if (cleanPhone && cleanPhone.length >= 7) {
          const lPhone = normalizePhone(l.contact.phone);
          if (lPhone === cleanPhone) return true;
          if (lPhone.length >= 10 && cleanPhone.length >= 10 && lPhone.slice(-10) === cleanPhone.slice(-10)) return true;
        }
        return false;
      });

      if (!lead) return { success: false };

      const nowIso = new Date().toISOString();
      lead.sales.stage = 'Trial';
      lead.trial = {
        startDate: params.startDate || nowIso,
        endDate: params.endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        activationCode: params.activationCode,
        storeName: params.storeName || lead.business.name,
        storeUrl: params.storeUrl || lead.business.website,
      };

      if (params.storeUrl) {
        lead.business.website = params.storeUrl;
      }

      lead.sales.activityTimeline.unshift({
        id: `lact_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        leadId: lead.id,
        timestamp: nowIso,
        title: '7-Day Free Trial Started',
        description: `WooCommerce plugin successfully activated for ${params.storeName || lead.business.name} (${params.storeUrl || lead.business.website || 'store'}). Trial active until ${params.endDate ? new Date(params.endDate).toLocaleDateString() : '7 days'}.`,
        actor: 'WooCommerce Plugin Telemetry',
        stageChange: { to: 'Trial' },
      });

      saveStoredLeads(leads);
      return { success: true };
    } catch (err) {
      console.error('Failed to record trial start on lead:', err);
      return { success: false };
    }
  },

  /**
   * Authoritative Paid Customer Event: Triggered when customer completes payment
   * Updates Lead status -> Customer and preserves full acquisition history
   */
  recordPaidConversion(params: {
    accountId?: string;
    email?: string;
    phone?: string;
    plan: string;
    billingCycle?: 'yearly' | 'monthly';
    licenseKey?: string;
    orderNumber?: string;
    amount?: string;
    transactionRef?: string;
  }): { success: boolean } {
    try {
      const leads = getStoredLeads();
      const cleanEmail = params.email?.trim().toLowerCase();
      const cleanPhone = normalizePhone(params.phone);

      const lead = leads.find((l) => {
        if (params.accountId && l.accountId === params.accountId) return true;
        if (cleanEmail && l.contact.email.toLowerCase() === cleanEmail) return true;
        if (cleanPhone && cleanPhone.length >= 7) {
          const lPhone = normalizePhone(l.contact.phone);
          if (lPhone === cleanPhone) return true;
          if (lPhone.length >= 10 && cleanPhone.length >= 10 && lPhone.slice(-10) === cleanPhone.slice(-10)) return true;
        }
        return false;
      });

      if (!lead) return { success: false };

      const nowIso = new Date().toISOString();
      lead.sales.stage = 'Customer';
      lead.conversion = {
        isConverted: true,
        convertedCustomerId: params.accountId || lead.conversion.convertedCustomerId || `zm_cust_${Date.now().toString().slice(-4)}`,
        convertedAt: nowIso,
        convertedPlan: params.plan,
      };

      lead.sales.activityTimeline.unshift({
        id: `lact_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        leadId: lead.id,
        timestamp: nowIso,
        title: 'Converted to Paying Customer',
        description: `Customer purchased ${params.plan} Plan (${params.billingCycle || 'yearly'}). License Key: ${params.licenseKey || 'Active'}, Order: ${params.orderNumber || 'Paid'}.`,
        actor: 'Paystack / Billing Engine',
        stageChange: { to: 'Customer' },
      });

      saveStoredLeads(leads);
      return { success: true };
    } catch (err) {
      console.error('Failed to record paid conversion on lead:', err);
      return { success: false };
    }
  },
};
