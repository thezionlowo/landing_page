import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Headphones,
  CheckCircle2,
  User,
  Mail,
  Phone
} from 'lucide-react';
import {
  supportChatClient,
  SupportConversation
} from '../services/supportChatClient';
import { useCustomerAuth } from '../context/CustomerAuthContext';

export const ZameriaSupportChatWidget: React.FC = () => {
  const { customer } = useCustomerAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [conversation, setConversation] = useState<SupportConversation | null>(null);

  // Form fields for first-time website visitors
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [initialMessage, setInitialMessage] = useState('');

  // Active chat stream composer
  const [messageText, setMessageText] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check for existing conversation ID or customer session
  const checkExisting = () => {
    const convId = supportChatClient.getStoredVisitorConversationId();
    if (convId) {
      const existing = supportChatClient.getConversation(convId);
      if (existing) {
        setConversation(existing);
        setUnreadCount(existing.unreadByCustomer || 0);
        return;
      }
    }

    if (customer) {
      setName(customer.fullName || customer.businessName);
      setEmail(customer.email);
      setPhone(customer.phone || '');
    }
  };

  useEffect(() => {
    checkExisting();
  }, [customer]);

  useEffect(() => {
    const handleUpdate = () => {
      const convId = conversation?.id || supportChatClient.getStoredVisitorConversationId();
      if (convId) {
        const updated = supportChatClient.getConversation(convId);
        if (updated) {
          setConversation(updated);
          setUnreadCount(updated.unreadByCustomer || 0);
        }
      }
    };

    window.addEventListener('zameria_support_update', handleUpdate);

    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel('zameria_support_chat');
      bc.onmessage = () => {
        handleUpdate();
      };
    } catch {}

    return () => {
      window.removeEventListener('zameria_support_update', handleUpdate);
      if (bc) bc.close();
    };
  }, [conversation?.id]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      if (conversation) {
        supportChatClient.markAsReadByCustomer(conversation.id);
        setUnreadCount(0);
      }
    }
  }, [isOpen, conversation?.messages.length]);

  const handleStartConversation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !initialMessage.trim()) return;

    const newConv = supportChatClient.createVisitorConversation({
      customerName: name.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      initialMessage: initialMessage.trim(),
    });

    setConversation(newConv);
    setInitialMessage('');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !conversation) return;

    const updated = supportChatClient.sendMessage(
      conversation.id,
      messageText.trim(),
      name || conversation.customerName
    );

    if (updated) {
      setConversation(updated);
    }
    setMessageText('');
  };

  const handleResolve = () => {
    if (!conversation) return;
    supportChatClient.resolveConversation(conversation.id);
    const updated = supportChatClient.getConversation(conversation.id);
    if (updated) setConversation(updated);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            if (conversation) {
              supportChatClient.markAsReadByCustomer(conversation.id);
              setUnreadCount(0);
            }
          }}
          aria-label="Contact ZAMERIA Support"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#071a31',
            color: '#ffffff',
            border: '1px solid rgba(255,255,255,0.18)',
            borderRadius: '28px',
            padding: '11px 20px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(7, 26, 49, 0.35)',
            transition: 'all 0.2s ease',
          }}
        >
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Headphones size={18} />
            {unreadCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-6px',
                  background: '#ef4444',
                  color: '#fff',
                  fontSize: '10px',
                  fontWeight: 700,
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {unreadCount}
              </span>
            )}
          </div>
          <span>Support Chat</span>
        </button>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '380px',
            maxWidth: 'calc(100vw - 32px)',
            height: '520px',
            maxHeight: 'calc(100vh - 48px)',
            background: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.22)',
            border: '1px solid #e2e8f0',
            zIndex: 10000,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              background: '#071a31',
              color: '#ffffff',
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Headphones size={18} />
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  ZAMERIA Support
                  <span
                    style={{
                      fontSize: '10px',
                      background: 'rgba(34, 197, 94, 0.2)',
                      color: '#4ade80',
                      padding: '1px 6px',
                      borderRadius: '8px',
                      fontWeight: 600,
                    }}
                  >
                    Online
                  </span>
                </div>
                <div style={{ fontSize: '11px', opacity: 0.8 }}>
                  {conversation ? 'Live conversation' : 'Direct product & support team'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {conversation && (
                conversation.status === 'Resolved' ? (
                  <span
                    style={{
                      fontSize: '11px',
                      background: 'rgba(16, 185, 129, 0.2)',
                      color: '#6ee7b7',
                      padding: '2px 8px',
                      borderRadius: '10px',
                    }}
                  >
                    Resolved
                  </span>
                ) : (
                  <button
                    onClick={handleResolve}
                    title="Mark as resolved"
                    style={{
                      background: 'transparent',
                      border: '1px solid rgba(255, 255, 255, 0.25)',
                      color: '#e2e8f0',
                      fontSize: '11px',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                    }}
                  >
                    Resolve
                  </button>
                )
              )}

              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#ffffff',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                }}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Conversation Stream OR Initial Visitor Inquiry Form */}
          {conversation ? (
            <>
              {/* Context Banner */}
              <div
                style={{
                  padding: '8px 14px',
                  background: '#f8fafc',
                  borderBottom: '1px solid #e2e8f0',
                  fontSize: '11px',
                  color: '#64748b',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span>
                  Contact: <strong style={{ color: '#0f172a' }}>{conversation.customerName}</strong>
                </span>
                <span style={{ color: conversation.status === 'Resolved' ? '#10b981' : '#2563eb', fontWeight: 600 }}>
                  Status: {conversation.status}
                </span>
              </div>

              {/* Messages Stream */}
              <div
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: '14px',
                  background: '#f1f5f9',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                {conversation.messages.map((msg) => {
                  const isCustomer = msg.senderType === 'customer';
                  return (
                    <div
                      key={msg.id}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: isCustomer ? 'flex-end' : 'flex-start',
                        gap: '2px',
                      }}
                    >
                      <span style={{ fontSize: '10px', color: '#94a3b8', margin: '0 4px' }}>
                        {isCustomer ? 'You' : msg.senderName || 'ZAMERIA Support'} •{' '}
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <div
                        style={{
                          maxWidth: '82%',
                          padding: '9px 13px',
                          borderRadius: isCustomer ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                          background: isCustomer ? '#071a31' : '#ffffff',
                          color: isCustomer ? '#ffffff' : '#0f172a',
                          border: isCustomer ? 'none' : '1px solid #cbd5e1',
                          fontSize: '13px',
                          lineHeight: '1.4',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                          wordBreak: 'break-word',
                          whiteSpace: 'pre-wrap',
                        }}
                      >
                        {msg.message}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Compose Form */}
              <form
                onSubmit={handleSendMessage}
                style={{
                  padding: '10px',
                  borderTop: '1px solid #e2e8f0',
                  background: '#ffffff',
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'center',
                }}
              >
                <input
                  type="text"
                  placeholder={
                    conversation.status === 'Resolved'
                      ? 'Type to reopen conversation...'
                      : 'Type your message...'
                  }
                  style={{
                    flex: 1,
                    border: '1px solid #cbd5e1',
                    borderRadius: '20px',
                    padding: '8px 14px',
                    fontSize: '13px',
                    outline: 'none',
                  }}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={!messageText.trim()}
                  style={{
                    background: '#071a31',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: messageText.trim() ? 'pointer' : 'default',
                    opacity: messageText.trim() ? 1 : 0.5,
                  }}
                >
                  <Send size={15} />
                </button>
              </form>
            </>
          ) : (
            /* First-Time Visitor Minimal Intake Form */
            <form
              onSubmit={handleStartConversation}
              style={{
                flex: 1,
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                overflowY: 'auto',
                background: '#ffffff',
              }}
            >
              <div style={{ fontSize: '13px', color: '#475569', lineHeight: 1.4, marginBottom: '2px' }}>
                👋 Have a question about ZAMERIA POS, WooCommerce integration, or pricing? Chat with us directly:
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Your Name *
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }} />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Samuel Okafor"
                    style={{
                      width: '100%',
                      padding: '8px 10px 8px 32px',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      fontSize: '13px',
                      boxSizing: 'border-box',
                    }}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Email Address *
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }} />
                  <input
                    type="email"
                    required
                    placeholder="e.g. samuel@business.ng"
                    style={{
                      width: '100%',
                      padding: '8px 10px 8px 32px',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      fontSize: '13px',
                      boxSizing: 'border-box',
                    }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Phone Number (Optional)
                </label>
                <div style={{ position: 'relative' }}>
                  <Phone size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }} />
                  <input
                    type="tel"
                    placeholder="e.g. +234 803 000 0000"
                    style={{
                      width: '100%',
                      padding: '8px 10px 8px 32px',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      fontSize: '13px',
                      boxSizing: 'border-box',
                    }}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  How can we help? *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Ask any question about setup, compatibility, or features..."
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    fontSize: '13px',
                    resize: 'none',
                    boxSizing: 'border-box',
                  }}
                  value={initialMessage}
                  onChange={(e) => setInitialMessage(e.target.value)}
                />
              </div>

              <button
                type="submit"
                style={{
                  marginTop: 'auto',
                  background: '#071a31',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <Send size={14} /> Start Chat
              </button>
            </form>
          )}
        </div>
      )}
    </>
  );
};
