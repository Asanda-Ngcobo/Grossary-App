

"use server";


import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getLists } from "./data-services";
import {supabaseServer} from './supabase-server'
import { supabase } from "./supabase";
import toast from "react-hot-toast";
import { createClient } from "../_utils/supabase/server";
import { createClient as createClientClient } from "../_utils/supabase/client";


export async function createList(formData) {
  // const session = await auth();
  // if (!session) throw new Error('You must be logged in to add a list');
const supabase = await createClient()
      const { data } = await supabase.auth.getUser()
    
     if (!data) throw new Error('You must be logged in to add a list');
    const { data: profile } = await supabase
        .from('users_info')
        .select('*')
        .eq('id', data.user.id)
        .single();
       
  const list_name = formData.get('list_name');
  const list_budget = formData.get('list_budget');

  if (typeof list_name !== 'string' || typeof list_budget !== 'string') {
    throw new Error('Invalid form data');
  }

  const newList = {
    user_id: profile.id,
    list_name,
    list_budget: Number(list_budget),
  };

  const { data: list, error } = await supabaseServer
    .from('user_lists')
    .insert([newList])
    .select()
    .single();

  if (error) {
    console.error("Supabase createList error:", error.message);
    throw new Error("The list could not be created");
  }

redirect(`/account/forms/${list.id}`);

}
 export async function deleteList(listId) {
    const supabase = await createClient()
      const { data } = await supabase.auth.getUser()
    
     if (!data) throw new Error('You must be logged in to add a list');
    const { data: profile } = await supabase
        .from('users_info')
        .select('*')
        .eq('id', data.user.id)
        .single();
    const userLists = await getLists(profile.id);
   
    const userListsIds = userLists.map((list) =>
    list.id)
    
    if(!userListsIds.includes(listId))
       throw new Error('You are not allowed to delete this list')
    const { error } = await supabaseServer.from('user_lists').delete().eq('id', listId);

  if (error) {
    console.error(error);
    throw new Error('Item could not be deleted');
  }
  
    revalidatePath('/account/lists')
    }

    export async function addItem(formData, listId) {


  const item_name = formData.get('item_name');
  const item_category = formData.get('item_category');
  const item_brand = formData.get('item_brand');
  const item_quantity = formData.get('item_quantity');
  const item_volume_mass = formData.get('item_volume_mass');
  const item_unit = formData.get('item_unit');

  if (typeof item_name !== 'string') {
    throw new Error('Invalid form data');
  }

  const newItem = {
    list_id: listId,
    item_name,
    item_category,
    item_brand,
    item_quantity,
    item_volume_mass,
    item_unit



  };

  const { data: list, error } = await supabaseServer
    .from('list_items')
    .insert([newItem])
    .select()
    .single();

  if (error) {
    console.error("Supabase addItem error:", error.message);
    throw new Error("The item could not be added");
  }
revalidatePath(`/account/forms/${listId}`)
redirect(`/account/forms/${listId}`);


}


export async function increaseQuantity(itemId, listId) {
  // Fetch current quantity
  const { data: currentItem, error: fetchError } = await supabaseServer
    .from('list_items')
    .select('item_quantity')
    .eq('id', itemId)
    .single();

  if (fetchError || !currentItem) {
    console.error(fetchError);
    throw new Error('Could not fetch item to update quantity');
  }

  const newQuantity = currentItem.item_quantity + 1;

  // Update quantity
  const { error: updateError } = await supabaseServer
    .from('list_items')
    .update({ item_quantity: newQuantity })
    .eq('id', itemId);

  if (updateError) {
    console.error(updateError);
    throw new Error('Could not update item quantity');
  }

  // Revalidate path to reflect the change
  revalidatePath(`/account/forms/${listId}`);
}

export async function decreaseQuantity(itemId, listId) {
  // Fetch current quantity
  const { data: currentItem, error: fetchError } = await supabaseServer
    .from('list_items')
    .select('item_quantity')
    .eq('id', itemId)
    .single();

  if (fetchError || !currentItem) {
    console.error(fetchError);
    throw new Error('Could not fetch item to update quantity');
  }

  const newQuantity = currentItem.item_quantity - 1;

  // Update quantity
  const { error: updateError } = await supabaseServer
    .from('list_items')
    .update({ item_quantity: newQuantity })
    .eq('id', itemId);

  if (updateError) {
    console.error(updateError);
    throw new Error('Could not update item quantity');
  }

  // Revalidate path to reflect the change
  revalidatePath(`/account/forms/${listId}`);
}

export async function deleteItem(itemId, listId){
  
const { error } = await supabase
  .from('list_items')
  .delete()
  .eq('id', itemId)
      
  if (error) {
    console.error(error);
    throw new Error('Item could not be deleted');
  }
    // Revalidate path to reflect the change
  revalidatePath(`/account/forms/${listId}`);
}


export async function updateItemPrice(itemId, price, item_name,is_checked, listId) {
  const { error } = await supabase
    .from('list_items')
    .update({ price, item_name, is_checked })
    .eq('id', itemId)

  if (error) {
    console.error(error)
    throw new Error('Price update failed')
  }

const checked = price !== null;

// Update is_checked in the database
const { error: updateError } = await supabaseServer
  .from('list_items')
  .update({ is_checked: checked })
  .eq('id', itemId);

if (updateError) {
  console.error(updateError);
  throw new Error('Could not update is_checked');
}

  revalidatePath(`/account/forms/${listId}`)
}

