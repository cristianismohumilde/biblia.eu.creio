"use client";

import { useEffect, useState } from "react";
import "./welcome.css";
import CookieConsentBanner from "./components/CookieConsentBanner";

export default function RootPage() {
  const [text, setText] = useState("");
  const [sub, setSub] = useState("");
  const [manual, setManual] = useState("");
  const [next, setNext] = useState("");

  useEffect(() => {
    const userLang = (navigator.language || "en").toLowerCase();
    const targetLang = userLang.startsWith("pt") ? "pt" : "en";
    
    // Custom domain support: root path
    const path = `/${targetLang}/`;
    setNext(path);

    const copy = {
      pt: {
        title: "Boas-vindas à melhor plataforma de consulta e estudos bíblicos!",
        subtitle: "Entrando na versão em português...",
        manual: "Continuar para português"
      },
      en: {
        title: "Welcome to the best Bible consultation and study platform!",
        subtitle: "Entering the English experience...",
        manual: "Continue to English"
      }
    };

    const currentCopy = copy[targetLang];
    setSub(currentCopy.subtitle);
    setManual(currentCopy.manual);

    let i = 0;
    const typeDelay = 78;
    const type = () => {
      setText(currentCopy.title.slice(0, i));
      i += 1;
      if (i <= currentCopy.title.length) {
        setTimeout(type, typeDelay);
      }
    };
    
    type();

    const timer = setTimeout(() => {
      window.location.replace(path);
    }, 9000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="welcome" aria-live="polite">
      <section className="panel" aria-label="Welcome">
        <p className="eyebrow">Biblia.Creio.EU</p>
        <h1>
          <span>{text}</span><span className="typing-caret" aria-hidden="true">|</span>
        </h1>
        <p className="sub">{sub}</p>
        <div className="progress" aria-hidden="true"><span></span></div>
        <p className="manual">
          <a href={next}>{manual}</a>
        </p>
      </section>
      
      {/* Exibe o banner já na tela de boas-vindas usando o idioma detectado */}
      {next && <CookieConsentBanner lang={next.replace(/\//g, "") || "pt"} />}
    </main>
  );
}
