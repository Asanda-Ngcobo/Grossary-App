"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/app/_utils/supabase/client";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Spinner from "@/app/(website)/_components/Spinner";

export default function UserListPage() {
  const { id, listid } = useParams();
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [list, setList] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || !listid) return;

    const fetchData = async () => {
      const supabase = createClient();

      // Fetch user
      const { data: userData, error: userError } = await supabase
        .from("profiles") // adjust to your user table name
        .select("*")
        .eq("id", id)
        .single();

      if (userError) console.error(userError);

      // Fetch list info
      const { data: listData, error: listError } = await supabase
        .from("user_lists")
        .select("*")
        .eq("id", listid)
        .single();

      if (listError) console.error(listError);

      // Fetch items in this list
      const { data: itemsData, error: itemsError } = await supabase
        .from("list_items")
        .select("*")
        .eq("list_id", listid);
        

      if (itemsError) console.error(itemsError);

      setUser(userData || null);
      setList(listData || null);
      setItems(itemsData || []);
      setLoading(false);
    };

    fetchData();
  }, [id, listid]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        <Spinner />
      </div>
    );
  }

  if (!list) {
    return (
      <p className="p-6 text-red-500">
        List not found.{" "}
        <button
          onClick={() => router.back()}
          className="underline text-blue-400"
        >
          Go back
        </button>
      </p>
    );
  }

  const numberOfItems = items.length;

  return (
    <div className="mt-20 ml-[10%] w-[80%] flex flex-row text-white">
      {/* User sidebar */}
      {user && (
        <div className="p-6 rounded-lg items-center gap-6 w-1/5">
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
              Joined:{" "}
              {new Date(user.created_at).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="w-full">
        <Link
          href={`/dashboard/users/${id}`}
          className="text-blue-400 hover:underline mb-4 block"
        >
          ← Back to Lists
        </Link>

        <h1 className="text-2xl font-bold mb-4">List Info</h1>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="bg-[#04284B] p-4 rounded-lg text-center">
            <p className="text-sm opacity-70">List Name</p>
            <p className="text-xl font-bold">{list.list_name}</p>
          </div>
          <div className="bg-[#04284B] p-4 rounded-lg text-center">
            <p className="text-sm opacity-70">Number of Items</p>
            <p className="text-xl font-bold">{numberOfItems}</p>
          </div>
          <div className="bg-[#04284B] p-4 rounded-lg text-center">
            <p className="text-sm opacity-70">Budget</p>
            <p className="text-xl font-bold">R{list.list_budget}</p>
          </div>
          <div className="bg-[#04284B] p-4 rounded-lg text-center">
            <p className="text-sm opacity-70">Money Saved</p>
            <p className="text-xl font-bold">{list.money_left}</p>
          </div>
        </div>

        {/* Items Table */}
        <h2 className="text-lg font-bold mt-8">Items</h2>
        <div className="mt-4 bg-[#04284B] p-4 rounded-lg h-[60vh] overflow-y-auto">
          {items.length === 0 ? (
            <p className="text-sm opacity-70">No items found for this list.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-[#04284B] z-10">
                <tr className="text-left border-b border-gray-600">
                  <th className="p-2">Quantity</th>
                  <th className="p-2">Name</th>
                  <th className="p-2">Units</th>
                  <th className="p-2">Price</th>
                  <th className="p-2">Total Price</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="p-2">{item.item_quantity}</td>
                    <td className="p-2">{item.item_name}</td>
                    <td className="p-2">
                      {item.item_volume_mass}
                      {item.item_unit}
                    </td>
                    <td className="p-2">{item.price}</td>
                    <td className="p-2">{item.total_price}</td>
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
