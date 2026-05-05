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

  // Limpeza básica do texto para evitar problemas na URL (limite de ~200 caracteres)
  const cleanText = text.slice(0, 200).trim();

  // Tentativa 1: Google Translate TTS (Motor robusto)
  // Usando 'client=gtx' que é mais estável para requisições diretas
  const googleTtsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(cleanText)}&tl=${targetLang}&client=gtx&total=1&idx=0&textlen=${cleanText.length}`;
  
  console.log(`Tentando áudio para [${langCode}]: ${googleTtsUrl}`);

  const audio = new Audio(googleTtsUrl);
  
  audio.play().catch(err => {
    console.error("Erro ao reproduzir áudio via Google:", err);
    
    // Fallback: Web Speech API (Vozes locais do sistema)
    console.log("Tentando fallback para vozes locais...");
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
