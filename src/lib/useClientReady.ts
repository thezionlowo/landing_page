import { useSyncExternalStore } from 'react';
const subscribe = () => () => {};
const client = () => true;
const server = () => false;
/** Match prerendered HTML before reading browser-only preferences or hints. */
export function useClientReady() { return useSyncExternalStore(subscribe, client, server); }
