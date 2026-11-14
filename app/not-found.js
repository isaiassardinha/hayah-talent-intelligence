import Link from "next/link";
export default function NaoEncontrado() {
  return (
    <div className="publica">
      <div className="card stack"><h2>Página não encontrada</h2><p>Confira se o link está completo.</p><p><Link href="/">Ir para o início</Link></p></div>
    </div>
  );
}
