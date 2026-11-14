// Devolutiva da pessoa: nunca mostra as áreas não indicadas nem as notas.
export default function Devolutiva({ fb }) {
  const comFormacao = (fb.areas || []).filter(a => a.formacao && a.formacao.length);
  return (
    <div className="devolutiva stack" style={{ gap: 6 }}>
      <p>{fb.intro}</p>
      <h3>Seu jeito de trabalhar</h3>
      <ul>{(fb.perfil || []).map((x, i) => <li key={i}>{x}</li>)}</ul>
      <h3>Seus pontos fortes</h3>
      <p>{(fb.fortes || []).join(", ")}.</p>
      <h3>Pontos para desenvolver</h3>
      <p>{(fb.desenvolver || []).join(", ")}.</p>
      {fb.interesses && fb.interesses.length > 0 && (<>
        <h3>O que mais te atrai</h3>
        <p>Atividades de {fb.interesses.join(" e de ")}.</p>
      </>)}
      {fb.lideranca && (<>
        <h3>Liderança</h3>
        <p>{fb.lideranca.texto}</p>
      </>)}
      <h3>Áreas em que seu perfil tende a render mais</h3>
      {fb.aviso && <p className="small">{fb.aviso}</p>}
      <ol style={{ margin: "4px 0 0", paddingLeft: 20 }}>
        {(fb.areas || []).map((a, i) => <li key={i}>{a.dept} <span className="muted">(por exemplo, {a.funcao})</span></li>)}
      </ol>
      {comFormacao.length > 0 && (<>
        <h3>Caminhos de formação</h3>
        <ul>{comFormacao.map((a, i) => <li key={i}><b>{a.dept}:</b> {a.formacao.join("; ")}</li>)}</ul>
      </>)}
      {fb.cursos && fb.cursos.length > 0 && (<>
        <h3>Cursos para desenvolver</h3>
        <p>Procure cursos de {fb.cursos.join(" e de ")}.</p>
      </>)}
      <p className="small muted" style={{ marginTop: 12 }}>Este resultado é uma orientação, não um rótulo. Ele mostra tendências, e todo mundo pode desenvolver qualquer competência.</p>
    </div>
  );
}
