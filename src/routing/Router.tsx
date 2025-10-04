import { createBrowserRouter, RouterProvider } from 'react-router';
import { HomePage } from './pages/HomePage';
import { ShoppingListDetailPage } from './pages/ShoppingListPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/shopping-list/:id',
    element: <ShoppingListDetailPage />,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
