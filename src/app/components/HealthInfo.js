"use client";

import { useState, useEffect } from "react";

export default function HealthInfo() {
  const [info, setInfo] = useState("Health: carregando...");

  useEffect(() => {
    const DATA_ROOT = "/data";
    
    async function loadHealthInfo() {
      try {
        const response = await fetch(`${DATA_ROOT}/health.json`, { cache: "no-store" });
        if (!response.ok) throw new Error("Falha ao carregar health.json");

        const health = await response.json();
        const generated = health.generatedAt
          ? new Date(health.generatedAt).toLocaleString("pt-BR", { timeZone: "UTC" }) + " UTC"
          : "n/d";

        setInfo(`Health: ${health.status || "n/d"} | versão ${health.version || "n/d"} | schema ${health.schemaVersion || "n/d"} | atualizado ${generated}`);
      } catch (error) {
        setInfo("Health: indisponível");
      }
    }

    loadHealthInfo();
  }, []);

  return <p className="health-info">{info}</p>;
}
