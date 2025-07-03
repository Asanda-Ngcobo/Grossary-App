'use client'
import SignOutButton from "@/app/(authentication)/signOutButton";
import { createClient } from "@/app/_utils/supabase/client";
import Image from "next/image";
import { useEffect, useState } from "react";

function Page() {
    const [users, setUsers] = useState([]);
     useEffect(() => {
    const fetchUsers = async () => {
    const supabase =  createClient();

const { data } = await supabase.auth.getUser();

const { data: profile } = await supabase
  .from('users_info')
  .select('*')
  .eq('id', data.user.id)
  .single();
  console.log(profile)

if (profile?.role === 'admin') {
  const { data: users, error } = await supabase
    .from('users_info')
    .select('*')
    .eq('role', 'user')

  
        if (error) {
          console.error('Admin fetch error:', error.message);
        } else {
          setUsers(users);
        }
      }

      
    };

    fetchUsers();
  }, []);
// const allUsers = users
    return (
        <div className="mt-20 ml-[10%] w-[80%]">
            <ul className="flex gap-4">
                <li className="w-1/4 bg-[#04284B] h-[100px] rounded-lg 
                grid justify-center items-center">
                    <span className="">All users</span>
                    <span className="font-extrabold">{users.length}</span>
                </li>
                  <li className="w-1/4 bg-[#04284B] h-[100px] rounded-lg 
                grid justify-center items-center">
                    <span className="">New users</span>
                    <span className="font-extrabold">2</span>
                </li>
                  <li className="w-1/4 bg-[#04284B] h-[100px] rounded-lg 
                grid justify-center items-center">
                    <span className="">Churn users</span>
                    <span className="font-extrabold">0</span>
                </li>
                   <li className="w-1/4 bg-[#04284B] h-[100px] rounded-lg 
                grid justify-center items-center">
                    <span className="">Grossary+ Subs</span>
                    <span className="font-extrabold">0</span>
                </li>
                  <li className="w-1/4 bg-[#04284B] h-[100px] rounded-lg 
                grid justify-center items-center">
                  <SignOutButton/>
                </li>
            </ul>

             <div className="p-4">
      <h2 className="text-xl font-bold mb-4">User List</h2>
      <table className="w-full table-auto border-0 bg-[#04284B] rounded-2xl">
        <thead>
          <tr className="">
            <th className=" p-2">Image</th>
            <th className=" p-2">Email</th>
            <th className=" p-2">Average Monthly Spend</th>
            <th className=" p-2">Average Monthly Savings</th>
            <th className=" p-2">Lists</th>
            <th className=" p-2">Last Login</th>
          </tr>
        </thead>
        <tbody className="">
          {users.map((user) => (
            <tr key={user.id} className="text-center w-[90%] mx-[5%]">
              <td className=" p-2 flex justify-center"> <Image
                    src={user?.image ?? "/default-profile-picture.jpg"}
                    alt="Profile picture"
                    height={80}
                    width={80}
                    className="rounded-full object-cover"
                  /> </td>
              <td className=" p-2">{user.email}</td>
              <td className=" p-2">{user?.avg_monthly_spend ?? 0}</td>
                            <td className=" p-2">{user?.avg_monthly_savings ?? 0}</td>
              <td className=" p-2">
                {user.last_sign_in_at
                  ? new Date(user.last_sign_in_at).toLocaleString()
                  : 'N/A'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
        </div>
    )
}

export default Page
