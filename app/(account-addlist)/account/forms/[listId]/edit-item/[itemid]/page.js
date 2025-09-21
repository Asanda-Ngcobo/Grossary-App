// 
import { Suspense } from 'react';
import EditItemForm from './EditItemForm'; // this will be the client component
import Loading from '../../add-item/loading';


export const metadata = {
  title: "Edit Item | Grossary",
  description: "Grossary - a simple, all-in-one grocery app that helps you",
};
export default async function Page({ params }) {
  const {listId, itemid} = await params

  return (
<Suspense fallback={<Loading/>}>
 <EditItemForm listId={listId} itemid={itemid} />
  </Suspense>
  )
  
 

}
