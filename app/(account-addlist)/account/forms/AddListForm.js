'use client'
function AddListForm() {
    return (
    <>
         <div className="py-2 px-4 rounded-md w-[90%] mt-[5%]
  ml-[5%] md:w-[40%] md:ml-[25%] grid grid-rows-2 gap-2 bg-[#041527]
   shadow-sm">
      <label htmlFor="name" className=" text-2xl">List Name</label>
                    <input
                    name="list_name"
                    placeholder="Monthly Grocery"
                    required
                    
className="bg-white text-black text-2xl p-3 rounded-md"
                    
                    />

   </div>
   <div className="py-2 px-4 rounded-md w-[90%] mt-[5%]
  ml-[5%] md:w-[40%] md:ml-[25%] grid grid-rows-2 gap-2 bg-[#041527]
   shadow-sm">
      <label htmlFor="name" className=" text-2xl">Budget</label>
                    <input
                    name="list_budget"
                    required
                    
className="bg-white text-black text-2xl p-3 rounded-md"
                    
                    />

   </div>
    </>
    
    )
}

export default AddListForm
