export const POLICY_PAGES = {
  '/terms': {
    title: 'Terms of Service | ZAMERIA',
    heading: 'Terms of Service',
    description: 'Terms for ZAMERIA accounts, subscriptions, the WooCommerce plugin and the POS application.',
  },
  '/refunds': { title: 'Refund Policy | ZAMERIA', heading: 'Refund Policy', description: 'Refund eligibility, billing support and what happens to your ZAMERIA licence after a refund.' },
  '/privacy': {
    title: 'Privacy Policy | ZAMERIA',
    heading: 'Privacy Policy',
    description: 'How ZAMERIA handles merchant accounts, store connections, support, payments and local POS data.',
  },
} as const;
export type PolicyPath = keyof typeof POLICY_PAGES;
