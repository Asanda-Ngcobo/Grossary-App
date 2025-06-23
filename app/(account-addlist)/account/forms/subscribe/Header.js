import { auth } from "@/app/_lib/auth";
import { ChevronLeft, CreditCard, PayPal } from "@deemlol/next-icons";
import { Link, Links } from "react-router-dom";
import EditButton from "../[listId]/edit-list/EditButton";

async function Header() {
   
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
            className="bg-white text-gray-500 text-lg text-center p-1 rounded-md"
            required
          />
            <section>
            <div className="flex justify-between">
                <h2>
Payment method
                </h2>
                
                <ul  className="flex justify-between bg-[#04284B] px-3 py-1 rounded-md">
                    <li className="px-2"><Link to= '/account/forms/subscribe/card'> Card <CreditCard/></Link></li>
                    <li className="px-2"><Link to= '/account/forms/subscribe/card'>PayPal<PayPal/></Link> </li>
                </ul>
            </div>
        </section>
        </div>
      

        <div className="mt-4 ">
          <EditButton>Subscribe to Grossary Plus</EditButton>
        </div>
      </form>
        </div>
    )
    
}

export default Header
