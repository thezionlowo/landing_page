import React from 'react';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { useRouter } from '../../router/Router';
import { useGeoPricing } from '../../services/geoPricingService';
import { checkoutPricing, planCheckoutUrl } from '../../lib/checkoutPricing';
import { PlanComparisonDialog } from '../../components/PlanComparison';

interface AddLicenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPlan?: string;
  onSuccessNavigate?: () => void;
}

export const AddLicenseModal: React.FC<AddLicenseModalProps> = ({ isOpen, onClose, initialPlan }) => {
  const { customer } = useCustomerAuth();
  const { navigate } = useRouter();
  const { geo } = useGeoPricing();
  if (!customer) return null;
  const pricing = checkoutPricing(customer, null, null, geo);
  return <PlanComparisonDialog open={isOpen} pricing={pricing}
    selectedPlan={initialPlan?.toLowerCase() === 'starter' ? 'starter' : initialPlan?.toLowerCase() === 'business' ? 'business' : undefined}
    onClose={onClose} onSelect={plan => { onClose(); navigate(planCheckoutUrl(plan, pricing)); }} />;
};
