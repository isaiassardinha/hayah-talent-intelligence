import { NextResponse } from "next/server";
import { supabaseServidor } from "@/lib/supabase/server";

// Link de confirmação do e-mail: troca o código pela sessão e leva ao painel.
export async function GET(request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  if (code) {
    const supabase = await supabaseServidor();
    await supabase.auth.exchangeCodeForSession(code);
  }
  return NextResponse.redirect(new URL("/painel", url.origin));
}
