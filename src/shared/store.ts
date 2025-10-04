import { useStore } from 'jotai';
import type { Store } from 'jotai/vanilla/store';

export function createStoreActionHook<P extends any[], R>(
  action: (store: Store, ...args: P) => R
): () => (...args: P) => R {
  return () => {
    const store = useStore();
    return (...args: P) => action(store, ...args);
  };
}
