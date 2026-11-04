/** Account profiles are display caches, never credentials or proof of sign-in. */
export function withoutCredentials<T>(value: T): T {
  if (Array.isArray(value)) return value.map(withoutCredentials) as T;
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value)
    .filter(([key]) => !/password|^(token|access_token|refresh_token|accessToken|refreshToken|authorization|secret)$/i.test(key))
    .map(([key, data]) => [key, withoutCredentials(data)])) as T;
  return value;
}
export function migrateAccountCaches(): void {
  if (typeof localStorage === 'undefined') return;
  for (const key of ['zameria_customer_session', 'zameria_customer_session_v2', 'zameria_customer_session_v3', 'zameria_registered_customers_v2', 'zameria_registered_customers_v3']) {
    try {
      const raw = localStorage.getItem(key);
      if (raw) localStorage.setItem(key, JSON.stringify(withoutCredentials(JSON.parse(raw))));
    } catch { localStorage.removeItem(key); }
  }
}
export async function accountRequest(route: string, body?: unknown): Promise<any> {
  const response = await fetch(`/api/account/${route}`, { method: body === undefined ? 'GET' : 'POST', credentials: 'same-origin', cache: 'no-store',
    headers: { 'Content-Type': 'application/json' }, ...(body !== undefined ? { body: JSON.stringify(body) } : {}) });
  let data: any;
  try { data = await response.json(); }
  catch { throw Object.assign(new Error('The account service returned an invalid response. Please try again.'), { status: response.status }); }
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw Object.assign(new Error('The account service returned an invalid response. Please try again.'), { status: response.status });
  }
  if (!response.ok) throw Object.assign(new Error(typeof data.error === 'string' ? data.error : 'Account request failed'), { status: response.status });
  return data;
}
