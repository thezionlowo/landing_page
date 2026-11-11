import { BillingTab } from './BillingTab';
interface LicensesTabProps { onOpenOrderDetails?: (orderId: string) => void; }
/** Compatibility entry point: all subscription management uses Plan & billing. */
export function LicensesTab(_props: LicensesTabProps) { return <BillingTab />; }
