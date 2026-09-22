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

const STORAGE_KEY = 'zameria_support_conversations_v1';
const VISITOR_CONV_KEY = 'zameria_website_visitor_conv_id';
const BROADCAST_NAME = 'zameria_support_chat';

function getStoredConversations(): SupportConversation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveStoredConversations(conversations: SupportConversation[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    window.dispatchEvent(new CustomEvent('zameria_support_update'));
    try {
      const bc = new BroadcastChannel(BROADCAST_NAME);
      bc.postMessage({ type: 'CONVERSATIONS_UPDATED' });
      bc.close();
    } catch {}
  } catch (err) {
    console.error('Failed to save support conversations:', err);
  }
}

export const supportChatClient = {
  getStoredVisitorConversationId(): string | null {
    try {
      return localStorage.getItem(VISITOR_CONV_KEY);
    } catch {
      return null;
    }
  },

  setStoredVisitorConversationId(id: string): void {
    try {
      localStorage.setItem(VISITOR_CONV_KEY, id);
    } catch {}
  },

  getConversation(conversationId: string): SupportConversation | null {
    const conversations = getStoredConversations();
    const found = conversations.find((c) => c.id === conversationId);
    if (!found) return null;
    return this.sanitizeForCustomer(found);
  },

  createVisitorConversation(params: {
    customerName: string;
    email: string;
    phone?: string;
    initialMessage: string;
  }): SupportConversation {
    const conversations = getStoredConversations();
    const now = new Date().toISOString();

    // Check if email belongs to an existing customer in storage
    let matchedCustomerId: string | null = null;
    let matchedBusinessName = `${params.customerName} (Website Visitor)`;

    const existingMatch = conversations.find((c) => c.email.toLowerCase() === params.email.toLowerCase());
    if (existingMatch && existingMatch.customerId) {
      matchedCustomerId = existingMatch.customerId;
      matchedBusinessName = existingMatch.businessName;
    }

    const conversationId = 'conv_web_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6);
    const initialMessages: SupportMessage[] = [
      {
        id: 'msg_' + Date.now().toString(36) + '_1',
        conversationId,
        senderType: 'customer',
        senderId: matchedCustomerId || undefined,
        senderName: params.customerName,
        message: params.initialMessage,
        createdAt: now,
      },
    ];

    const newConv: SupportConversation = {
      id: conversationId,
      customerId: matchedCustomerId,
      businessName: matchedBusinessName,
      customerName: params.customerName,
      email: params.email,
      phone: params.phone || undefined,
      plan: 'Website Inquiry',
      source: 'Website',
      status: 'Open',
      assignedStaffId: null,
      assignedStaffName: null,
      createdAt: now,
      updatedAt: now,
      lastMessageAt: now,
      lastMessage: params.initialMessage,
      lastMessageSender: 'customer',
      unreadBySupport: 1,
      unreadByCustomer: 0,
      messages: initialMessages,
    };

    conversations.unshift(newConv);
    saveStoredConversations(conversations);
    this.setStoredVisitorConversationId(conversationId);

    return this.sanitizeForCustomer(newConv);
  },

  sendMessage(conversationId: string, messageText: string, senderName: string): SupportConversation | null {
    const conversations = getStoredConversations();
    const convIndex = conversations.findIndex((c) => c.id === conversationId);
    if (convIndex === -1) return null;

    const conv = conversations[convIndex];
    const now = new Date().toISOString();

    const newMsg: SupportMessage = {
      id: 'msg_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6),
      conversationId,
      senderType: 'customer',
      senderName: senderName || conv.customerName,
      message: messageText,
      createdAt: now,
    };

    conv.messages.push(newMsg);
    conv.lastMessage = messageText;
    conv.lastMessageAt = now;
    conv.lastMessageSender = 'customer';
    conv.updatedAt = now;
    conv.unreadBySupport = (conv.unreadBySupport || 0) + 1;

    if (conv.status === 'Resolved') {
      conv.status = 'Open';
    }

    conversations[convIndex] = conv;
    saveStoredConversations(conversations);

    return this.sanitizeForCustomer(conv);
  },

  markAsReadByCustomer(conversationId: string): void {
    const conversations = getStoredConversations();
    const conv = conversations.find((c) => c.id === conversationId);
    if (conv && conv.unreadByCustomer > 0) {
      conv.unreadByCustomer = 0;
      saveStoredConversations(conversations);
    }
  },

  resolveConversation(conversationId: string): void {
    const conversations = getStoredConversations();
    const conv = conversations.find((c) => c.id === conversationId);
    if (conv) {
      conv.status = 'Resolved';
      conv.updatedAt = new Date().toISOString();
      saveStoredConversations(conversations);
    }
  },

  sanitizeForCustomer(conv: SupportConversation): SupportConversation {
    return {
      ...conv,
      messages: conv.messages.filter((m) => !m.isInternalNote),
    };
  },
};
