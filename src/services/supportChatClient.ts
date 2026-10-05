/**
 * ZAMERIA Unified Support Chat Client Service - Website & Portal
 */

export interface SupportMessage {
  id: string;
  conversationId: string;
  senderType: 'customer' | 'support' | 'system';
  senderId?: string;
  senderName: string;
  message: string;
  createdAt: string;
  isInternalNote?: boolean;
}

export type SupportSource = 'POS' | 'WooCommerce Plugin' | 'Customer Dashboard' | 'Website';
export type SupportConversationStatus = 'Open' | 'In Progress' | 'Waiting for Customer' | 'Resolved';

export interface SupportConversation {
  id: string;
  customerId: string | null;
  businessName: string;
  customerName: string;
  email: string;
  phone?: string;
  plan?: string;
  storeUrl?: string;
  pluginVersion?: string;
  source: SupportSource;
  status: SupportConversationStatus;
  assignedStaffId: string | null;
  assignedStaffName: string | null;
  createdAt: string;
  updatedAt: string;
  lastMessageAt: string;
  lastMessage: string;
  lastMessageSender: 'customer' | 'support' | 'system';
  unreadBySupport: number;
  unreadByCustomer: number;
  messages: SupportMessage[];
}

const apiBase = (
  (typeof import.meta !== 'undefined' &&
    ((import.meta as any).env?.VITE_SCOREFLIP_BACKEND_URL || (import.meta as any).env?.VITE_BACKEND_URL || '')) ||
  'https://scoreflip-go-hwsgspeycq-uc.a.run.app'
).replace(/\/$/, '');
const sessionKey = 'zameria_website_support_session';
type VisitorSession = { id: string; token: string };
function getSession(): VisitorSession | null { try { return JSON.parse(localStorage.getItem(sessionKey) || 'null'); } catch { return null; } }
async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (!apiBase) throw new Error('Live support chat is temporarily unavailable due to scheduled maintenance.');
  let response: Response;
  try {
    response = await fetch(`${apiBase}/api/v1/zameria/support/${path}`, init);
  } catch {
    throw new Error('Our support service is temporarily undergoing scheduled maintenance. Please reach out to us at support@zameria.co or try again shortly.');
  }
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 503) {
      throw new Error('Our support service is temporarily undergoing scheduled maintenance. Please check back shortly.');
    }
    throw new Error(result.error || 'Support request could not be completed right now.');
  }
  return result as T;
}
export const supportChatClient = {
  getStoredVisitorConversationId(): string | null { return getSession()?.id || null; },
  setStoredVisitorConversationId(_id: string): void { /* server returns id and token together */ },
  async getConversation(conversationId: string): Promise<SupportConversation | null> {
    const session = getSession(); if (!session || session.id !== conversationId) return null;
    const result = await request<{ conversation: SupportConversation }>(`conversation?id=${encodeURIComponent(conversationId)}`, { headers: { Authorization: `Bearer ${session.token}` }, cache: 'no-store' });
    return this.sanitizeForCustomer(result.conversation);
  },
  async createVisitorConversation(params: { customerName: string; email: string; phone?: string; initialMessage: string }): Promise<SupportConversation> {
    const result = await request<{ conversation: SupportConversation; token: string }>('start', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: params.customerName, email: params.email, phone: params.phone || '', message: params.initialMessage }) });
    localStorage.setItem(sessionKey, JSON.stringify({ id: result.conversation.id, token: result.token }));
    return this.sanitizeForCustomer(result.conversation);
  },
  async sendMessage(conversationId: string, messageText: string, _senderName: string): Promise<SupportConversation | null> {
    const session = getSession(); if (!session || session.id !== conversationId) return null;
    const result = await request<{ conversation: SupportConversation }>(`conversation?id=${encodeURIComponent(conversationId)}`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.token}` }, body: JSON.stringify({ message: messageText }) });
    return this.sanitizeForCustomer(result.conversation);
  },
  async markAsReadByCustomer(conversationId: string): Promise<void> { await this.action(conversationId, 'read'); },
  async resolveConversation(conversationId: string): Promise<void> { await this.action(conversationId, 'resolve'); },
  async action(conversationId: string, action: string): Promise<void> {
    const session = getSession(); if (!session || session.id !== conversationId) return;
    await request(`conversation?id=${encodeURIComponent(conversationId)}`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.token}` }, body: JSON.stringify({ action }) });
  },
  sanitizeForCustomer(conv: SupportConversation): SupportConversation { return { ...conv, messages: (conv.messages || []).filter(message => !message.isInternalNote) }; },
};
