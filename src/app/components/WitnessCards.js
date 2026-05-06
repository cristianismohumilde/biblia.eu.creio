import Link from "next/link";
import { translations } from "@/app/translations";
import { handleSpeak } from "@/app/utils/audio";

const RTL_LANGS = new Set(["hebrew", "aramaic", "syriac"]);

const manuscriptMap = {
  hebrew: [{ id: "leningradensis", key: "b19a", label: "Codex Leningradensis (B19A)" }],
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
  const t = translations[lang] || translations.pt;

  const langOrder = [
    { code: "hebrew", label: t.hebrew },
    { code: "greek", label: t.greek },
    { code: "aramaic", label: t.aramaic },
    { code: "latin", label: t.latin },
    { code: "geez", label: t.geez },
    { code: "syriac", label: t.syriac },
    { code: "coptic", label: t.coptic },
    { code: "armenian", label: t.armenian },
  ];

  const literalByLang = {};
  (data.literalTranslations || []).forEach((entry) => {
    if (entry && entry.lang) {
      literalByLang[entry.lang] = (lang === 'en' ? entry.en : entry.pt) || "";
    }
  });

  return (
    <div className="text-witnesses">
      {langOrder.map(lo => {
        const providedWitnesses = data[`${lo.code}Witnesses`] || [];
        const fallbackLiteral = literalByLang[lo.code] || "";
        const fallbackTransliteration = getTokenTransliterationByLang(data.tokens, lo.code);
        const sourceText = data.sourceTexts?.[lo.code];

        const witnesses = providedWitnesses.length > 0 
          ? providedWitnesses 
          : (sourceText || data[`${lo.code}Text`] ? [{
              id: "base",
              label: lo.label,
              text: sourceText || data[`${lo.code}Text`],
              transliteration: fallbackTransliteration,
              literalPt: fallbackLiteral,
            }] : []);

        if (witnesses.length === 0) return null;

        return (
          <div key={lo.code} className="language-group" style={{ marginBottom: '1.8rem' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '0.8rem', borderLeft: '5px solid var(--accent)', paddingLeft: '1rem', color: 'var(--accent)', fontWeight: 800 }}>
              {lo.label}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {witnesses.map(w => {
                const msInfo = manuscriptMap[lo.code]?.find(m => {
                  const label = (w.label || "").toLowerCase();
                  const id = (w.id || "").toLowerCase();
                  if (id === m.id || label.includes(m.id)) return true;
                  if (id === "base") {
                    if (lo.code === "hebrew" && m.key === "b19a") return true;
                    if (lo.code === "aramaic" && m.key === "targum") return true;
                    if (lo.code === "latin" && m.key === "vulgate") return true;
                    if (lo.code === "syriac" && m.key === "syriac") return true;
                    if (lo.code === "geez" && m.key === "geez") return true;
                    if (lo.code === "coptic" && m.key === "coptic") return true;
                    if (lo.code === "armenian" && m.key === "armenian") return true;
                    if (lo.code === "greek" && m.key === "lxx") return true;
                  }
                  if (m.key === "b19a" && label.includes("leningradensis")) return true;
                  if (m.key === "lxx" && label.includes("septuaginta")) return true;
                  if (m.key === "byzantine" && (label.includes("bizantina") || label.includes("byz"))) return true;
                  if (m.key === "targum" && label.includes("onkelos")) return true;
                  if (m.key === "geez" && (label.includes("etióp") || label.includes("ethiopic"))) return true;
                  return false;
                });

                const isCurrent = msInfo && msInfo.key === manuscript;

                // Lógica para evitar redundância de nomes
                const manuscriptNameFromData = (lang === 'en' ? data.manuscripts?.[`${lo.code}En`] : data.manuscripts?.[lo.code]);
                const isComparison = manuscriptNameFromData && (manuscriptNameFromData.includes("comparação") || manuscriptNameFromData.includes("comparison"));
                
                const manuscriptName = (isComparison && witnesses.length > 1 && w.label) 
                                       ? w.label 
                                       : (manuscriptNameFromData || 
                                          (data.tokens?.find(tk => tk.lang === lo.code)?.[lang === 'en' ? 'manuscriptEn' : 'manuscript']) ||
                                          w.label);
                
                // Se o nome do manuscrito for igual ao nome do idioma, ou contiver o idioma de forma redundante no início
                let cleanManuscriptName = manuscriptName || "";
                if (cleanManuscriptName.toLowerCase().startsWith(lo.label.toLowerCase() + ":")) {
                  cleanManuscriptName = cleanManuscriptName.split(":")[1].trim();
                }

                // O título do card deve ser o nome do manuscrito, a menos que ele seja nulo ou igual ao idioma
                const displayTitle = (cleanManuscriptName && cleanManuscriptName.toLowerCase() !== lo.label.toLowerCase()) 
                                     ? cleanManuscriptName 
                                     : (w.label !== lo.label ? w.label : null);

                return (
                  <article key={w.id} className={`text-witness ${isCurrent ? 'active-witness' : ''}`}>
                    <div className="text-witness-header" style={{ borderBottom: displayTitle ? '1px solid rgba(132, 111, 77, 0.12)' : 'none', paddingBottom: displayTitle ? '0.2rem' : '0' }}>
                      {displayTitle && <h3 className="text-witness-title" style={{ fontSize: '0.85rem', margin: 0 }}>{displayTitle}</h3>}
                      <button 
                        onClick={() => handleSpeak(w.text || sourceText || data[`${lo.code}Text`], lo.code)} 
                        className="audio-player-mini"
                        style={{ marginLeft: 'auto' }}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                        </svg>
                        {lang === 'pt' ? "Ouvir" : "Listen"}
                      </button>
                    </div>

                    <p className={`text-witness-text ${RTL_LANGS.has(lo.code) ? 'rtl' : ''}`} style={{ fontSize: '1.35rem', margin: '0.25rem 0 0.5rem' }}>
                      {w.text || t.noText}
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '0.75rem', borderTop: '1px solid rgba(132,111,77,0.1)', paddingTop: '0.6rem' }}>
                      <div>
                        <p className="text-witness-label">{t.transliteration}</p>
                        <p className="text-witness-transliteration" style={{ fontSize: '1.1rem' }}>{w.transliteration || fallbackTransliteration || t.noTranslit}</p>
                      </div>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <p className="text-witness-label">{t.literalTranslationLabel}</p>
                          <button 
                            onClick={() => handleSpeak((lang === 'en' ? w.literalEn : w.literalPt) || fallbackLiteral, lang)} 
                            className="audio-player-mini"
                            style={{ padding: '0.2rem 0.6rem', fontSize: '0.65rem' }}
                          >
                            🔊
                          </button>
                        </div>
                        <p className="text-witness-literal" style={{ fontSize: '1.15rem', fontWeight: 600 }}>{(lang === 'en' ? w.literalEn : w.literalPt) || fallbackLiteral || t.noLiteral}</p>
                      </div>
                    </div>

                    {msInfo && !isCurrent && (
                      <div className="manuscript-actions" style={{ marginTop: '1.2rem', paddingTop: '0.8rem', borderTop: '1px dashed rgba(132,111,77,0.2)' }}>
                        <Link 
                          href={`/${lang}/interlinear/${msInfo.key}/${data.ref.book.toLowerCase()}/${data.ref.chapter}?v=${data.ref.verse}`}
                          className="manuscript-cta"
                          style={{ maxWidth: '350px' }}
                        >
                          {t.interlinearComplete}
                        </Link>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
