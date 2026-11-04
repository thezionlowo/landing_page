import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type AccountTab =
  | 'overview'
  | 'store'
  | 'billing'
  | 'devices'
  | 'team'
  | 'settings'
  | 'orders'
  | 'licenses'
  | 'plan'
  | 'billing-address'
  | 'payment-methods';

const VALID_TABS: AccountTab[] = [
  'overview',
  'store',
  'billing',
  'devices',
  'team',
  'settings',
  'orders',
  'licenses',
  'plan',
  'billing-address',
  'payment-methods',
];

const normalizeTab = (raw: string | null): AccountTab => {
  if (!raw) return 'overview';
  const clean = raw.toLowerCase().trim();
  if (clean === 'license' || clean === 'licenses' || clean === 'plan' || clean === 'orders' || clean === 'billing-address' || clean === 'payment-methods') return 'billing';
  if (clean === 'store' || clean === 'connected-store') return 'store';
  if (clean === 'hardware' || clean === 'registers' || clean === 'device' || clean === 'devices') return 'devices';
  if (clean === 'staff' || clean === 'team') return 'team';
  if (clean === 'account' || clean === 'profile' || clean === 'security' || clean === 'settings') return 'settings';
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

export const RouterProvider: React.FC<{ children: React.ReactNode; initialPath?: string; initialSearch?: string }> = ({
  children,
  initialPath,
  initialSearch,
}) => {
  const [path, setPath] = useState<string>(() => {
    if (initialPath) return initialPath;
    if (typeof window !== 'undefined') {
      return window.location.pathname || '/';
    }
    return '/';
  });

  const [search, setSearch] = useState<string>(() => {
    if (initialSearch) return initialSearch;
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

  // Deep links can arrive before React has mounted the target section.
  useEffect(() => {
    if (!window.location.hash) return;
    let observer: MutationObserver | undefined;
    const reveal = () => {
      let id: string;
      try { id = decodeURIComponent(window.location.hash.slice(1)); } catch { return false; }
      const element = document.getElementById(id);
      if (!element) return false;
      element.scrollIntoView({ behavior: 'instant' });
      observer?.disconnect();
      return true;
    };
    const frame = requestAnimationFrame(() => {
      if (!reveal()) { observer = new MutationObserver(reveal); observer.observe(document.getElementById('root') || document.body, { childList: true, subtree: true }); }
    });
    const timeout = window.setTimeout(() => observer?.disconnect(), 10000);
    return () => { cancelAnimationFrame(frame); clearTimeout(timeout); observer?.disconnect(); };
  }, [path]);

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

    const destination = new URL(to, window.location.origin);
    window.history.pushState(null, '', destination.pathname + destination.search + destination.hash);
    setPath(destination.pathname);
    setSearch(destination.search);
    setActiveTab(normalizeTab(destination.searchParams.get('tab')));
    if (!destination.hash) window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Global click interceptor for internal links (href="/login", href="/get-started", etc.)
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      // Don't intercept if modifier key was pressed
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.defaultPrevented) return;

      const target = e.target as HTMLElement | null;
      const anchor = target?.closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href) return;

      // Only handle internal routing paths
      const isInternalPath =
        href.startsWith('/') &&
        !href.startsWith('//') &&
        !href.startsWith('/#') &&
        !href.startsWith('mailto:') &&
        !href.startsWith('tel:') &&
        !anchor.hasAttribute('download');

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
