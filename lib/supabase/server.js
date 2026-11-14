import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

const URL_SUPABASE = process.env.NEXT_PUBLIC_SUPABASE_URL;
const CHAVE = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Cliente com a sessão do gestor logado (respeita as regras de acesso do banco).
export async function supabaseServidor() {
  const jar = await cookies();
  return createServerClient(URL_SUPABASE, CHAVE, {
    cookies: {
      getAll: () => jar.getAll(),
      setAll: lista => {
        try {
          lista.forEach(({ name, value, options }) => jar.set(name, value, options));
        } catch {
          // Em páginas (Server Components) não dá para gravar cookies; o middleware cuida disso.
        }
      }
    }
  });
}

// Cliente sem login, para as páginas públicas (teste pelo link e devolutiva).
export function supabasePublico() {
  return createClient(URL_SUPABASE, CHAVE, { auth: { persistSession: false } });
}

export async function usuarioAtual() {
  const supabase = await supabaseServidor();
  const { data } = await supabase.auth.getUser();
  return { supabase, user: data.user };
}
