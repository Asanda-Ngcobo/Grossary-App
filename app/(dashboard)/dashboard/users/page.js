'use client';

import SignOutButton from "@/app/(authentication)/signOutButton";
import { createClient } from "@/app/_utils/supabase/client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

function Page() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const supabase = createClient();

      const { data: authUser } = await supabase.auth.getUser();

      const { data: profile } = await supabase
        .from('users_info')
        .select('*')
        .eq('id', authUser.user.id)
        .single();

      if (profile?.role === 'admin') {
        const { data: userProfiles, error: userError } = await supabase
          .from('users_info')
          .select('*')
          .eq('role', 'user');

        const { data: userLists, error: listError } = await supabase
          .from('user_lists')
          .select('id, user_id');

        if (userError || listError) {
          console.error('Fetch error:', userError?.message || listError?.message);
          return;
        }

        // Add number of lists to each user
        const usersWithListCounts = userProfiles.map((user) => {
          const listCount = userLists.filter((list) => list.user_id === user.id).length;
          return { ...user, listCount };
        });

        setUsers(usersWithListCounts);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="mt-20 ml-[10%] w-[80%]">
      <ul className="flex gap-4 flex-wrap">
        <li className="w-1/4 bg-[#04284B] h-[100px] rounded-lg grid justify-center items-center text-white">
          <span>All users</span>
          <span className="font-extrabold">{users.length}</span>
        </li>
        <li className="w-1/4 bg-[#04284B] h-[100px] rounded-lg grid justify-center items-center text-white">
          <span>New users</span>
          <span className="font-extrabold">2</span>
        </li>
        <li className="w-1/4 bg-[#04284B] h-[100px] rounded-lg grid justify-center items-center text-white">
          <span>Churn users</span>
          <span className="font-extrabold">0</span>
        </li>
        <li className="w-1/4 bg-[#04284B] h-[100px] rounded-lg grid justify-center items-center text-white">
          <span>Grossary+ Subs</span>
          <span className="font-extrabold">0</span>
        </li>
        <li className="w-1/4 bg-[#04284B] h-[100px] rounded-lg grid justify-center items-center">
          <SignOutButton />
        </li>
      </ul>

      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">User List</h2>
        <table className="w-full table-auto border-0 bg-[#04284B] rounded-2xl text-white">
          <thead className="text-sm">
            <tr>
              <th className="p-2">Image</th>
              <th className="p-2">Full Name</th>
            
              <th className="p-2">Monthly Spend</th>
              <th className="p-2">Monthly Savings</th>
              <th className="p-2">Lists</th>
              <th className="p-2">Last Login</th>
            </tr>
          </thead>
          <tbody className="text-xs">
            {users.map((user) => (
              <tr key={user.id} className="text-center border-t
               border-gray-600">
                <td className="p-2 flex justify-center">
                  <Link href={`/dashboard/users/${user.id}`}>
                   <Image
                    src={user?.image ?? "/default-profile-picture.jpg"}
                    alt="Profile"
                    height={60}
                    width={60}
                    className="rounded-full object-cover"
                  /></Link>
                 
                </td>
                <td className="p-2">{user.fullName}</td>
                <td className="p-2">R{Number(user?.avg_monthly_spend || 0).toFixed(2)}</td>
                <td className="p-2">R{Number(user?.avg_monthly_savings || 0).toFixed(2)}</td>
                <td className="p-2">{user.listCount}</td>
                <td className="p-2">
                  {user.last_signed_in_at
                    ? new Date(user.last_signed_in_at).toLocaleString()
                    : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Page;
