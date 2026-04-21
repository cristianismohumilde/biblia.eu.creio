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
        if (!res.ok) {
          // If up fails, try to just get the current value
          const res2 = await fetch(`https://api.counterapi.dev/v1/${namespace}/${key}`);
          if (!res2.ok) return null;
          const data2 = await res2.json();
          return data2?.count || 0;
        }
        const data = await res.json();
        return data && typeof data.count === "number" ? data.count : null;
      } catch (e) {
        console.error("Counter error:", e);
        return null;
      }
    }

    // Only count if not on localhost to avoid inflating during dev
    const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    
    const countAction = isLocal 
      ? fetch(`https://api.counterapi.dev/v1/${namespace}/${KEY_TOTAL_VIEWS}`).then(r => r.json()).then(d => d.count).catch(() => null)
      : hitCounter(KEY_TOTAL_VIEWS);

    countAction.then((count) => {
      if (count === null) {
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
