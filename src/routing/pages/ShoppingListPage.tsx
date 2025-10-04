import { useParams } from "react-router";
import { ShoppingListDetail } from "../../features/ShoppingListManagement/ShoppingListDetail";

export function ShoppingListDetailPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <main>
      <ShoppingListDetail shoppingListId={id!} />
    </main>
  );
}
