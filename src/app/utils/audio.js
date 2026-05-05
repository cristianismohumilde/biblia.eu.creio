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
    aramaic: 'ar',
    geez: 'am', 
    coptic: 'el',
    armenian: 'hy'
  };

  const targetLang = voiceMap[langCode] || langCode;

  // Tentativa 1: Google Translate TTS (Alta qualidade, funciona em qualquer lugar)
  // Nota: 'client=tw-ob' é necessário para uso público sem chave de API
  const googleTtsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${targetLang}&client=tw-ob`;
  
  const audio = new Audio(googleTtsUrl);
  
  audio.play().catch(err => {
    console.warn("Google TTS falhou, tentando fallback local:", err);
    
    // Fallback: Web Speech API (Vozes do sistema)
    const utterance = new SpeechSynthesisUtterance(text);
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
