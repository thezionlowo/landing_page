export interface StoreConfirmation { url: string; name: string; connectedAt: string | null }
export function confirmedStore(account: any): StoreConfirmation | null {
  const license = Array.isArray(account?.licenses) ? account.licenses.find((item: any) => item.store_domain || item.connectedDomain) : null;
  const raw = license?.store_domain || license?.connectedDomain || account?.trial?.activatedStore?.url ||
    (account?.connectedStore?.status === 'connected' ? account.connectedStore.url : '');
  if (typeof raw !== 'string' || !raw) return null;
  try {
    const url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
    if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) return null;
    return { url: url.href.replace(/\/$/, ''), name: account.connectedStore?.name || account.trial?.activatedStore?.name || url.hostname,
      connectedAt: license?.activated_at || license?.activatedAt || account.connectedStore?.connectedAt || null };
  } catch { return null; }
}
