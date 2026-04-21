"use client";

import { useState, useEffect } from "react";

export default function VisitMetrics({ lang, t }) {
  const [total, setTotal] = useState("--");

  useEffect(() => {
    const namespace = "biblia-creio-eu";
    const KEY_TOTAL_VIEWS = "site-total-views";
    const isPt = lang === "pt";
    const unavailable = isPt ? "indisponível" : "unavailable";

    async function hitCounter(key) {
      try {
        const res = await fetch(`https://api.counterapi.dev/v1/${namespace}/${key}/up`);
        if (!res.ok) throw new Error("Request failed");
        const data = await res.json();
        return data && typeof data.count === "number" ? data.count : null;
      } catch (e) {
        return null;
      }
    }

    hitCounter(KEY_TOTAL_VIEWS).then((count) => {
      if (count === null) {
        setTotal(unavailable);
      } else {
        setTotal(new Intl.NumberFormat(isPt ? "pt-BR" : "en-US").format(count));
      }
    });
  }, [lang]);

  return (
    <div className="support-metrics" aria-live="polite">
      <p>
        <strong>{t.visitCount}</strong> <span>{total}</span>
      </p>
    </div>
  );
}
