// CONFIGURAÇÃO AZURE SPEECH (Via Variáveis de Ambiente para maior segurança)
const AZURE_KEY = process.env.NEXT_PUBLIC_AZURE_SPEECH_KEY; 
const AZURE_REGION = process.env.NEXT_PUBLIC_AZURE_SPEECH_REGION || "eastus";

export const handleSpeak = async (text, langCode) => {
  if (typeof window === "undefined") return;

  // Mapeamento de vozes Neurais da Azure (Altíssima fidelidade)
  const voiceMap = {
    hebrew: { locale: 'he-IL', name: 'he-IL-AvriNeural' },
    greek: { locale: 'el-GR', name: 'el-GR-NestorasNeural' },
    latin: { locale: 'it-IT', name: 'it-IT-ElsaNeural' }, // Usando Italiano como proxy para Latim (fonética similar)
    pt: { locale: 'pt-BR', name: 'pt-BR-FranciscaNeural' },
    portuguese: { locale: 'pt-BR', name: 'pt-BR-FranciscaNeural' },
    en: { locale: 'en-US', name: 'en-US-JennyNeural' },
    english: { locale: 'en-US', name: 'en-US-JennyNeural' },
    aramaic: { locale: 'he-IL', name: 'he-IL-AvriNeural' },
    syriac: { locale: 'ar-SY', name: 'ar-SY-AmanyNeural' },
    geez: { locale: 'am-ET', name: 'am-ET-AmehaNeural' },
    armenian: { locale: 'hy-AM', name: 'hy-AM-AnahitNeural' }
  };

  const config = voiceMap[langCode.toLowerCase()] || { locale: 'en-US', name: 'en-US-JennyNeural' };
  const cleanText = text.replace(/[\u0591-\u05C7]/g, '').trim().slice(0, 5000);

  const showToast = (msg) => {
    let toast = document.getElementById('audio-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'audio-toast';
      toast.style = "position:fixed; bottom:20px; left:50%; transform:translateX(-50%); background:rgba(0,0,0,0.9); color:#00ebff; padding:8px 16px; border-radius:20px; z-index:9999; font-size:12px; font-family:monospace; pointer-events:none; border:1px solid #00ebff;";
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.opacity = '1';
    setTimeout(() => { toast.style.opacity = '0'; }, 3000);
  };

  if (window._currentAudio) {
    window._currentAudio.pause();
    window._currentAudio = null;
  }

  // TENTATIVA 1: AZURE SPEECH SERVICE (Se houver chave)
  if (AZURE_KEY && AZURE_REGION) {
    showToast("AZURE NEURAL TTS...");
    try {
      const ssml = `
        <speak version='1.0' xml:lang='${config.locale}'>
          <voice xml:lang='${config.locale}' xml:gender='Female' name='${config.name}'>
            ${cleanText}
          </voice>
        </speak>`;

      const response = await fetch(`https://${AZURE_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`, {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': AZURE_KEY,
          'Content-Type': 'application/ssml+xml',
          'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3',
          'User-Agent': 'BibliaCreio'
        },
        body: ssml
      });

      if (!response.ok) throw new Error("Azure block or invalid key");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      window._currentAudio = audio;
      audio.play();
      return;
    } catch (err) {
      console.error("Erro Azure Speech:", err);
    }
  }

  // FALLBACK: GOOGLE FREE (Se Azure falhar ou não houver chave)
  showToast("TRYING GOOGLE CLOUD...");
  const freeUrl = `https://www.google.com/logos/fnbx/tts/tts?device=mobile&language=${config.locale.split('-')[0]}&text=${encodeURIComponent(cleanText)}`;
  const audio = new Audio(freeUrl);
  window._currentAudio = audio;
  audio.play().catch(() => {
    showToast("FAIL: USING SYSTEM VOICE");
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = config.locale;
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
