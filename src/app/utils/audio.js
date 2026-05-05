export const handleSpeak = (text, langCode) => {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  
  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  
  // Mapping of codes to BCP 47
  // Mapeamento expandido para aceitar códigos curtos ou nomes completos
  const voiceMap = {
    hebrew: 'he', he: 'he',
    greek: 'el', el: 'el',
    latin: 'la', la: 'la',
    pt: 'pt', portuguese: 'pt',
    en: 'en', english: 'en',
    syriac: 'ar', ar: 'ar',
    aramaic: 'he',
    geez: 'am', am: 'am',
    coptic: 'el',
    armenian: 'hy', hy: 'hy'
  };

  const targetLang = voiceMap[langCode.toLowerCase()] || langCode;

  // 1. Sanitização agressiva do texto
  let cleanText = text
    .replace(/[\u0591-\u05C7]/g, '') // Remove Niqqud/Cantilação Hebraica
    .replace(/[^\w\s\u00C0-\u00FF\u0590-\u05FF\u0370-\u03FF]/g, ' ') // Mantém apenas letras básicas, hebraicas e gregas
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 200);

  console.log(`🔊 [Audio] Lang: ${targetLang} | Original: ${langCode} | Text: ${cleanText.slice(0, 30)}...`);

  // Feedback visual (opcional, mas ajuda a depurar)
  const showToast = (msg) => {
    let toast = document.getElementById('audio-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'audio-toast';
      toast.style = "position:fixed; bottom:20px; left:50%; transform:translateX(-50%); background:rgba(0,0,0,0.8); color:white; padding:8px 16px; border-radius:20px; z-index:9999; font-size:12px; font-family:sans-serif; pointer-events:none; transition:opacity 0.3s;";
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.opacity = '1';
    setTimeout(() => { toast.style.opacity = '0'; }, 2000);
  };

  showToast(`${langCode.toUpperCase()}...`);

  // 2. Limpeza de instâncias anteriores
  if (window._currentAudio) {
    window._currentAudio.pause();
    window._currentAudio = null;
  }

  // 3. Técnica de Fetch + Blob URL (Bypassa restrições de alguns navegadores para áudio externo)
  const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(cleanText)}&tl=${targetLang}&client=tw-ob`;
  
  fetch(url)
    .then(response => {
      if (!response.ok) throw new Error("Google bloqueou a requisição");
      return response.blob();
    })
    .then(blob => {
      const blobUrl = URL.createObjectURL(blob);
      const audio = new Audio(blobUrl);
      window._currentAudio = audio;
      return audio.play();
    })
    .catch(error => {
      console.error("❌ Erro no streaming de áudio:", error);
      
      // Fallback final: Web Speech API (Vozes do Sistema)
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(cleanText);
        const bcp47 = { he: 'he-IL', el: 'el-GR', la: 'la', pt: 'pt-BR', en: 'en-US', ar: 'ar-SY', am: 'am-ET' };
        utterance.lang = bcp47[targetLang] || targetLang;
        utterance.rate = 0.8;
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
