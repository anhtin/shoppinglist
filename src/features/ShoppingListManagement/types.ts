export type ShoppingList = {
  id: ShoppingListId;
  name: string;
  itemList: ShoppingListItem[];
};

export type ShoppingListId = string;

export type ShoppingListItem = {
  name: string;
  checked: boolean;
};
