import Link from "next/link";
import { translations } from "@/app/translations";

const RTL_LANGS = new Set(["hebrew", "aramaic", "syriac"]);

const manuscriptMap = {
  hebrew: [
    { id: "leningradensis", key: "b19a", label: "Codex Leningradensis (B19A)" }
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
              label: lo.label,
              text: sourceText,
              transliteration: fallbackTransliteration,
              literalPt: fallbackLiteral,
            }] : []);

        if (witnesses.length === 0) return null;

        return (
          <article key={lo.code}>
            <h3>{lo.label}</h3>
            <p className="manuscript-meta">{ (lang === 'en' ? data.manuscripts?.[`${lo.code}En`] : data.manuscripts?.[lo.code]) || `Manuscript/source (${lo.label}) not informed.`}</p>
            {witnesses.map(w => {
              const msInfo = manuscriptMap[lo.code]?.find(m => {
                const label = (w.label || "").toLowerCase();
                const id = (w.id || "").toLowerCase();
                if (id === m.id || label.includes(m.id)) return true;
                if (id === "base") {
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

              return (
                <div key={w.id} className={`text-witness ${isCurrent ? 'active-witness' : ''}`}>
                  <p className={`text-witness-text ${RTL_LANGS.has(lo.code) ? 'rtl' : ''}`}>
                    {w.text || t.noText}
                  </p>
                  <p className="text-witness-label">{t.transliteration}</p>
                  <p className="text-witness-transliteration">{w.transliteration || fallbackTransliteration || t.noTranslit}</p>
                  <p className="text-witness-label">{t.literalTranslationLabel}</p>
                  <p className="text-witness-literal">{(lang === 'en' ? w.literalEn : w.literalPt) || fallbackLiteral || t.noLiteral}</p>
                  
                  {msInfo && !isCurrent && (
                    <div className="manuscript-actions">
                      <Link 
                        href={`/${lang}/interlinear/${msInfo.key}/${data.ref.book.toLowerCase()}/${data.ref.chapter}/${data.ref.verse}`}
                        className="manuscript-cta"
                      >
                        {t.interlinearComplete}
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
