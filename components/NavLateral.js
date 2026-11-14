"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ITENS = [
  ["/painel", "Painel", <><rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" /><rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" /></>],
  ["/convites", "Testes e convites", <><rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 4h6v3H9zM9 12h6M9 16h4" /></>]
];

export default function NavLateral() {
  const caminho = usePathname();
  return (
    <nav aria-label="Seções">
      {ITENS.map(([href, rotulo, icone]) => {
        const atual = caminho === href || (href === "/painel" && caminho.startsWith("/pessoas"));
        return (
          <Link key={href} href={href} aria-current={atual ? "page" : undefined}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icone}</svg>
            {rotulo}
          </Link>
        );
      })}
    </nav>
  );
}
