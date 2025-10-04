import { createStore } from 'jotai';
import { describe, expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { v4 as uuid } from 'uuid';
import { TestProvider } from '../../shared/TestProvider';
import { ShoppingListListing } from './ShoppingListListing';
import { ShoppingListDetail } from './ShoppingListDetail';
import { addShoppingList } from './store';
import { AddShoppingListForm } from './AddShoppingListForm';
import { generateShoppingList, generateShoppingListItem } from './testUtils';
import type { Locator } from '@vitest/browser/context';

describe('Feature: Shopping list management', () => {
  test('Scenario: User views empty shopping list listing', async () => {
    /**
     * GIVEN there are no shopping lists
     * WHEN the user views the shopping list listing
     * THEN "No shopping lists." should be visible
     */
    const renderResult = render(
      <TestProvider store={createStore()}>
        <ShoppingListListing />
      </TestProvider>
    );

    expect(renderResult.getByText('No shopping lists.')).toBeVisible();
  });

  test('Scenario: User views shopping list listing with multiple shopping lists', async () => {
    /**
     * GIVEN there are multiple shopping lists with a mix of checked and unchecked items
     * WHEN the user views the shopping list listing
     * THEN all shopping lists should be visible with the correct link and status
     */
    // Arrange
    const store = createStore();

    const shoppingList1 = generateShoppingList({
      name: 'List with 2 items where 1 is checked',
      itemList: [
        generateShoppingListItem({ name: 'Item 1', checked: false }),
        generateShoppingListItem({ name: 'Item 2', checked: true }),
      ],
    });
    addShoppingList(store, shoppingList1);

    const shoppingList2 = generateShoppingList({
      name: 'List with 3 items where 2 is checked',
      itemList: [
        generateShoppingListItem({ name: 'Item 1', checked: true }),
        generateShoppingListItem({ name: 'Item 2', checked: true }),
        generateShoppingListItem({ name: 'Item 3', checked: false }),
      ],
    });
    addShoppingList(store, shoppingList2);

    // Act
    const renderResult = render(
      <TestProvider store={store}>
        <ShoppingListListing />
      </TestProvider>
    );

    // Assert
    const getRow = (shoppingListName: string) =>
      renderResult.getByRole('row', { name: shoppingListName });

    const getLink = (container: Locator, linkText: string) =>
      container.getByRole('link', { name: linkText });

    const getCell = (container: Locator, cellText: string) =>
      container.getByRole('cell', { name: cellText });

    const shoppingList1Row = getRow(shoppingList1.name);
    expect(shoppingList1Row).toBeVisible();
    expect(getCell(shoppingList1Row, '1 / 2')).toBeVisible();
    expect(getLink(shoppingList1Row, shoppingList1.name)).toHaveAttribute(
      'href',
      `/shopping-list/${shoppingList1.id}`
    );

    const shoppingList2Row = getRow(shoppingList2.name);
    expect(shoppingList2Row).toBeVisible();
    expect(getCell(shoppingList2Row, '2 / 3')).toBeVisible();
    expect(getLink(shoppingList2Row, shoppingList2.name)).toHaveAttribute(
      'href',
      `/shopping-list/${shoppingList2.id}`
    );
  });

  test('Scenario: User adds shopping list when no shopping list exists', async () => {
    /**
     * GIVEN there are no shopping lists
     * WHEN the user adds a new shopping list
     * AND the user views the shopping list listing
     * THEN the form should submit successfully
     * AND the new shopping list should be visible with status "0/0"
     */
    // Arrange
    const store = createStore();

    const renderResult = render(
      <TestProvider store={store}>
        <AddShoppingListForm />
        <ShoppingListListing />
      </TestProvider>
    );

    // Act
    const newShoppingListName = `name-${uuid()}`;
    await renderResult.getByLabelText('Name').fill(newShoppingListName);
    await renderResult.getByText('Submit').click();

    // Assert
    expect(renderResult.getByLabelText('Name')).toHaveValue('');

    const getRow = (shoppingListName: string) =>
      renderResult.getByRole('row', { name: shoppingListName });

    const newRow = getRow(newShoppingListName);
    expect(newRow).toBeVisible();
    expect(newRow.getByRole('cell', { name: '0 / 0' })).toBeVisible();
  });

  test('Scenario: User adds shopping list when multiple shopping lists exists', async () => {
    /**
     * GIVEN there are multiple shopping lists with a mix of checked and unchecked items
     * WHEN the user adds a new shopping list
     * AND the user views the shopping list listing
     * THEN the form should submit successfully
     * AND the new shopping list should be visible with status "0 / 0"
     * AND the existing shopping lists should still be visible with unchanged statuses
     */
    // Arrange
    const store = createStore();
    addShoppingList(
      store,
      generateShoppingList({
        name: 'List with 2 items where 1 is checked',
        itemList: [
          generateShoppingListItem({ name: 'Item 1', checked: false }),
          generateShoppingListItem({ name: 'Item 2', checked: true }),
        ],
      })
    );
    addShoppingList(
      store,
      generateShoppingList({
        name: 'List with 3 items where 2 is checked',
        itemList: [
          generateShoppingListItem({ name: 'Item 1', checked: true }),
          generateShoppingListItem({ name: 'Item 2', checked: true }),
          generateShoppingListItem({ name: 'Item 3', checked: false }),
        ],
      })
    );

    const renderResult = render(
      <TestProvider store={store}>
        <AddShoppingListForm />
        <ShoppingListListing />
      </TestProvider>
    );

    // Act
    const newShoppingListName = `name-${uuid()}`;
    await renderResult.getByLabelText('Name').fill(newShoppingListName);
    await renderResult.getByText('Submit').click();

    // Assert
    expect(renderResult.getByLabelText('Name')).toHaveValue('');

    const getRow = (shoppingListName: string) =>
      renderResult.getByRole('row', { name: shoppingListName });

    const getCell = (container: Locator, cellText: string) =>
      container.getByRole('cell', { name: cellText });

    const newRow = getRow(newShoppingListName);
    expect(newRow).toBeVisible();
    expect(getCell(newRow, '0 / 0')).toBeVisible();

    const shoppingList1Row = getRow('List with 2 items where 1 is checked');
    expect(shoppingList1Row).toBeVisible();
    expect(getCell(shoppingList1Row, '1 / 2')).toBeVisible();

    const shoppingList2Row = getRow('List with 3 items where 2 is checked');
    expect(shoppingList2Row).toBeVisible();
    expect(getCell(shoppingList2Row, '2 / 3')).toBeVisible();
  });

  test('Scenario: User attempts to add shopping list with empty name', async () => {
    /**
     * GIVEN there are no shopping lists
     * WHEN the user tries to add a shopping list with an empty name
     * THEN the form should not submit successfully
     * AND no new shopping list should be added
     */
    const renderResult = render(
      <TestProvider store={createStore()}>
        <AddShoppingListForm />
        <ShoppingListListing />
      </TestProvider>
    );

    await renderResult.getByText('Submit').click();

    expect(renderResult.getByLabelText('Name')).toHaveValue('');
    expect(renderResult.getByText('No shopping lists.')).toBeVisible();
  });

  test('Scenario: User attempts to add shopping list with whitespace-only name', async () => {
    /**
     * GIVEN there are no shopping lists
     * WHEN the user tries to add a shopping list with a name containing only whitespace
     * THEN the form should not submit successfully
     * AND no new shopping list should be added
     */
    const renderResult = render(
      <TestProvider store={createStore()}>
        <AddShoppingListForm />
        <ShoppingListListing />
      </TestProvider>
    );

    const name = '   ';
    await renderResult.getByLabelText('Name').fill(name);
    await renderResult.getByText('Submit').click();

    expect(renderResult.getByLabelText('Name')).toHaveValue(name);
    expect(renderResult.getByText('No shopping lists.')).toBeVisible();
  });

  test('Scenario: User adds shopping list with special characters', async () => {
    /**
     * GIVEN there are no shopping lists
     * WHEN the user adds a shopping list with special characters in the name
     * AND the user views the shopping list listing
     * THEN the new shopping list should be visible
     */
    const renderResult = render(
      <TestProvider store={createStore()}>
        <AddShoppingListForm />
        <ShoppingListListing />
      </TestProvider>
    );

    const specialName = '🛒 Grocery & Stuff! (2024) - Main';
    await renderResult.getByLabelText('Name').fill(specialName);
    await renderResult.getByText('Submit').click();

    expect(renderResult.getByText(specialName)).toBeVisible();
  });

  test('Scenario: User adds shopping list with very long name', async () => {
    /**
     * GIVEN there are no shopping lists
     * WHEN the user adds a shopping list with a very long name
     * AND the user views the shopping list listing
     * THEN the shopping list with the very long name should be visible
     */
    const renderResult = render(
      <TestProvider store={createStore()}>
        <AddShoppingListForm />
        <ShoppingListListing />
      </TestProvider>
    );

    const longName =
      'This is a very long shopping list name that contains many words and could potentially cause display or storage issues but should still work correctly';
    await renderResult.getByLabelText('Name').fill(longName);
    await renderResult.getByText('Submit').click();

    expect(renderResult.getByText(longName)).toBeVisible();
  });

  test('Scenario: User views shopping list with no items', async () => {
    /**
     * GIVEN there is a shopping list with no items
     * WHEN the user views the shopping list
     * THEN the shopping list name should be visible
     * AND "No items in shopping list." should be visible
     * AND the add item form should be visible
     */
    const store = createStore();
    const shoppingList = generateShoppingList({
      name: 'My Empty List',
      itemList: [],
    });
    addShoppingList(store, shoppingList);

    const renderResult = render(
      <TestProvider store={store}>
        <ShoppingListDetail shoppingListId={shoppingList.id} />
      </TestProvider>
    );

    expect(renderResult.getByText('My Empty List')).toBeVisible();
    expect(renderResult.getByText('No items in shopping list.')).toBeVisible();
    expect(renderResult.getByLabelText('Item name')).toBeVisible();
    expect(renderResult.getByText('Add item')).toBeVisible();
  });

  test('Scenario: User views shopping list with multiple items', async () => {
    /**
     * GIVEN there is a shopping list with multiple items
     * WHEN the user views the shopping list
     * THEN the shopping list name should be visible
     * AND all items should be visible
     * AND the checked items should have strikethrough
     * AND the add item form should be visible
     */
    const store = createStore();
    const shoppingList = generateShoppingList({
      name: 'Grocery List',
      itemList: [
        generateShoppingListItem({ name: 'Apples', checked: false }),
        generateShoppingListItem({ name: 'Bread', checked: true }),
        generateShoppingListItem({ name: 'Potatoes', checked: true }),
        generateShoppingListItem({ name: 'Milk', checked: false }),
      ],
    });
    addShoppingList(store, shoppingList);

    const renderResult = render(
      <TestProvider store={store}>
        <ShoppingListDetail shoppingListId={shoppingList.id} />
      </TestProvider>
    );

    expect(renderResult.getByText('Grocery List')).toBeVisible();
    expect(renderResult.getByText('Apples')).toBeVisible();
    expect(renderResult.getByText('Apples')).not.toHaveStyle({
      textDecoration: 'line-through',
    });
    expect(renderResult.getByText('Bread')).toBeVisible();
    expect(renderResult.getByText('Bread')).toHaveStyle({
      textDecoration: 'line-through',
    });
    expect(renderResult.getByText('Potatoes')).toBeVisible();
    expect(renderResult.getByText('Potatoes')).toHaveStyle({
      textDecoration: 'line-through',
    });
    expect(renderResult.getByText('Milk')).toBeVisible();
    expect(renderResult.getByText('Milk')).not.toHaveStyle({
      textDecoration: 'line-through',
    });
    expect(renderResult.getByLabelText('Item name')).toBeVisible();
    expect(renderResult.getByText('Add item')).toBeVisible();
  });

  test('Scenario: User views non-existent shopping list', async () => {
    /**
     * GIVEN there are multiple shopping lists
     * WHEN the user tries to view a shopping list that does not exist
     * THEN "Shopping list not found." should be visible
     */
    const store = createStore();
    addShoppingList(store, generateShoppingList());
    addShoppingList(store, generateShoppingList());
    const nonExistentId = uuid();

    const renderResult = render(
      <TestProvider store={store}>
        <ShoppingListDetail shoppingListId={nonExistentId} />
      </TestProvider>
    );

    expect(renderResult.getByText('Shopping list not found.')).toBeVisible();
  });

  test('Scenario: User adds item to shopping list with no existing items', async () => {
    /**
     * GIVEN there is a shopping list with no existing items
     * WHEN the user adds a new item to the shopping list
     * AND the user views the shopping list
     * THEN the form should submit successfully
     * AND the new item should be visible
     * AND the existing items should still be visible
     */
    // Arrange
    const store = createStore();
    const shoppingList = generateShoppingList({
      name: 'Empty List',
      itemList: [],
    });
    addShoppingList(store, shoppingList);

    const renderResult = render(
      <TestProvider store={store}>
        <ShoppingListDetail shoppingListId={shoppingList.id} />
      </TestProvider>
    );

    // Act
    const newItemName = `new-item-${uuid()}`;
    await renderResult.getByLabelText('Item name').fill(newItemName);
    await renderResult.getByText('Add item').click();

    // Assert
    expect(renderResult.getByLabelText('Item name')).toHaveValue('');
    expect(renderResult.getByText(newItemName)).toBeVisible();
    expect(
      renderResult.getByText('No items in shopping list.').elements
    ).toHaveLength(0);
  });

  test('Scenario: User adds item to shopping list with multiple items', async () => {
    /**
     * GIVEN there is a shopping list with 5 items where 3 are unchecked and 2 are checked
     * WHEN the user adds a new item to the shopping list
     * AND the user views the shopping list
     * THEN the form should submit successfully
     * AND the new item should be visible
     * AND the existing items should still be visible
     */
    // Arrange
    const store = createStore();
    const shoppingList = generateShoppingList({
      name: 'List with 5 items where 3 are unchecked and 2 are checked',
      itemList: [
        generateShoppingListItem({ name: 'Item 1', checked: false }),
        generateShoppingListItem({ name: 'Item 2', checked: true }),
        generateShoppingListItem({ name: 'Item 3', checked: true }),
        generateShoppingListItem({ name: 'Item 4', checked: false }),
        generateShoppingListItem({ name: 'Item 5', checked: true }),
      ],
    });
    addShoppingList(store, shoppingList);

    const renderResult = render(
      <TestProvider store={store}>
        <ShoppingListDetail shoppingListId={shoppingList.id} />
      </TestProvider>
    );

    // Act
    const newItemName = `new-item-${uuid()}`;
    await renderResult.getByLabelText('Item name').fill(newItemName);
    await renderResult.getByText('Add item').click();

    // Assert
    expect(renderResult.getByLabelText('Item name')).toHaveValue('');
    expect(renderResult.getByText(newItemName)).toBeVisible();
    expect(renderResult.getByText('Item 1')).toBeVisible();
    expect(renderResult.getByText('Item 1')).not.toHaveStyle({
      textDecoration: 'line-through',
    });
    expect(renderResult.getByText('Item 2')).toBeVisible();
    expect(renderResult.getByText('Item 2')).toHaveStyle({
      textDecoration: 'line-through',
    });
    expect(renderResult.getByText('Item 3')).toBeVisible();
    expect(renderResult.getByText('Item 3')).toHaveStyle({
      textDecoration: 'line-through',
    });
    expect(renderResult.getByText('Item 4')).toBeVisible();
    expect(renderResult.getByText('Item 4')).not.toHaveStyle({
      textDecoration: 'line-through',
    });
    expect(renderResult.getByText('Item 5')).toBeVisible();
    expect(renderResult.getByText('Item 5')).toHaveStyle({
      textDecoration: 'line-through',
    });
  });

  test('Scenario: User attempts to add item with empty name to shopping list', async () => {
    /**
     * GIVEN there is a shopping list
     * WHEN the user tries to add an item with an empty name
     * AND the user views the shopping list
     * THEN the form should not submit successfully
     * AND no new item should be added
     */
    const store = createStore();
    const shoppingList = generateShoppingList();
    addShoppingList(store, shoppingList);

    const renderResult = render(
      <TestProvider store={store}>
        <ShoppingListDetail shoppingListId={shoppingList.id} />
      </TestProvider>
    );

    await renderResult.getByText('Add item').click();

    expect(renderResult.getByLabelText('Item name')).toHaveValue('');
    expect(renderResult.getByText('No items in shopping list.')).toBeVisible();
  });

  test('Scenario: User attempts to add item with whitespace-only name to shopping list', async () => {
    /**
     * GIVEN there is a shopping list
     * WHEN the user tries to add an item with a whitespace-only name
     * AND the user views the shopping list
     * THEN the form should not submit successfully
     * AND no new item should be added
     */
    const store = createStore();
    const shoppingList = generateShoppingList();
    addShoppingList(store, shoppingList);

    const renderResult = render(
      <TestProvider store={store}>
        <ShoppingListDetail shoppingListId={shoppingList.id} />
      </TestProvider>
    );

    const name = '   ';
    await renderResult.getByLabelText('Item name').fill(name);
    await renderResult.getByText('Add item').click();

    expect(renderResult.getByLabelText('Item name')).toHaveValue(name);
    expect(renderResult.getByText('No items in shopping list.')).toBeVisible();
  });

  test('Scenario: User adds item with special characters to shopping list', async () => {
    /**
     * GIVEN there is a shopping list
     * WHEN the user adds an item with special characters in the name
     * AND the user views the shopping list
     * THEN the new item should be visible
     */
    const store = createStore();
    const shoppingList = generateShoppingList();
    addShoppingList(store, shoppingList);

    const renderResult = render(
      <TestProvider store={store}>
        <ShoppingListDetail shoppingListId={shoppingList.id} />
      </TestProvider>
    );

    const specialItemName = '🍎 Organic Apples (2kg) - $5.99';
    await renderResult.getByLabelText('Item name').fill(specialItemName);
    await renderResult.getByText('Add item').click();

    expect(renderResult.getByText(specialItemName)).toBeVisible();
  });

  test('Scenario: User adds item with very long name to shopping list', async () => {
    /**
     * GIVEN there is a shopping list
     * WHEN the user adds an item with a very long name to the shopping list
     * AND the user views the shopping list
     * THEN the new item should be visible
     */
    const store = createStore();
    const shoppingList = generateShoppingList();
    addShoppingList(store, shoppingList);

    const renderResult = render(
      <TestProvider store={store}>
        <ShoppingListDetail shoppingListId={shoppingList.id} />
      </TestProvider>
    );

    const longName =
      'This is a very long item name that contains many words and could potentially cause display or storage issues but should still work correctly';
    await renderResult.getByLabelText('Item name').fill(longName);
    await renderResult.getByText('Add item').click();

    expect(renderResult.getByText(longName)).toBeVisible();
  });
});
