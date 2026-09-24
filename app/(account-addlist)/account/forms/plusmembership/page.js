import GrossaryPlusSubscription from "@/app/(account)/_ui/GrossaryPlusSubscription"
import { ChevronLeft } from "@deemlol/next-icons"
import Link from "next/link";

function page() {
    return (
        <main>
             <button className="my-5 mx-[5%]  active:bg-gray-600 rounded-full w-[50px] h-[50px] flex justify-center items-center">
        <Link href={`/account/forms/profile`}>
          <ChevronLeft color="black" size={20} />
        </Link>
      </button>
       <div className="w-full h-screen flex justify-center items-center">
            <GrossaryPlusSubscription/>        </div>
        </main>
       
    )
}

export default page
