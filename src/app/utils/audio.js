export const handleSpeak = (text, langCode) => {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  
  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  
  // Mapping of codes to BCP 47
  // Mapeamento expandido para aceitar códigos curtos ou nomes completos
  // Mapeamento com códigos modernos e legados (Hebraico iw/he)
  const voiceMap = {
    hebrew: 'iw', he: 'iw',
    greek: 'el', el: 'el',
    latin: 'la', la: 'la',
    pt: 'pt-BR', portuguese: 'pt-BR',
    en: 'en-US', english: 'en-US',
    aramaic: 'iw',
    syriac: 'ar',
    geez: 'am',
    armenian: 'hy'
  };

  const targetLang = voiceMap[langCode.toLowerCase()] || langCode;

  // 1. Sanitização do texto
  let cleanText = text
    .replace(/[\u0591-\u05C7]/g, '') 
    .trim()
    .slice(0, 200);

  // Toast de depuração
  const showToast = (msg) => {
    let toast = document.getElementById('audio-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'audio-toast';
      toast.style = "position:fixed; bottom:20px; left:50%; transform:translateX(-50%); background:rgba(0,0,0,0.9); color:#00ff00; padding:8px 16px; border-radius:20px; z-index:9999; font-size:12px; font-family:monospace; pointer-events:none; border:1px solid #00ff00;";
      document.body.appendChild(toast);
    }
    toast.textContent = `[${targetLang}] ${msg}`;
    toast.style.opacity = '1';
    setTimeout(() => { toast.style.opacity = '0'; }, 3000);
  };

  showToast(`TRYING CLOUD...`);

  // 2. Parar áudio anterior
  if (window._currentAudio) {
    window._currentAudio.pause();
    window._currentAudio = null;
  }

  // 3. Estratégia "Extension": Mimica uma extensão do Chrome (Muito mais permissiva)
  const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(cleanText)}&tl=${targetLang}&client=gtx&total=1&idx=0&textlen=${cleanText.length}`;
  
  const audio = new Audio();
  audio.src = url;
  window._currentAudio = audio;

  audio.play().catch(error => {
    console.error("❌ Cloud TTS Blocked:", error);
    showToast("FAIL: USING SYSTEM VOICE");
    
    // Fallback 2: SpeechSynthesis (Vozes locais)
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(cleanText);
      // Tenta mapear para códigos BCP47
      const bcp = { iw: 'he-IL', he: 'he-IL', el: 'el-GR', pt: 'pt-BR', en: 'en-US' };
      utterance.lang = bcp[targetLang] || targetLang;
      utterance.rate = 0.8;
      
      // Procura voz específica no sistema
      const voices = window.speechSynthesis.getVoices();
      const v = voices.find(v => v.lang.startsWith(targetLang) || v.lang.includes(targetLang));
      if (v) utterance.voice = v;

      window.speechSynthesis.speak(utterance);
    }
  });
};



export const SpeakerIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle' }}>
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
  </svg>
);
