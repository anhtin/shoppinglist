import { v4 as uuid } from 'uuid';
import { useAddShoppingList } from './store';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';

export function AddShoppingListForm() {
  const { register, handleSubmit } = useData();

  return (
    <form role="form" onSubmit={handleSubmit}>
      <label>
        Name
        <input
          type="text"
          {...register('name', {
            required: 'Name is required',
            validate: (value) => {
              if (!value || value.trim().length === 0) {
                return 'Name cannot be blank';
              }
              return true;
            }
          })}
        />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
}

function useData() {
  const {
    register,
    handleSubmit: validate,
    reset,
    formState: { isSubmitSuccessful },
  } = useForm<FormValues>();

  const addShoppingList = useAddShoppingList();

  const handleSubmit = validate((data) => {
    addShoppingList({
      id: uuid(),
      name: data.name,
      itemList: [],
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
