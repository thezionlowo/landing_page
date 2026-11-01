import { signupLead, deliverSignupLead } from '../../server/signupLead';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { backendBase, publicData, readSession, sameOrigin, setSessionCookie } from '../../server/accountSession';
export default async function handler(req: IncomingMessage & { body?: any }, res: ServerResponse) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  const send = (status: number, body: unknown) => { res.statusCode = status; res.end(JSON.stringify(body)); };
  const route = new URL(req.url || '/', 'https://local').pathname.replace(/^\/api\/account\//, '').replace(/\/$/, '');
  const methods: Record<string, string> = { login: 'POST', register: 'POST', logout: 'POST', session: 'GET', licenses: 'GET', 'trial/request': 'POST', 'trial/activate': 'POST', 'change-password': 'POST', 'forgot-password': 'POST', 'reset-password': 'POST', profile: 'POST', billing: 'GET', receipt: 'GET', 'store/disconnect': 'POST' };
  if (!methods[route]) return send(404, { error: 'Unknown account operation' });
  if (req.method !== methods[route]) return send(405, { error: 'Method not allowed' });
  if (req.method !== 'GET' && !sameOrigin(req)) return send(403, { error: 'Account request origin rejected' });
  try {
    if (route === 'logout') { setSessionCookie(req, res, null); return send(200, { success: true }); }
    if ((process.env.ZAMERIA_SESSION_SECRET || '').length < 32) return send(503, { error: 'Account sessions are not configured' });
    const session = readSession(req);
    // Login/registration establish a new identity; an old cookie must not replace it.
    const publicRoutes = ['login', 'register', 'forgot-password', 'reset-password'];
    const requestSession = publicRoutes.includes(route) ? null : session;
    if (!publicRoutes.includes(route) && !session) return send(401, { error: 'Sign in to your ZAMERIA account' });
    let body: any = {};
    if (req.method === 'POST') {
      let raw = '';
      if (req.body !== undefined) raw = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
      else for await (const chunk of req) { raw += chunk; if (raw.length > 16384) return send(413, { error: 'Request too large' }); }
      if (raw.length > 16384) return send(413, { error: 'Request too large' });
      try { body = raw ? JSON.parse(raw) : {}; } catch { return send(400, { error: 'Invalid JSON' }); }
      if (!body || typeof body !== 'object' || Array.isArray(body)) return send(400, { error: 'Invalid account request' });
    }
    if (['login', 'register'].includes(route) && (typeof body.email !== 'string' || typeof body.password !== 'string' || !body.password)) return send(400, { error: 'Email and password are required' });
    if (['login', 'register'].includes(route)) {
      const allowed = route === 'login' ? ['email', 'password'] : ['email', 'password', 'full_name', 'business_name', 'phone', 'store_url', 'store_address', 'campaign'];
      body = Object.fromEntries(allowed.filter(key => typeof body[key] === 'string').map(key => [key, body[key]]));
      body.email = body.email.trim().toLowerCase();
    }
    if (route === 'register') { body.source = 'Website Signup'; body.registration_source = 'website'; }
    const upstream: Record<string, string> = {
      login: '/account/login', register: '/account/register', session: '/account/me',
      licenses: '/account/licenses', 'trial/request': '/trial/request', 'trial/activate': '/license/activate', 'change-password': '/account/change-password', 'forgot-password': '/account/forgot-password', 'reset-password': '/account/reset-password', profile: '/account/update', billing: '/account/billing', receipt: '/account/receipt', 'store/disconnect': '/account/store/disconnect',
    };
    if (route === 'trial/request') body = { business_name: body.business_name || '', store_url: body.store_url || '' };
    if (route === 'trial/activate') {
      body = { license_key: body.code || body.license_key, store_url: body.store?.url || body.store_url };
      if (!body.license_key || !body.store_url) return send(400, { error: 'Activation code and store URL are required' });
    }
    if (route === 'profile') body = { ...(typeof body.fullName==='string'?{full_name:body.fullName}:{}), ...(body.billingAddress && typeof body.billingAddress==='object'?{billingAddress:body.billingAddress}:{}), ...(typeof body.businessName === 'string' ? { business_name: body.businessName } : {}), ...(typeof body.phone === 'string' ? { phone: body.phone } : {}) };
    const query = route === 'receipt' ? `?reference=${encodeURIComponent(new URL(req.url || '/', 'https://local').searchParams.get('reference') || '')}` : '';
    const response = await fetch(`${backendBase()}${upstream[route]}${query}`, {
      method: req.method, redirect: 'error', cache: 'no-store', signal: AbortSignal.timeout(12000),
      headers: { 'Content-Type': 'application/json', ...(requestSession ? { Authorization: `Bearer ${requestSession.token}` } : {}) },
      ...(req.method === 'POST' ? { body: JSON.stringify(body) } : {}),
    });
    if (route === 'receipt' && response.ok) {
      if (!(response.headers.get('content-type') || '').includes('application/pdf')) return send(502, { error: 'Receipt service returned an invalid file' });
      const file = Buffer.from(await response.arrayBuffer());
      if (file.length > 2097152 || file.subarray(0, 5).toString() !== '%PDF-') return send(502, { error: 'Invalid receipt file' });
      res.setHeader('Content-Type', 'application/pdf'); res.setHeader('Content-Disposition', 'attachment; filename="zameria-receipt.pdf"');
      res.statusCode = 200; res.end(file); return;
    }
    let data = await response.json().catch(() => ({}));
    if (!response.ok || data.success === false) {
      // A stale rejected request must not clear a newer login's cookie. Explicit logout/password changes clear it.
      return send(response.ok ? 400 : response.status, { error: typeof data.error === 'string' ? data.error : 'Account service rejected the request' });
    }
    if (route === 'trial/activate') {
      let entitlement = data.entitlement;
      if (!entitlement) {
        const lookup = await fetch(`${backendBase()}/account/entitlement?store=${encodeURIComponent(body.store_url)}`, {
          headers: { Authorization: `Bearer ${session!.token}` }, cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(12000),
        });
        if (!lookup.ok) return send(502, { error: 'Could not confirm trial entitlement' });
        entitlement = (await lookup.json()).entitlement;
      }
      const identity = (value: string) => { const u = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`); return u.host.toLowerCase() + u.pathname.replace(/\/+$/, ''); };
      const end = entitlement?.trial?.expires_at || entitlement?.trial_end;
      const start = entitlement?.trial?.started_at || entitlement?.trial_start;
      if (entitlement?.status !== 'trial_active' || !Number.isFinite(Date.parse(start)) || !Number.isFinite(Date.parse(end)) || Date.parse(end) <= Date.now() ||
          identity(entitlement.store_url || entitlement.store_domain || '') !== identity(body.store_url)) return send(502, { error: 'Trial activation could not be confirmed' });
      data = { entitlement, account: { id: session!.accountId, trial: { startDate: start, endDate: end,
        daysRemaining: Math.max(0, Math.ceil((Date.parse(end) - Date.now()) / 86400000)), activatedStore: { name: entitlement.store_name, url: entitlement.store_url } },
        connectedStore: { name: entitlement.store_name, url: entitlement.store_url } } };
    }
    if (['login', 'register'].includes(route)) {
      if (!data.account?.id || typeof data.account?.email !== 'string' || data.account.email.toLowerCase() !== body.email.trim().toLowerCase() || typeof data.token !== 'string' || !data.token) return send(502, { error: 'Invalid account service response' });
      const lifetime = Math.min(Number(data.expires_in) || 3600, 8 * 3600);
      let pendingSignupLead;
      if (route === 'register') {
        const lead = signupLead(data.account, body);
        const captured = await deliverSignupLead(lead, data.token);
        if (!captured) pendingSignupLead = lead;
        data.lead_capture = { status: captured ? 'captured' : 'pending' };
      }
      setSessionCookie(req, res, { token: data.token, accountId: String(data.account.id), email: data.account.email, expiresAt: Date.now() + Math.max(1, lifetime) * 1000, ...(pendingSignupLead ? { pendingSignupLead } : {}) });
    } else if (route === 'session') {
      if (!data.account || String(data.account.id) !== session!.accountId) return send(502, { error: 'Invalid account session response' });
      if (session!.pendingSignupLead) {
        const captured = await deliverSignupLead(session!.pendingSignupLead, session!.token);
        data.lead_capture = { status: captured ? 'captured' : 'pending' };
        if (captured) { const { pendingSignupLead: _delivered, ...updated } = session!; setSessionCookie(req, res, updated); }
      }
    } else if (route === 'change-password' || route === 'reset-password') {
      if (data.success !== true) return send(502, { error: 'Password change was not confirmed by the account service' });
      // Force a fresh sign-in after a confirmed server-side credential change.
      setSessionCookie(req, res, null);
    }
    return send(200, { ...publicData(data), authenticated: !['change-password', 'reset-password', 'forgot-password'].includes(route) });
  } catch {
    return send(503, { error: 'ZAMERIA account service is temporarily unavailable. Please try again.' });
  }
}
