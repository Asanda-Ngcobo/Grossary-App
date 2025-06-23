
import { ChevronLeft } from "@deemlol/next-icons";
import Link from "next/link";
import { updateProfile } from "@/app/_lib/actions";
import { redirect } from "next/navigation";
import EditButton from "../[listId]/edit-list/EditButton";
import { createClient } from "@/app/_utils/supabase/server";

export const dynamic = "force-dynamic"; // if needed for server-side rendering

export default async function Page() {
     const supabase = await createClient()
         const { data, error } = await supabase.auth.getUser()
    
        // Get additional profile info
         const { data: profile } = await supabase
           .from('users_info')
           .select('*')
           .eq('id', data.user.id)
           .single();
console.log(profile)
 
  const { fullName, id } = profile;

  async function handleUpdate(formData) {
    "use server";
    await updateProfile(id, formData);
    redirect("/account/profile");
  }

  return (
    <div>
      <button className="m-5 bg-white rounded-full w-[50px] h-[50px] flex justify-center items-center">
        <Link href="/account/profile">
          <ChevronLeft color="black" size={40} />
        </Link>
      </button>

      <form 
      action={handleUpdate}
      >
        <div
          className="py-2 px-4 rounded-md w-[90%] mt-[5%] ml-[5%] 
          md:w-[40%] md:ml-[25%] grid grid-rows-2 gap-6 bg-[#041527] shadow-sm"
        >
          <label htmlFor="name" className="text-center text-2xl text-white">
            Name
          </label>
          <input
          id="fullName"
            name="fullName"
            defaultValue={fullName}
            className="bg-white text-black text-2xl p-3 rounded-md"
            required
          />
        </div>

        <div className="mt-4 ml-[5%] md:ml-[25%]">
          <EditButton>Update Name</EditButton>
        </div>
      </form>
    </div>
  );
}