export async function getListItemById(itemId) {
  const { data, error } = await supabaseServer
    .from('list_items')
    .select('*')
    .eq('id', itemId)
    .single()

  if (error) {
    console.error('Error fetching item:', error)
    throw new Error('Item not found')
  }

  return data
}

export async function updateList(listId, formData) {
  const list_name = formData.get('list_name')
  const list_budget = parseFloat(formData.get('list_budget'))

  if (!list_name || isNaN(list_budget)) {
    throw new Error('Invalid list data: name or budget is missing/invalid.')
  }

  const { data, error } = await supabase
    .from('user_lists')
    .update({ list_name, list_budget })
    .eq('id', listId)
    .select()
    .single()

  if (error) {
    console.error('Supabase updateList error:', error.message)
    throw new Error('The list could not be updated')
  }

  redirect(`/account/forms/${listId}`)
}


//Reuse List

export async function reuseList(listId, userId) {
  // Step 1: Fetch original list
  const { data: originalList, error: listError } = await supabaseServer
    .from('user_lists')
    .select('*')
    .eq('id', listId)
    .single()

  if (listError || !originalList) {
    throw new Error('Could not find list to reuse.')
  }

  // Step 2: Fetch items from original list
  const { data: originalItems, error: itemsError } = await supabaseServer
    .from('list_items')
    .select('*')
    .eq('list_id', listId)

  if (itemsError) {
    throw new Error('Could not fetch original list items.')
  }

 
  // Step 3: Create new list with copied fields
  const { data: newList, error: insertError } = await supabaseServer
    .from('user_lists')
    .insert([
      {
        list_name: `${originalList.list_name}`,
        list_budget: originalList.list_budget,
        user_id: userId,
        money_spent: 0,
        shopped_at: null,
      },
    ])
    .select()
    .single()

  if (insertError) {
    throw new Error('Failed to create copied list.')
  }


const newListId = newList.id;

  // Step 4: Duplicate items into new list with prices removed
  const newItems = originalItems.map((item) => ({
   
  item_name: item.item_name,
  item_quantity: item.item_quantity,
  item_category: item.item_category, // preserve category
  item_brand: item.item_brand,
  item_volume_mass: item.item_volume_mass,
  item_unit: item.item_unit,
  list_id: newListId, // new list ID
  price: null, // reset price
  is_checked: false, // reset check status
  // DO NOT include total_price – it's generated


  }))

  const { error: insertItemsError } = await supabaseServer
    .from('list_items')
    .insert(newItems)
    .select()
if (insertItemsError) {
  console.error("Insert items error:", insertItemsError); // Add this line
  throw new Error("Failed to copy list items.");
}

// console.log(newItems)
  // Step 5: Redirect or return new list ID
   revalidatePath('/account/lists')
  redirect(`/account/lists`)
 
}
export async function updateProfile(id, formData) {
  const supabase = await createClient()

  const fullName = formData.get('fullName')
  if (!fullName) {
    throw new Error('Name field is required.')
  }

  const { data, error } = await supabase
    .from('users_info')
    .update({ fullName }) // ✅ Pass an object
    .eq('id', id) // ✅ Assumes `email` exists in your user_profiles table
    .select()
    .single()

  if (error) {
    console.error('Supabase updateProfile error:', error.message)
    throw new Error('The name could not be updated.')
  }
revalidatePath('/account/profile')
  redirect('/account/profile')
}


export async function signUpUser(formData) {
  // const supabaseServer = createBrowserClient ({ cookies });
   const supabase = await createClient()

  const fullName = formData.get('fullName').toString();
  const email = formData.get('email').toString();
  const password = formData.get('password').toString();
const dob = formData.get('date_of_birth').toString();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    fullName,
    dob
  });

  if (error) throw new Error(error.message);

  const userId = data.user?.id;
  if (!userId) throw new Error('Signup failed: No user returned');

  // Store additional user info
const { error: profileError } = await supabaseServer.from('users_info').insert({
  id: userId,
  email: email,
  fullName: fullName,
  role: 'user',
  date_of_birth: dob, // ✅ storing DOB
});
  if (profileError) throw new Error(profileError.message);

  // Fetch role (ensure RLS allows this)
  const { data: profile } = await supabaseServer
    .from('users_info')
    .select('role')
    .eq('id', userId)
    .single();

  return profile?.role || 'user';
}

export async function login(formData) {
 const supabase = await createClient()

const email = formData.get('email')?.toString();
  const password = formData.get('password')?.toString();

  if (!email || !password) {
    toast.error('Email and password are required');
    return;
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });


     if (error) {
    redirect('/error')
  }

  

  // Get user role or redirect destination
  const {
    data: { user },
  } = await supabase.auth.getUser();

 

 

  if (user?.admin) {
    redirect('/dashboard'); // Admin
  } else {
    redirect('/account'); // Regular user
  }
}

export async function logout() {
const supabase = await createClient()

  await supabase.auth.signOut()

  redirect('/') // or wherever you want to send the user after logout
}

//Google Auth Login

export async function googleAuthLogin() {
 const supabase =  createClientClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
  };

 