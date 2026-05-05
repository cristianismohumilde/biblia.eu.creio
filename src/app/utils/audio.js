export const handleSpeak = (text, langCode) => {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  
  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  
  // Mapping of codes to BCP 47
  const voiceMap = {
    hebrew: 'he',
    greek: 'el',
    latin: 'la', 
    pt: 'pt',
    en: 'en',
    syriac: 'ar',
    aramaic: 'he',
    geez: 'am', 
    coptic: 'el',
    armenian: 'hy'
  };

  const targetLang = voiceMap[langCode] || langCode;

  // 1. Limpeza do texto: remove sinais massoréticos e de cantilação (importante para o Hebraico)
  // O motor do Google entende melhor o texto "limpo" (consonantal)
  let cleanText = text;
  if (targetLang === 'he' || langCode === 'hebrew') {
    cleanText = text.replace(/[\u0591-\u05C7]/g, '');
  }
  cleanText = cleanText.slice(0, 250).trim();

  // 2. Para qualquer áudio em andamento para evitar sobreposição
  if (window._currentAudio) {
    window._currentAudio.pause();
    window._currentAudio.src = "";
  }
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }

  // 3. Tentativa 1: Google TTS com endpoint de alta compatibilidade
  const googleTtsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(cleanText)}&tl=${targetLang}&client=tw-ob&ttsspeed=1`;
  
  console.log(`🔊 Reproduzindo [${targetLang}]: ${cleanText.slice(0, 20)}...`);

  const audio = new Audio();
  window._currentAudio = audio; // Salva globalmente para controle
  audio.src = googleTtsUrl;
  
  audio.play().catch(err => {
    console.error("❌ Erro Google TTS:", err);
    
    // Fallback: Web Speech API (Vozes locais)
    const utterance = new SpeechSynthesisUtterance(cleanText);
    const bcp47Map = {
      he: 'he-IL', el: 'el-GR', la: 'la', pt: 'pt-BR', en: 'en-US', ar: 'ar-SY'
    };
    utterance.lang = bcp47Map[targetLang] || targetLang;
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  });
};





export const SpeakerIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle' }}>
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
  </svg>
);
