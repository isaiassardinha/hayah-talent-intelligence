"use client";
import { useState } from "react";

export default function CopiarBotao({ texto, rotulo = "Copiar", className = "btn small" }) {
  const [ok, setOk] = useState(false);
  async function copiar() {
    try {
      await navigator.clipboard.writeText(texto);
      setOk(true);
      setTimeout(() => setOk(false), 1800);
    } catch {
      window.prompt("Copie o texto:", texto);
    }
  }
  return <button type="button" className={className} onClick={copiar}>{ok ? "Copiado" : rotulo}</button>;
}
