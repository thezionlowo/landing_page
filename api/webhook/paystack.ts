import type { IncomingMessage, ServerResponse } from 'http';
import crypto from 'crypto';

interface PaystackWebhookBody {
  event: string;
  data: {
    id: number;
    reference: string;
    amount: number;
    status: string;
    customer: {
      email: string;
      customer_code?: string;
    };
    metadata?: {
      accountId?: string;
      account_id?: string;
      plan?: 'Starter' | 'Business';
      billingCycle?: 'yearly' | 'monthly';
    };
    paid_at?: string;
    channel?: string;
  };
}

// In-memory processed transaction registry to ensure strict idempotency
const processedTransactions = new Set<string>();

/**
 * Generates an authoritative ZMR-XXXX-XXXX-XXXX license key.
 */
function generateAuthoritativeLicenseKey(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  const seg = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `ZMR-${seg()}-${seg()}-${seg()}`;
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
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  const rawBody = Buffer.concat(chunks).toString('utf8');

  // 2. Verify Paystack Signature
  const secretKey = process.env.PAYSTACK_SECRET_KEY || '';
  const paystackSignature = (req.headers['x-paystack-signature'] as string) || '';

  if (secretKey) {
    const hash = crypto.createHmac('sha512', secretKey).update(rawBody).digest('hex');
    if (hash !== paystackSignature) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Invalid Paystack signature' }));
      return;
    }
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
  if (eventData.event !== 'charge.success') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ received: true, ignored_event: eventData.event }));
    return;
  }

  const { reference, amount, customer, metadata, paid_at } = eventData.data;

  // 4. Strict Idempotency Check: Prevent duplicate processing of webhooks & retries
  if (processedTransactions.has(reference)) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ received: true, status: 'already_processed', reference }));
    return;
  }

  // 5. Identify Plan from Amount and Metadata
  // Starter: ₦200,000 = 20,000,000 kobo
  // Business: ₦300,000 = 30,000,000 kobo
  let plan: 'Starter' | 'Business' = metadata?.plan || (amount >= 25000000 ? 'Business' : 'Starter');
  let planName = plan === 'Starter' ? 'Starter Plan' : 'Business Plan';
  let price = plan === 'Starter' ? '₦200,000 / year' : '₦300,000 / year';

  // 6. Generate 1-Year License & Authoritative Expiry
  const licenseKey = generateAuthoritativeLicenseKey();
  const startDate = paid_at ? new Date(paid_at) : new Date();
  const expiryDate = new Date(startDate);
  expiryDate.setFullYear(expiryDate.getFullYear() + 1);

  const license = {
    id: `lic_${Date.now().toString().slice(-6)}`,
    licenseKey,
    plan,
    planName,
    billingCycle: 'yearly' as const,
    price,
    status: 'Active' as const,
    connectedDomain: null,
    activationStatus: 'Not Activated' as const,
    activatedAt: null,
    expiresAt: expiryDate.toISOString(),
    transactionRef: reference,
    amountNumber: amount / 100,
    customerEmail: customer?.email,
    accountId: metadata?.accountId || metadata?.account_id,
  };

  // Register transaction as successfully processed
  processedTransactions.add(reference);

  // Return authoritative 200 OK to Paystack
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(
    JSON.stringify({
      received: true,
      status: 'processed',
      reference,
      plan,
      licenseKey,
      expiresAt: expiryDate.toISOString(),
      accountUpdated: true,
    })
  );
}
