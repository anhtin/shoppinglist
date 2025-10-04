import { Link } from 'react-router';
import type { ShoppingList } from './types';
import { useShoppingListContainer } from './store';

export function ShoppingListListing() {
  const shoppingListContainer = useShoppingListContainer();
  const shoppingListList = Object.values(shoppingListContainer);

  if (shoppingListList.length === 0) {
    return <p>No shopping lists.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {shoppingListList.map((shoppingList) => (
          <tr key={shoppingList.id}>
            <td>
              <Link to={`/shopping-list/${shoppingList.id}`}>
                {shoppingList.name}
              </Link>
            </td>
            <td>{status(shoppingList)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function status(shoppingList: ShoppingList): string {
  return `${checkedItemCount(shoppingList)} / ${shoppingList.itemList.length}`;
}

function checkedItemCount(shoppingList: ShoppingList): number {
  return shoppingList.itemList.reduce(
    (acc, item) => acc + (item.checked ? 1 : 0),
    0
  );
}
