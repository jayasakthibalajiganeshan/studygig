import { supabase } from "./supabase";

export async function signUp(
  email: string,
  password: string,
  fullName: string,
  username: string,
  role: string,
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        username,
        role,
      },
    },
  });

  if (error) throw error;

  if (data.user) {
    await supabase.from("profiles").insert({
      id: data.user.id,
      full_name: fullName,
      username,
      role,
    });
  }

  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  return data;
}

export async function signOut() {
  await supabase.auth.signOut();
}
