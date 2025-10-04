import { v4 as uuid } from 'uuid';
import type { ShoppingList, ShoppingListItem } from './types';

export function generateShoppingList(
  specification: Partial<ShoppingList> = {}
): ShoppingList {
  return {
    id: specification.id ?? uuid(),
    name: specification.name ?? `name-${uuid()}`,
    itemList: specification.itemList ?? [],
  };
}

export function generateShoppingListItem(
  specification: Partial<ShoppingListItem> = {}
): ShoppingListItem {
  return {
    name: specification.name ?? `name-${uuid()}`,
    checked: specification.checked ?? false,
  };
}
