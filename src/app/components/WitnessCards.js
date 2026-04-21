import Link from "next/link";

const RTL_LANGS = new Set(["hebrew", "aramaic", "syriac"]);

const manuscriptMap = {
  hebrew: [
    { id: "leningradensis", key: "b19a", label: "Codex Leningradensis (B19A)" },
    { id: "aleppo", key: "aleppo", label: "Aleppo Codex (A)" },
    { id: "dead-sea-scrolls", key: "qumran", label: "Qumran (4QGen)" }
  ],
  greek: [
    { id: "lxx", key: "lxx", label: "Septuaginta (LXX)" },
    { id: "byzantine", key: "byzantine", label: "Tradição Bizantina" }
  ],
  aramaic: [{ id: "targum", key: "targum", label: "Targum Onkelos" }],
  latin: [{ id: "vulgate", key: "vulgate", label: "Vulgata" }],
  syriac: [{ id: "peshitta", key: "syriac", label: "Peshitta" }],
  geez: [{ id: "geez", key: "geez", label: "Ge'ez" }],
  coptic: [{ id: "coptic", key: "coptic", label: "Copta" }],
  armenian: [{ id: "armenian", key: "armenian", label: "Armênio" }]
};

const getTokenTransliterationByLang = (tokens = [], langCode) => {
  const transliteratedTokens = tokens
    .filter(
      (token) => token.lang === langCode && token.transliteration && token.transliteration !== "-",
    )
    .map((token) => token.transliteration.trim())
    .filter(Boolean);

  return transliteratedTokens.join(" ");
};

export default function WitnessCards({ lang, data, manuscript }) {
  if (!data) return null;

  const langOrder = [
    { code: "hebrew", label: "Hebraico" },
    { code: "aramaic", label: "Aramaico" },
    { code: "greek", label: "Grego" },
    { code: "latin", label: "Latim" },
    { code: "geez", label: "Ge'ez" },
    { code: "syriac", label: "Siríaco" },
    { code: "coptic", label: "Copta" },
    { code: "armenian", label: "Armênio" },
  ];

  const literalByLang = {};
  (data.literalTranslations || []).forEach((entry) => {
    if (entry && entry.lang) {
      literalByLang[entry.lang] = entry.pt || "";
    }
  });

  return (
    <div className="manuscripts">
      {langOrder.map(lo => {
        const providedWitnesses = data[`${lo.code}Witnesses`] || [];
        const fallbackLiteral = literalByLang[lo.code] || "";
        const fallbackTransliteration = getTokenTransliterationByLang(data.tokens, lo.code);
        const sourceText = data.sourceTexts?.[lo.code];

        const witnesses = providedWitnesses.length > 0 
          ? providedWitnesses 
          : (sourceText ? [{
              id: "base",
              label: `Fonte ${lo.label.toLowerCase()}`,
              text: sourceText,
              transliteration: fallbackTransliteration,
              literalPt: fallbackLiteral,
            }] : []);

        if (witnesses.length === 0) return null;

        return (
          <article key={lo.code}>
            <h3>{lo.label}</h3>
            <p className="manuscript-meta">{data.manuscripts?.[lo.code] || `Manuscrito/fonte (${lo.label}) não informado.`}</p>
            {witnesses.map(w => {
              const msInfo = manuscriptMap[lo.code]?.find(m => {
                if (m.id === w.id) return true;
                const label = (w.label || "").toLowerCase();
                return label.includes(m.id) || (m.key === "b19a" && label.includes("leningradensis"));
              });
              const isCurrent = msInfo && msInfo.key === manuscript;

              return (
                <div key={w.id} className={`text-witness ${isCurrent ? 'active-witness' : ''}`}>
                  <h4 className="text-witness-title">{w.label || `Fonte ${lo.label.toLowerCase()}`}</h4>
                  <p className={`text-witness-text ${RTL_LANGS.has(lo.code) ? 'rtl' : ''}`}>
                    {w.text || "Sem texto disponível."}
                  </p>
                  <p className="text-witness-label">Transliteração</p>
                  <p className="text-witness-transliteration">{w.transliteration || fallbackTransliteration || "Sem transliteração disponível."}</p>
                  <p className="text-witness-label">Tradução literal</p>
                  <p className="text-witness-literal">{w.literalPt || fallbackLiteral || "Sem tradução literal disponível."}</p>
                  
                  {msInfo && !isCurrent && (
                    <div className="manuscript-actions">
                      <Link 
                        href={`/${lang}/interlinear/${msInfo.key}/${data.ref.book.toLowerCase()}/${data.ref.chapter}/${data.ref.verse}`}
                        className="manuscript-cta"
                      >
                        Interlinear completo
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </article>
        );
      })}
    </div>
  );
}
