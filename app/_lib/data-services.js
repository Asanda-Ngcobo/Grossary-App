import { createClient } from "../_utils/supabase/client";
import { supabase } from "./supabase";
import { notFound } from "next/navigation";


export async function getUserById(email) {
const supabaseweb = createClient()
  const { data } = await supabaseweb
    .from("users_info")
    .select("*")
    .eq("id", email)
    .single();
  // No error here! We handle the possibility of no guest in the sign in callback
  return data;
}




export async function getList(listId){
 
  
const { error, data } = await supabase
  .from('user_lists')
  .select('*')
  .eq('id', listId)
    .single();

   if (error) {
    console.error(error);
    notFound()
  }
  return data;
          
}

export async function getLists(userId) {
  const { data, error } = await supabase
    .from('user_lists')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false }); // descending = newest first

  if (error) {
    console.error("Supabase error loading lists:", error.message);
    throw new Error('We couldn’t load your lists at this time. Please try again later.');
  }

  return data;
}

export async function getOldLists(userId) {
  const { data, error } = await supabase
    .from('user_lists')
    .select('*')
    .eq('user_id', userId)
    .order('shopped_at', { ascending: false }); // descending = newest first

  if (error) {
    console.error("Supabase error loading lists:", error.message);
    throw new Error('We couldn’t load your lists at this time. Please try again later.');
  }

  return data;
}

export async function getListsItemsById(listId) {
  const { data, error } = await supabase
    .from('list_items')
    .select('*')
    .eq('list_id', listId);

  if (error) {
    console.error('Error fetching list items:', error.message);
    return [];
  }

  return data;
}
export async function getListItemById(itemId) {
  const { data, error } = await supabase
    .from('lists_items')
    .select('*')
    .eq('id', itemId)
    .single();

  if (error) {
    console.error("Error fetching item:", error);
    return null;
  }

  return data;
}

export async function getAlllists(){
  
let { data: user_lists, error } = await supabase
  .from('user_lists')
  .select('*')

    if (error) {
    console.error("Error fetching lists:", error);
    return null;
  }

  return user_lists;
          
}