import type { IncomingMessage, ServerResponse } from 'http';
import crypto from 'crypto';
import { backendBase } from '../../server/accountSession';

// Paystack signs the raw body. Disable framework parsing before signature verification.
export const config = { api: { bodyParser: false } };

interface PaystackWebhookBody {
  event: string;
  data: {
    id: number;
    reference: string;
    amount: number;
    currency?: string;
    status: string;
    customer: {
      email: string;
      customer_code?: string;
    };
    metadata?: {
      currency?: string;
      accountId?: string;
      account_id?: string;
      plan?: 'Starter' | 'Business';
      billingCycle?: 'yearly' | 'monthly';
    };
    paid_at?: string;
    channel?: string;
  };
}

/**
 * Serverless / Node.js handler for Paystack Webhook
 * Route: POST /api/webhook/paystack
 */
export default async function handler(req: IncomingMessage & { body?: any }, res: ServerResponse) {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Method Not Allowed' }));
    return;
  }

  // 1. Read Raw Request Body for HMAC SHA-512 Verification
  const chunks: Buffer[] = [];
  let length = 0;
  for await (const chunk of req) {
    const buffer = typeof chunk === 'string' ? Buffer.from(chunk) : chunk;
    length += buffer.length;
    if (length > 1048576) { res.statusCode = 413; res.end(); return; }
    chunks.push(buffer);
  }
  const rawBody = Buffer.concat(chunks).toString('utf8');

  // 2. Verify Paystack Signature
  const secretKey = process.env.PAYSTACK_SECRET_KEY || '';
  const paystackSignature = (req.headers['x-paystack-signature'] as string) || '';

  if (!secretKey) {
    res.statusCode = 503;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Payment webhook is not configured' }));
    return;
  }
  const expectedSignature = crypto.createHmac('sha512', secretKey).update(rawBody).digest();
  if (!/^[a-f0-9]{128}$/i.test(paystackSignature) ||
      !crypto.timingSafeEqual(expectedSignature, Buffer.from(paystackSignature, 'hex'))) {
    res.statusCode = 401;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Invalid Paystack signature' }));
    return;
  }

  let eventData: PaystackWebhookBody;
  try {
    eventData = JSON.parse(rawBody);
  } catch (err) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
    return;
  }

  // 3. Process Only Successful Charges
  if (!eventData || typeof eventData !== 'object') {
    res.statusCode = 400; res.end(JSON.stringify({ error: 'Invalid event' })); return;
  }
  if (eventData.event !== 'charge.success') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ received: true, ignored_event: eventData.event }));
    return;
  }

  if (!eventData.data || typeof eventData.data.reference !== 'string' || !eventData.data.reference.trim() ||
      !Number.isSafeInteger(eventData.data.amount) || eventData.data.amount <= 0 ||
      eventData.data.status !== 'success' || !eventData.data.customer?.email ||
      (eventData.data.paid_at && !Number.isFinite(Date.parse(eventData.data.paid_at)))) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Invalid successful charge payload' }));
    return;
  }

  const { reference } = eventData.data;

  // Licence issuance and replay protection belong to the central checkout service.
  // Every delivery (including retries after a cold start) resolves the same reference.
  // Never acknowledge a payment while its backend confirmation is unavailable.
  try {
    const response = await fetch(`${backendBase()}/checkout/verify?reference=${encodeURIComponent(reference)}`, {
      headers: { 'Accept': 'application/json' }, cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(15000),
    });
    const verified = await response.json().catch(() => ({}));
    const returnedReference = verified.payment_reference || verified.reference;
    if (!response.ok || typeof verified.license_key !== 'string' || !verified.license_key.trim() || !Number.isFinite(Date.parse(verified.expires_at)) ||
        (returnedReference && returnedReference !== reference)) {
      res.statusCode = 503;
      res.end(JSON.stringify({ error: 'Payment confirmation is pending. Retry this event.' }));
      return;
    }
    res.statusCode = 200;
    res.end(JSON.stringify({ received: true, status: 'confirmed', reference }));
  } catch {
    res.statusCode = 503;
    res.end(JSON.stringify({ error: 'Payment confirmation is unavailable. Retry this event.' }));
  }
}
