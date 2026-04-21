"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootPage() {
  // Client-side redirection
  useEffect(() => {
    const userLang = navigator.language || navigator.userLanguage;
    if (userLang.startsWith("pt")) {
      window.location.href = "/pt/";
    } else {
      window.location.href = "/en/";
    }
  }, []);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontFamily: 'sans-serif' 
    }}>
      <p>Carregando / Loading...</p>
    </div>
  );
}
