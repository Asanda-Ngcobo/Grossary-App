import { auth } from "@/app/_lib/auth";
import { ChevronLeft, CreditCard, PayPal } from "@deemlol/next-icons";
import Link from "next/link";
import EditButton from "../[listId]/edit-list/EditButton";
import { getUserByEmail } from "@/app/_lib/data-services";




async function page() {
     const session = await auth();
    
    
    
      const profileInfo = await getUserByEmail(session.user.email);
      const { name, email } = profileInfo;
    return (
        <div>
            <button className="m-5 bg-white rounded-full w-[50px] h-[50px] flex justify-center items-center">
        <Link href="/account/profile">
          <ChevronLeft color="black" size={40} />
        </Link>
      </button>
            <form >
        <div
          className="py-2 px-4 rounded-md w-[90%] mt-[5%] ml-[5%] 
          md:w-[40%] md:ml-[25%] grid grid-rows-2 gap-1 bg-[#041527] shadow-sm"
        >
          <label htmlFor="name" className="text-left text-lg text-white">
            Contact Info
          </label>
          <input
          id="name"
            name="name"
            defaultValue={email}
            className="bg-white text-gray-500 text-lg text-left p-1 rounded-md"
            required
          />
            <div className="flex justify-between mt-3">
                <h2>
Payment method
                </h2>
                
                <ul  className="flex justify-between bg-[#04284B] px-3 py-1 rounded-md">
                    <li className="px-2 flex gap-2">Card <CreditCard/></li>
                  
                </ul>
            </div>
               <label htmlFor="name" className="text-left text-lg text-gray-500">
            Card Information
          </label>
          <input
          id="name"
            name="name"
            placeholder="4566 4554 5467 5467"
            className="border border-amber-50 text-gray-500 text-lg text-left w-[100%] p-1 rounded-md mb-2"
            required
          />
          <div className="flex flex-row gap-3">
  <input
          id="name"
            name="name"
            placeholder="MM/YYYY"
            className="border border-amber-50 text-gray-500 text-lg text-left w-3/4 p-1 rounded-md "
            required
          />
            <input
         
            placeholder="CVC"
            className="border border-amber-50 text-gray-500 text-lg text-left w-1/4 p-1 rounded-md"
            required
          />
          </div>
                <label htmlFor="name" className="text-left text-lg text-gray-500">
            CardHolder FullName
          </label>
          <input
         
            placeholder=""
            className="border border-amber-50 text-gray-500 text-lg text-left w-[100%] p-1 rounded-md mb-2"
            required
          />
        </div>
      

        <div className="mt-4 ">
          <EditButton>Subscribe to Grossary Plus</EditButton>
        </div>
      </form>
        </div>
    )
}

export default page
