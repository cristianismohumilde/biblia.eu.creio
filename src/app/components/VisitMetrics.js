"use client";

import { useState, useEffect } from "react";

export default function VisitMetrics({ lang, t }) {
  const [total, setTotal] = useState("--");

  useEffect(() => {
    const namespace = "biblia-eu-creio-prod"; // Updated namespace
    const KEY_TOTAL_VIEWS = "hits";
    const isPt = lang === "pt";

    async function hitCounter(key) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout
        
        const res = await fetch(`https://api.counterapi.dev/v1/${namespace}/${key}/up`, { 
          signal: controller.signal 
        });
        clearTimeout(timeoutId);

        if (!res.ok) {
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

    const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    
    const countAction = isLocal 
      ? Promise.resolve(2450) // Simulation for local dev
      : hitCounter(KEY_TOTAL_VIEWS);

    countAction.then((count) => {
      if (count === null || count === undefined) {
        setTotal(isPt ? "indisponível" : "unavailable");
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
