import crypto from 'node:crypto';
import type { IncomingMessage, ServerResponse } from 'node:http';
export const COOKIE = 'zameria_account_session';
export interface AccountSession { token: string; accountId: string; email: string; expiresAt: number; pendingSignupLead?: import('./signupLead.js').SignupLead }
function key() {
  const secret = process.env.ZAMERIA_SESSION_SECRET || '';
  if (secret.length < 32) throw new Error('Account sessions are not configured');
  return crypto.createHash('sha256').update(secret).digest();
}
export function sealSession(session: AccountSession): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key(), iv);
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(session), 'utf8'), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), encrypted]).toString('base64url');
}
export function readSession(req: IncomingMessage): AccountSession | null {
  const encoded = String(req.headers.cookie || '').split(';').map(c => c.trim()).find(c => c.startsWith(`${COOKIE}=`))?.slice(COOKIE.length + 1);
  if (!encoded) return null;
  try {
    const data = Buffer.from(encoded, 'base64url');
    const decipher = crypto.createDecipheriv('aes-256-gcm', key(), data.subarray(0, 12));
    decipher.setAuthTag(data.subarray(12, 28));
    const session = JSON.parse(Buffer.concat([decipher.update(data.subarray(28)), decipher.final()]).toString('utf8'));
    return session.token && session.accountId && session.email && session.expiresAt > Date.now() ? session : null;
  } catch { return null; }
}
export function setSessionCookie(req: IncomingMessage, res: ServerResponse, session: AccountSession | null) {
  const local = /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(String(req.headers.host));
  const maxAge = session ? Math.max(0, Math.floor((session.expiresAt - Date.now()) / 1000)) : 0;
  res.setHeader('Set-Cookie', `${COOKIE}=${session ? sealSession(session) : ''}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${local ? '' : '; Secure'}`);
}
export function sameOrigin(req: IncomingMessage): boolean {
  try {
    const host = String(req.headers.host);
    const local = /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(host);
    const expected = process.env.ZAMERIA_SITE_ORIGIN || `${local ? 'http' : 'https'}://${host}`;
    return new URL(String(req.headers.origin)).origin === new URL(expected).origin;
  } catch { return false; }
}
export function publicData(value: any): any {
  if (Array.isArray(value)) return value.map(publicData);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value)
    .filter(([name]) => !/password|^(token|access_token|refresh_token|accessToken|refreshToken|authorization|secret)$/i.test(name))
    .map(([name, data]) => [name, publicData(data)]));
  return value;
}
export function backendBase(): string {
  const base = (process.env.ZAMERIA_BACKEND_URL || 'https://scoreflip-go-hwsgspeycq-uc.a.run.app/api/v1/zameria').replace(/\/$/, '');
  const parsed = new URL(base);
  if (parsed.protocol !== 'https:' && !['localhost', '127.0.0.1'].includes(parsed.hostname)) throw new Error('Backend requires HTTPS');
  return base;
}
