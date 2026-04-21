"use client";

import { useState, useEffect } from "react";

export default function VisitMetrics({ lang, t }) {
  const [total, setTotal] = useState("--");

  useEffect(() => {
    const isPt = lang === "pt";
    const unavailable = t.serviceUnavailable;

    async function fetchHits() {
      const namespace = "biblia-creio-v1"; // Novo ID para garantir que funcione
      const key = "total_visits";
      
      try {
        // Tenta incrementar e obter o valor
        const res = await fetch(`https://api.counterapi.dev/v1/${namespace}/${key}/up`);
        if (!res.ok) {
          // Se falhar o increment, tenta só ler
          const res2 = await fetch(`https://api.counterapi.dev/v1/${namespace}/${key}`);
          if (!res2.ok) return null;
          const data2 = await res2.json();
          return data2.count;
        }
        const data = await res.json();
        return data.count;
      } catch (e) {
        console.error("Counter error:", e);
        return null;
      }
    }

    fetchHits().then((count) => {
      if (count === null || count === undefined) {
        setTotal(unavailable);
      } else {
        setTotal(new Intl.NumberFormat(isPt ? "pt-BR" : "en-US").format(count));
      }
    });
  }, [lang]);

  return (
    <div className="support-metrics" aria-live="polite">
      <div className="metric-badge">
        <span className="metric-label">{t.visitCount}</span>
        <span className="metric-value">{total}</span>
      </div>
    </div>
  );
}
