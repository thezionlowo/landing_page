// A hint prefills forms only. Authentication and licence ownership always come
// from the server's account session and verified payment records.
const key = 'zameria_checkout_account';
export function rememberCheckoutAccount(reference: string, email?: string, businessName?: string) {
  try { sessionStorage.setItem(key, JSON.stringify({ reference, email: email || '', businessName: businessName || '' })); } catch {}
}
export function checkoutAccountHint(search: string): { email?: string; businessName?: string } {
  const next = authDestination(search);
  const reference = new URL(next, 'https://local').searchParams.get('reference');
  if (!reference) return {};
  try { const hint = JSON.parse(sessionStorage.getItem(key) || '{}'); return hint.reference === reference ? hint : {}; } catch { return {}; }
}
export function authDestination(search: string): string {
  const next = new URLSearchParams(search).get('next') || '/account';
  try {
    const url = new URL(next, 'https://local');
    if (url.origin === 'https://local' && ['/account', '/payment/complete', '/subscribe'].includes(url.pathname)) return url.pathname + url.search;
  } catch {}
  return '/account';
}
export function authSwitchURL(path: '/login' | '/get-started', search: string): string {
  const next = authDestination(search);
  return next === '/account' ? path : `${path}?next=${encodeURIComponent(next)}`;
}
