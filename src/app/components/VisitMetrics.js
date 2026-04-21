"use client";

import { useState, useEffect } from "react";

export default function VisitMetrics({ lang, t }) {
  const [total, setTotal] = useState("--");

  useEffect(() => {
    const isPt = lang === "pt";
    const unavailable = t.serviceUnavailable;

    async function fetchHits() {
      try {
        const res = await fetch("/api/hits");
        if (!res.ok) return null;
        const data = await res.json();
        return data.count;
      } catch (e) {
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
