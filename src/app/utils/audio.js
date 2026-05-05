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

  // 2. Limpeza de instâncias anteriores
  if (window._currentAudio) {
    window._currentAudio.pause();
    if (window._currentAudio.parentNode) {
      window._currentAudio.parentNode.removeChild(window._currentAudio);
    }
  }

  // 3. Criação do elemento de áudio no DOM (mais robusto que new Audio())
  const audio = document.createElement('audio');
  audio.style.display = 'none';
  // Endpoint gtx é mais permissivo com scripts externos
  const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(cleanText)}&tl=${targetLang}&client=gtx&ttsspeed=1`;
  
  audio.src = url;
  audio.setAttribute('autoplay', 'true');
  document.body.appendChild(audio);
  window._currentAudio = audio;

  const playPromise = audio.play();

  if (playPromise !== undefined) {
    playPromise.catch(error => {
      console.error("❌ Google TTS falhou:", error);
      
      // Fallback 2: Web Speech API (Vozes do Sistema)
      console.log("🔄 Tentando Fallback local...");
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(cleanText);
        const bcp47 = { he: 'he-IL', el: 'el-GR', la: 'la', pt: 'pt-BR', en: 'en-US', ar: 'ar-SY', am: 'am-ET' };
        utterance.lang = bcp47[targetLang] || targetLang;
        utterance.rate = 0.8;
        window.speechSynthesis.speak(utterance);
      }
    });
  }

  // Remove o elemento após terminar ou erro
  audio.onended = () => { if (audio.parentNode) audio.parentNode.removeChild(audio); };
};






export const SpeakerIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle' }}>
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
  </svg>
);
