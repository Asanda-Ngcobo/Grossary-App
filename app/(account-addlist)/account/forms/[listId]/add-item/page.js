// 
import { Suspense } from 'react';
import AddItemForm from './AddItemForm'; // this will be the client component
import Loading from '../../add-list/loading';

export default async function Page({ params }) {
  const {listId} = await params

  return (
<Suspense fallback={<Loading/>}>
 <AddItemForm listId={listId} />
  </Suspense>
  )
  
 
}
