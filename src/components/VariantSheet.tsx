import type { Exercice, VarianteState } from "../types";

const CONTRAINTE_LABEL: Record<string, { txt: string; cls: string }> = {
  aucune: { txt: "Épaule : aucune contrainte", cls: "c-aucune" },
  faible: { txt: "Épaule : contrainte faible", cls: "c-faible" },
  "modérée": { txt: "Épaule : contrainte modérée", cls: "c-moderee" },
  "élevée": { txt: "Épaule : contrainte élevée", cls: "c-elevee" }
};

export function VariantSheet({
  exo,
  varianteActive,
  etatParVariante = {},
  onChoisir,
  onFermer
}: {
  exo: Exercice;
  varianteActive: string;
  etatParVariante?: Record<string, VarianteState>;
  onChoisir: (id: string) => void;
  onFermer: () => void;
}) {
  const triees = [...exo.variantes].sort((a, b) => a.rang - b.rang);
  return (
    <div className="sheet-backdrop" onClick={onFermer}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-head">
          <h3>Variantes — {exo.nom}</h3>
          <button className="btn btn-ghost" onClick={onFermer}>✕</button>
        </div>
        <div className="sheet-body">
          {triees.map((v) => {
            const c = CONTRAINTE_LABEL[v.contrainte];
            return (
              <div key={v.id} className={`variante ${v.interdit ? "variante-interdite" : ""}`}>
                <div className="variante-infos">
                  <div className="variante-titre">
                    {v.interdit ? "🚫" : `${v.rang}.`} {v.nom}
                    {v.id === varianteActive && <span className="badge badge-ok"> active</span>}
                  </div>
                  {(v.machine || v.materiel) && <div className="muted">{v.machine ?? v.materiel}</div>}
                  {!exo.sansCharge && !v.interdit && (
                    <div className="muted small">
                      {etatParVariante[v.id]?.derniereCharge !== undefined
                        ? `Dernière charge : ${etatParVariante[v.id].derniereCharge} kg`
                        : "Jamais utilisée — charge à calibrer"}
                    </div>
                  )}
                  <div className={`contrainte ${c.cls}`}>{c.txt}</div>
                  {v.note && <div className="muted small">{v.note}</div>}
                </div>
                {!v.interdit && v.id !== varianteActive && (
                  <button className="btn btn-sm btn-primary" onClick={() => onChoisir(v.id)}>
                    Choisir
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
