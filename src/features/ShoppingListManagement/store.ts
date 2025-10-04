import { atom, useAtomValue, useStore } from 'jotai';
import type { Store } from 'jotai/vanilla/store';
import type { ShoppingList, ShoppingListId, ShoppingListItem } from './types';
import { createStoreActionHook } from '../../shared/store';

export type ShoppingListContainer = Record<ShoppingListId, ShoppingList>;

const shoppingListContainerAtom = atom<ShoppingListContainer>({});

export function useShoppingListContainer(): ShoppingListContainer {
  const store = useStore();
  return useAtomValue(shoppingListContainerAtom, { store });
}

export function useShoppingList(id: ShoppingListId): ShoppingList | undefined {
  const container = useShoppingListContainer();
  return container[id];
}

export const useAddShoppingList = createStoreActionHook(addShoppingList);
export const useAddShoppingListItem =
  createStoreActionHook(addShoppingListItem);

export function addShoppingList(store: Store, shoppingList: ShoppingList) {
  store.set(shoppingListContainerAtom, (container) => {
    if (shoppingList.id in container)
      throw new Error('shopping list already exists.');

    return {
      ...container,
      [shoppingList.id]: shoppingList,
    };
  });
}

export function addShoppingListItem(
  store: Store,
  shoppingListId: ShoppingListId,
  item: ShoppingListItem
) {
  store.set(shoppingListContainerAtom, (container) => {
    const shoppingList = container[shoppingListId];
    if (!shoppingList) {
      throw new Error('shopping list does not exist.');
    }

    return {
      ...container,
      [shoppingListId]: {
        ...shoppingList,
        itemList: [...shoppingList.itemList, item],
      },
    };
  });
}
