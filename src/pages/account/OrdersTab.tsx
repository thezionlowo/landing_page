import { BillingTab } from './BillingTab';
interface OrdersTabProps {
  initialSelectedOrderId?: string | null;
  targetOrderId?: string | null;
  onClearTargetOrder?: () => void;
  onViewLicense?: (licenseId: string) => void;
}
/** Compatibility entry point: receipts remain available in Plan & billing. */
export function OrdersTab(_props: OrdersTabProps) { return <BillingTab />; }
