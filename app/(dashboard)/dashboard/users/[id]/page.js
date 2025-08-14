'use client';

import { use, useEffect, useState } from "react";
import { createClient } from "@/app/_utils/supabase/client";
import Image from "next/image";
import { useParams } from 'next/navigation'
import Link from "next/link";
import Spinner from "@/app/(website)/_components/Spinner";

export default function UserPage({params}) {
  const { id } = use(params); 
  console.log(id)
  const [user, setUser] = useState(null);
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const supabase = createClient();

      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from("users_info")
        .select("*")
        .eq("id", id)
        .single();

      // Fetch their lists
      const { data: userLists, error: listError } = await supabase
        .from("user_lists")
        .select("*")
        .eq("user_id", id)
         .order("created_at", { ascending: false });

      if (profileError) console.error(profileError);
      if (listError) console.error(listError);

      setUser(profile);
      setLists(userLists || []);
      setLoading(false);
    };

    if (id) fetchUserData();
  }, [id]);

  if (loading) {
    return <p className="p-6 text-white"><Spinner/></p>;
  }

  if (!user) {
    return <p className="p-6 text-red-500">User not found.</p>;
  }

  const isPlus = user.is_plus ? 'Yes': 'No';
  return (
    <div className="mt-20 ml-[10%] w-[80%]
    flex flex-row text-white">
    
      <div className="
      p-6 rounded-lg items-center gap-6
      w-1/5">
        

        <Image
          src={user.image ?? "/default-profile-picture.jpg"}
          alt="Profile"
          height={200}
          width={200}
          className="rounded-full object-cover"
        />
        <div>
          <h1 className="text-2xl font-bold">{user.fullName}</h1>
          <p className="text-sm opacity-80">{user.email}</p>
          <p className="mt-1 text-sm">
            Joined: {new Date(user.created_at).toLocaleDateString('en-GB',
               {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }
            )}
          </p>
        </div>
      </div>
      <div className="w-full">
  {/* Stats Section */}
  <div>
      <Link href="/dashboard/users" className="text-blue-400 hover:underline mb-4 block">
        ← Back to Users
      </Link>
       <h1>USER INFO</h1>
  </div>
 
      <div className="grid grid-cols-4 gap-4 mt-6">
        <div className="bg-[#04284B] p-4 rounded-lg text-center">
          <p className="text-sm opacity-70">Lists</p>
          <p className="text-xl font-bold">{lists.length}</p>
        </div>
        <div className="bg-[#04284B] p-4 rounded-lg text-center">
          <p className="text-sm opacity-70">Avg Monthly Spend</p>
          <p className="text-xl font-bold">R{Number(user.avg_monthly_spend || 0).toFixed(2)}</p>
        </div>
        <div className="bg-[#04284B] p-4 rounded-lg text-center">
          <p className="text-sm opacity-70">Avg Monthly Savings</p>
          <p className="text-xl font-bold">R{Number(user.avg_monthly_savings || 0).toFixed(2)}</p>
        </div>
        <div className="bg-[#04284B] p-4 rounded-lg text-center">
          <p className="text-sm opacity-70">Is Plus?</p>
          <p className="text-xl font-bold">{isPlus}</p>
        </div>
      </div>
 <h2 className="text-lg font-bold mb-4">Lists</h2>
    {/* Lists Table */}
<div className="mt-8 bg-[#04284B] p-4 rounded-lg h-[60vh]
 overflow-y-auto">
 
  {lists.length === 0 ? (
    <p className="text-sm opacity-70">No lists found for this user.</p>
  ) : (
    <table className="w-full text-sm">
      <thead className="sticky top-0 bg-[#04284B] z-10">
        <tr className="text-left border-b border-gray-600">
          <th className="p-2">List Name</th>
          <th className="p-2">Budget</th>
          <th className="p-2">Money Spent</th>
          <th className="p-2">Money Saved</th>
          <th className="p-2">Created</th>
          <th className="p-2">Status</th>
        </tr>
      </thead>
      <tbody>
        {lists.map((list) => (
          <tr key={list.id} className="">
            <td className="p-2"><Link href={`/dashboard/users/${user.id}/${list.id}`}>{list.list_name}</Link></td>
            <td className="p-2 py-7">{list.list_budget}</td>
            <td className="p-2">{list.money_spent || "Active"}</td>
            <td className="p-2 ">
              <span >{list.money_left || "Active"}</span>
              {list.money_left && (
                <span className="text-[8px] text-[#8E8686] px-3">
                  {((list.money_left / list.list_budget) * 100).toFixed(2)}%
                </span>
              )}
            </td>
            <td className="p-2">
              {new Date(list.created_at).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </td>
            <td className="p-2">
              {list.shopped_at
                ? new Date(list.shopped_at).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "Active"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )}
</div>

      </div>
    
    </div>
  );
}
