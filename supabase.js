const SUPABASE_URL = "https://pbwhwepgfbannyfmsjuk.supabase.co";

const SUPABASE_KEY = "sb_publishable_zATlRRZoRwOxso8KRTSD8g_U4txCqnQ";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);
// Admin Authentication

async function adminLogin(email, password) {
  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email: email.trim(),
    password: password
  });

  if (error) throw error;
  return data;
}

async function adminLogout() {
  const { error } = await supabaseClient.auth.signOut();

  if (error) throw error;
}

async function checkAdminSession() {
  const { data, error } = await supabaseClient.auth.getSession();

  if (error) throw error;
  return data.session;
}