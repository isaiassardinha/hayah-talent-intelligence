"use client";
import { useState } from "react";

// Botão de envio de formulário que pede uma segunda confirmação (ex.: excluir).
export default function BotaoConfirmar({ rotulo, confirmar = "Confirmar", aviso, className = "btn danger" }) {
  const [pedindo, setPedindo] = useState(false);
  if (!pedindo) return <button type="button" className={className} onClick={() => setPedindo(true)}>{rotulo}</button>;
  return (
    <span className="row">
      {aviso && <span className="small">{aviso}</span>}
      <button type="submit" className={className}>{confirmar}</button>
      <button type="button" className="btn" onClick={() => setPedindo(false)}>Cancelar</button>
    </span>
  );
}
