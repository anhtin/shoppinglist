import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { ShoppingListId } from './types';
import { useAddShoppingListItem } from './store';

type AddShoppingListItemFormProps = {
  shoppingListId: ShoppingListId;
};

export function AddShoppingListItemForm({
  shoppingListId,
}: AddShoppingListItemFormProps) {
  const { register, handleSubmit } = useData(shoppingListId);

  return (
    <form role="form" onSubmit={handleSubmit}>
      <label>
        Item name
        <input
          type="text"
          {...register('name', { 
            required: 'Item name is required',
            validate: (value) => {
              if (!value || value.trim().length === 0) {
                return 'Item name cannot be blank';
              }
              return true;
            }
          })}
        />
      </label>
      <button type="submit">Add item</button>
    </form>
  );
}

function useData(shoppingListId: ShoppingListId) {
  const {
    register,
    handleSubmit: validate,
    reset,
    formState: { isSubmitSuccessful },
  } = useForm<FormValues>({
    defaultValues: {
      name: '',
    },
  });

  const addShoppingListItem = useAddShoppingListItem();

  const handleSubmit = validate((data) => {
    addShoppingListItem(shoppingListId, {
      name: data.name,
      checked: false,
    });
  });

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  return {
    register,
    handleSubmit,
  };
}

type FormValues = {
  name: string;
};
