"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function RootPage() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [sub, setSub] = useState("");
  const [manual, setManual] = useState("");
  const [next, setNext] = useState("");

  useEffect(() => {
    const userLang = (navigator.language || "en").toLowerCase();
    const targetLang = userLang.startsWith("pt") ? "pt" : "en";
    
    // On GitHub Pages, we MUST include the repository name (basePath)
    const basePath = "/biblia.eu.creio";
    const path = `${basePath}/${targetLang}/`;
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
      // Use window.location.replace for external-like redirect on static export
      window.location.replace(path);
    }, 9000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="welcome" aria-live="polite">
      <style jsx global>{`
        :root {
          --ink: #f7f4e8;
          --ink-soft: #d2c6a4;
          --bg-start: #112331;
          --bg-mid: #36466a;
          --bg-end: #8b5a2b;
          --tech-cyan: #86e8ff;
        }

        .welcome {
          min-height: 100vh;
          display: grid;
          place-items: center;
          padding: 1.5rem;
          color: var(--ink);
          background:
            radial-gradient(70vw 45vh at 20% 30%, rgba(234, 194, 122, 0.28), transparent 70%),
            radial-gradient(65vw 40vh at 80% 72%, rgba(96, 126, 204, 0.35), transparent 72%),
            linear-gradient(135deg, var(--bg-start), var(--bg-mid) 48%, var(--bg-end));
          font-family: "Palatino Linotype", "Book Antiqua", Palatino, serif;
          position: fixed;
          inset: 0;
          z-index: 9999;
        }

        .panel {
          position: relative;
          width: min(860px, 100%);
          text-align: center;
          border: 1px solid rgba(247, 244, 232, 0.35);
          background: rgba(17, 23, 41, 0.54);
          backdrop-filter: blur(8px);
          border-radius: 18px;
          padding: clamp(1.4rem, 3.8vw, 3rem);
          box-shadow:
            0 18px 40px rgba(6, 9, 19, 0.5),
            inset 0 0 0 1px rgba(134, 232, 255, 0.14);
        }

        .eyebrow {
          margin: 0 0 1rem;
          font-size: clamp(0.85rem, 2vw, 1rem);
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--ink-soft);
          text-shadow: 0 0 12px rgba(134, 232, 255, 0.18);
        }

        h1 {
          margin: 0;
          font-size: clamp(1.45rem, 4.7vw, 3.2rem);
          line-height: 1.2;
          min-height: 3.6em;
          text-shadow: 0 0 22px rgba(134, 232, 255, 0.18);
        }

        .typing-caret {
          display: inline-block;
          margin-left: 0.2rem;
          opacity: 0.8;
          animation: blink 0.8s steps(1, end) infinite;
        }

        .sub {
          margin: 1rem 0 0;
          color: var(--ink-soft);
          font-size: clamp(0.95rem, 2.2vw, 1.1rem);
        }

        .progress {
          height: 6px;
          width: min(420px, 78vw);
          margin: 1.35rem auto 0;
          border-radius: 999px;
          background: rgba(247, 244, 232, 0.2);
          overflow: hidden;
        }

        .progress > span {
          display: block;
          height: 100%;
          width: 100%;
          transform-origin: left center;
          background: linear-gradient(90deg, #f2ca88, #f6ead1);
          animation: load 9s linear forwards;
        }

        .manual {
          margin-top: 1.15rem;
          font-size: 0.95rem;
        }

        .manual a {
          color: #fff0c8;
          text-decoration: underline;
        }

        @keyframes blink {
          50% { opacity: 0; }
        }

        @keyframes load {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
      `}</style>
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
    </main>
  );
}
