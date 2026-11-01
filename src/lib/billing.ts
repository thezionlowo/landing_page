import type { OrderItem } from '../context/CustomerAuthContext';
export function mapBilling(records: any[]): OrderItem[] {
  return records.map(record => {
    const amount = Number(record.amount_minor) / 100;
    const currency = record.currency === 'USD' ? 'USD' : 'NGN';
    const total = new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
    return { id: record.reference, orderNumber: record.reference, date: record.paid_at, status: 'Completed',
      plan: record.plan === 'starter' ? 'Starter Plan' : 'Business Plan', total, amountNumber: amount, currency,
      currencySymbol: currency === 'USD' ? '$' : '₦', invoiceNumber: record.invoice_number,
      transactionRef: record.reference, licenseId: record.license_id, licenseKey: '', licenseStatus: 'Active',
      connectedDomain: null, paymentMethod: 'Paystack', billingName: '', billingEmail: '', items: ['ZAMERIA annual subscription'] } as OrderItem;
  });
}
export async function downloadReceipt(reference: string): Promise<void> {
  const response = await fetch(`/api/account/receipt?reference=${encodeURIComponent(reference)}`, { credentials: 'same-origin', cache: 'no-store' });
  if (!response.ok) { const data = await response.json().catch(() => ({})); throw new Error(data.error || 'Could not download receipt'); }
  if (!(response.headers.get('content-type') || '').includes('application/pdf')) throw new Error('Receipt service did not return a PDF');
  const blob = await response.blob();
  if (await blob.slice(0, 5).text() !== '%PDF-') throw new Error('Invalid receipt file');
  const url = URL.createObjectURL(blob); const link = document.createElement('a');
  link.href = url; link.download = `zameria-${reference.replace(/[^a-zA-Z0-9_-]/g, '')}.pdf`;
  document.body.appendChild(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}
