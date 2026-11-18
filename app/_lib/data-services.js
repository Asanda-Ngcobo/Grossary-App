
import { createClient } from "../_utils/supabase/server";
import { notFound } from "next/navigation";

// Get authenticated Supabase client and user
async function getAuthenticatedSupabase() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("You must be logged in to access this resource.");
  }

  return { supabase, user };
}

// Get user by ID
export async function getUserById(userId) {
  const { supabase } = await getAuthenticatedSupabase();

  const { data, error } = await supabase
    .from("users_info")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("getUserById error:", error);
    return null;
  }

  return data;
}

// Get a specific list
export async function getList(listId) {
  const { supabase } = await getAuthenticatedSupabase();

  const { data, error } = await supabase
    .from("user_lists")
    .select("*")
    .eq("id", listId)
    .single();

  if (error) {
    console.error("getList error:", error);
    notFound();
  }

  return data;
}

// Get active lists belonging to authenticated user
export async function getLists() {
  const { supabase, user } = await getAuthenticatedSupabase();

  const { data, error } = await supabase
    .from("user_lists")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getLists error:", error);
    throw new Error("We couldn't load your lists at this time.");
  }

  return data;
}

// Get loyalty cards
export async function getCards(userId) {
  const { supabase, user } = await getAuthenticatedSupabase();

  const { data, error } = await supabase
    .from("cards")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getCards error:", error);
    return [];
  }

  return data;
}

// Get historical lists
export async function getOldLists() {
  const { supabase, user } = await getAuthenticatedSupabase();

  const { data, error } = await supabase
    .from("user_lists")
    .select("*")
    .eq("user_id", user.id)
    .order("shopped_at", { ascending: false });

  if (error) {
    console.error("getOldLists error:", error);
    throw new Error("We couldn't load your shopping history.");
  }

  return data;
}

// Get all items belonging to a specific list
export async function getListsItemsById(listId) {
  const { supabase } = await getAuthenticatedSupabase();

  const { data, error } = await supabase
    .from("list_items")
    .select("*")
    .eq("list_id", listId);

  if (error) {
    console.error("getListsItemsById error:", error);
    return [];
  }

  return data;
}

// Get a specific grocery item
export async function getListItemById(itemId) {
  const { supabase } = await getAuthenticatedSupabase();

  const { data, error } = await supabase
    .from("list_items")
    .select("*")
    .eq("id", itemId)
    .single();

  if (error) {
    console.error("getListItemById error:", error);
    return null;
  }

  return data;
}

// Get all lists (subject to RLS and admin permissions)
export async function getAlllists() {
  const { supabase } = await getAuthenticatedSupabase();

  const { data, error } = await supabase
    .from("user_lists")
    .select("*");

  if (error) {
    console.error("getAlllists error:", error);
    return null;
  }

  return data;
}
