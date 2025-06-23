// app/account/forms/[listId]/add-item/page.tsx
import AddItemForm from './AddItemForm'; // this will be the client component

export default async function Page({ params }) {
  const {listId} = await params
  return <AddItemForm listId={listId} />;
}
