import { Provider } from 'jotai';
import type { Store } from 'jotai/vanilla/store';
import { MemoryRouter } from 'react-router';

export function TestProvider({
  store,
  children,
}: {
  store?: Store;
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <MemoryRouter>{children}</MemoryRouter>
    </Provider>
  );
}