// Centralized Route Configuration for ZAMERIA Website & Ecosystem

export const getPosAppUrl = (path: string = ''): string => {
  // Support explicit POS application URL if configured (e.g., in dev or cross-domain setup)
  const customAppUrl = (import.meta as any).env?.VITE_POS_URL;
  if (customAppUrl) {
    return `${customAppUrl.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`;
  }

  // In local development, POS is served on port 5176
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return `http://localhost:5176${path.startsWith('/') ? path : `/${path}`}`;
  }

  // The public site has no merchant/store context. It therefore opens the
  // deployed POS application; the WordPress plugin itself uses its own /pos/.
  const suffix = path.startsWith('/') ? path : `/${path}`;
  return `https://pos.zameria.co${suffix}`;
};

export const getPluginDashboardUrl = (path: string = ''): string => {
  const customPluginUrl = (import.meta as any).env?.VITE_PLUGIN_URL;
  if (customPluginUrl) {
    return `${customPluginUrl.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`;
  }

  // In local development, WooCommerce Plugin Dashboard is served on port 5182
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return `http://localhost:5182${path.startsWith('/') ? path : `/${path}`}`;
  }

  return 'https://zameria.co/plugin';
};

export const ROUTES = {
  // Website Customer Authentication & Account Routes
  login: '/login',
  getStarted: '/get-started',
  forgotPassword: '/forgot-password',
  account: '/account',
  accountTab: (tab: string) => `/account?tab=${tab}`,

  // ZAMERIA Point of Sale Application (Separate Application on port 5176)
  get pointOfSale(): string {
    return getPosAppUrl('/login?redirect=/dashboard');
  },
  get pos(): string {
    return getPosAppUrl('/login?redirect=/dashboard');
  },

  // ZAMERIA WooCommerce Plugin Dashboard (on port 5182)
  get pluginDashboard(): string {
    return getPluginDashboardUrl();
  },

  // Legacy aliases
  get trial(): string {
    return '/get-started';
  },
  get businessTrial(): string {
    return '/get-started?plan=business';
  },
};

/**
 * Smooth scrolling helper for on-page navigation anchors
 */
export const scrollToSection = (sectionId: string) => (e?: React.MouseEvent) => {
  if (e) e.preventDefault();
  if (typeof window === 'undefined') return;

  // If not on home page, navigate to /#sectionId
  if (window.location.pathname !== '/') {
    window.location.href = `/#${sectionId}`;
    return;
  }

  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (window.history && window.history.pushState) {
      window.history.pushState(null, '', `#${sectionId}`);
    }
  }
};
