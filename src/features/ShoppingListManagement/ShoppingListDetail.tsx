import type { ShoppingListId } from './types';
import { useShoppingList } from './store';
import { AddShoppingListItemForm } from './AddShoppingListItemForm';

type ShoppingListDetailProps = {
  shoppingListId: ShoppingListId;
};

export function ShoppingListDetail({ shoppingListId }: ShoppingListDetailProps) {
  const shoppingList = useShoppingList(shoppingListId);

  if (!shoppingList) {
    return <div>Shopping list not found.</div>;
  }

  return (
    <>
      <h1>{shoppingList.name}</h1>
      {shoppingList.itemList.length === 0 ? (
        <p>No items in shopping list.</p>
      ) : (
        <ul>
          {shoppingList.itemList.map((item, index) => (
            <li key={index}>
              <span
                style={{
                  textDecoration: item.checked ? 'line-through' : 'none',
                }}
              >
                {item.name}
              </span>
            </li>
          ))}
        </ul>
      )}
      <AddShoppingListItemForm shoppingListId={shoppingList.id} />
    </>
  );
}
