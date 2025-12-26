import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

console.log("Supabase Config:", {
  url: supabaseUrl ? "Carregada (OK)" : "VAZIA (ERRO)",
  key: supabaseAnonKey ? "Carregada (OK)" : "VAZIA (ERRO)"
});

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("As variáveis de ambiente do Supabase não foram carregadas. Verifique o .env ou as configurações do Render.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);