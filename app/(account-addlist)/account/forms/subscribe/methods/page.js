function page() {
    return (
          <div
          className="py-2 px-4 rounded-md w-[90%] mt-[5%] ml-[5%] 
          md:w-[40%] md:ml-[25%] grid grid-rows-2 gap-1 bg-[#041527] shadow-sm"
        >
               <label htmlFor="name" className="text-left text-lg text-gray-400">
            Card Information
          </label>
          <input
          id="name"
            name="name"
            defaultValue={email}
            className="bg-white text-gray-500 text-lg text-center p-1 rounded-md"
            required
          />
            
        </div>
    )
}

export default page
