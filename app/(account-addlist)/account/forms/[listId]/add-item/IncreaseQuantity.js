'use client'
import { increaseQuantity } from "@/app/_lib/actions"
import { Plus } from "@deemlol/next-icons"

function IncreaseQuantity({ itemId, listId }) {
    //      const [optimisticLists, optimisticDelete] = useOptimistic(myLists,
    //          (currentLists, listId)=>{
    // return currentLists.filter((list)=>
    //     list.id !== listId)
    //     });
    //     async  function handleDelete(listId){
    //         optimisticDelete(listId)
    // await deleteList(listId)
    //     }
  async function handleClick() {
    try {
      await increaseQuantity(itemId, listId);
    } catch (error) {
      console.error("Failed to increase quantity:", error);
    }
  }

  return (
    <button onClick={handleClick} className="cursor-pointer">
      <Plus />
    </button>
  );
}

export default IncreaseQuantity;
