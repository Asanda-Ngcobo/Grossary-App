
import SignOutButton from "@/app/(authentication)/signOutButton";
import Logo from "@/app/(website)/_components/Logo";
import { createClient } from "@/app/_utils/supabase/server";
import Image from "next/image";




async function DashboardHeader() {
 const supabase = await createClient();

      const { data: authUser } = await supabase.auth.getUser();

      const { data: profile } = await supabase
        .from('users_info')
        .select('*')
        .eq('id', authUser.user.id)
        .single();

            
    return (
        <div className="top-0 h-[70px]  bg-white
         text-[#04284B]
        shadow-2xl
        shadow-[#04284B]
        ">
            <div className="flex justify-between items-center mx-[5%]
             border-b-[#04284B]">
   <Logo />
            <ul className="flex justify-center 
                items-center gap-3">
                <li className=" flex justify-center 
                items-center
                font-bold">
                    <Image  src={profile?.image ?? "/default-profile-picture.jpg"}
                    alt="Profile"
                    height={60}
                    width={60}
                    className="rounded-full object-cover"/>
                   </li>
                    <li><SignOutButton/></li>
                    
            </ul>
            </div>
           
            
        </div>
    )
}

export default DashboardHeader
