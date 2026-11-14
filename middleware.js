import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

const PRIVADAS = ["/painel", "/pessoas", "/convites"];

// Renova a sessão do Supabase a cada visita e protege as páginas do gestor.
export async function middleware(request) {
  let resposta = NextResponse.next({ request });
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: lista => {
        lista.forEach(({ name, value }) => request.cookies.set(name, value));
        resposta = NextResponse.next({ request });
        lista.forEach(({ name, value, options }) => resposta.cookies.set(name, value, options));
      }
    }
  });
  const { data } = await supabase.auth.getUser();
  const caminho = request.nextUrl.pathname;
  if (!data.user && PRIVADAS.some(p => caminho.startsWith(p))) {
    const destino = request.nextUrl.clone();
    destino.pathname = "/entrar";
    destino.search = "";
    return NextResponse.redirect(destino);
  }
  return resposta;
}

export const config = {
  // Não roda nas páginas públicas (/t e /d) nem nos arquivos estáticos.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|t/|d/).*)"]
};
