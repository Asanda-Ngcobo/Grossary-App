
import { ChevronLeft } from "@deemlol/next-icons";

function AddListMockUp() {
    return (
         <main className="w-full text-[8px] sm:text-sm">
      <button className="mt-2 mx-[5%] bg-white active:bg-gray-600 rounded-full
       w-[30px] h-[30px] flex justify-center items-center">
       
          <ChevronLeft color="black" size={20} />
          
       
      </button>
      <h2 className="text-white text-center">Add Item</h2>
      <div className="w-[60%] mx-[20%] py-2 bg-white
       rounded-3xl my-1 ">
         <h2 className="ml-10">Rice</h2>
      </div>

    <ul className=" text-white w-[60%] mx-[20%] border rounded-sm">
            <li className="flex justify-between  py-1 mx-2"><span>Rice</span> <span>2kg</span></li>
             <li className="flex justify-between  py-1 mx-2"><span>Rice</span> <span>5kg</span></li>
              <li className="flex justify-between  py-1 mx-2"><span>Rice</span> <span>10kg</span></li>
              
          </ul>
    </main>
    )
}

export default AddListMockUp
