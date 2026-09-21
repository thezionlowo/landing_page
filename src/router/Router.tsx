import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type AccountTab =
  | 'overview'
  | 'orders'
  | 'licenses'
  | 'plan'
  | 'billing'
  | 'billing-address'
  | 'payment-methods'
  | 'settings'
  | 'store';

const VALID_TABS: AccountTab[] = [
  'overview',
  'orders',
  'licenses',
  'plan',
  'billing',
  'billing-address',
  'payment-methods',
  'settings',
  'store',
];

const normalizeTab = (raw: string | null): AccountTab => {
  if (!raw) return 'overview';
  const clean = raw.toLowerCase().trim();
  if (clean === 'license') return 'licenses';
  if (clean === 'store' || clean === 'connected-store') return 'store';
  if (VALID_TABS.includes(clean as AccountTab)) {
    return clean as AccountTab;
  }
  return 'overview';
};

interface RouterContextType {
  path: string;
  search: string;
  activeTab: AccountTab;
  navigate: (to: string) => void;
  setAccountTab: (tab: AccountTab) => void;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [path, setPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname || '/';
    }
    return '/';
  });

  const [search, setSearch] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.search || '';
    }
    return '';
  });

  const [activeTab, setActiveTab] = useState<AccountTab>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return normalizeTab(params.get('tab'));
    }
    return 'overview';
  });

  const handleLocationChange = useCallback(() => {
    const newPath = window.location.pathname || '/';
    const newSearch = window.location.search || '';
    setPath(newPath);
    setSearch(newSearch);

    const params = new URLSearchParams(newSearch);
    setActiveTab(normalizeTab(params.get('tab')));
  }, []);

  useEffect(() => {
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, [handleLocationChange]);

  const navigate = useCallback((to: string) => {
    if (typeof window === 'undefined') return;

    // Check if target is an on-page anchor (e.g. #pricing)
    if (to.startsWith('#')) {
      const element = document.getElementById(to.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        window.history.pushState(null, '', to);
        return;
      }
    }

    // Normal path navigation
    window.history.pushState(null, '', to);
    const [newPath, newQuery] = to.split('?');
    setPath(newPath || '/');
    setSearch(newQuery ? `?${newQuery}` : '');

    if (newQuery) {
      const params = new URLSearchParams(newQuery);
      setActiveTab(normalizeTab(params.get('tab')));
    } else if (newPath === '/account') {
      setActiveTab('overview');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Global click interceptor for internal links (href="/login", href="/get-started", etc.)
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      // Don't intercept if modifier key was pressed
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.defaultPrevented) return;

      const target = e.target as HTMLElement | null;
      const anchor = target?.closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href) return;

      // Only handle internal routing paths
      const isInternalPath =
        href.startsWith('/login') ||
        href.startsWith('/get-started') ||
        href.startsWith('/start-trial') ||
        href.startsWith('/subscribe') ||
        href.startsWith('/payment/complete') ||
        href.startsWith('/forgot-password') ||
        href.startsWith('/account') ||
        href === '/';

      if (isInternalPath && !anchor.hasAttribute('target')) {
        e.preventDefault();
        navigate(href);
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, [navigate]);

  const setAccountTab = useCallback(
    (tab: AccountTab) => {
      setActiveTab(tab);
      const newUrl = `/account?tab=${tab}`;
      window.history.pushState(null, '', newUrl);
      setPath('/account');
      setSearch(`?tab=${tab}`);
    },
    []
  );

  return (
    <RouterContext.Provider value={{ path, search, activeTab, navigate, setAccountTab }}>
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = () => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
};
