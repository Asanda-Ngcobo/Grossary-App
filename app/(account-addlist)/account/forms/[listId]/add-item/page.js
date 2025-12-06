// 
import { Suspense } from 'react';

import Loading from '../../add-list/loading';
import AddItemForm from '../_listcomponents/AddItemForm';

export const metadata = {
  title: "Add Item | Grossary",
  description: "Grossary - a simple, all-in-one grocery app that helps you",
};
export default async function Page({ params }) {
  const {listId} = await params

  return (
<Suspense fallback={<Loading/>}>
 <AddItemForm listId={listId} />
  </Suspense>
  )
  
 
}
