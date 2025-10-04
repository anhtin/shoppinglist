import { AddShoppingListForm } from '../../features/ShoppingListManagement/AddShoppingListForm';
import { ShoppingListListing } from '../../features/ShoppingListManagement/ShoppingListListing';

export function HomePage() {
  return (
    <main>
      <h1>Home</h1>

      <h2>Create</h2>
      <AddShoppingListForm />

      <h2>List</h2>
      <ShoppingListListing />
    </main>
  );
}
