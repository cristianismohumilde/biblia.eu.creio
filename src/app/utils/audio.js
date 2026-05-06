// CONFIGURAÇÃO AZURE SPEECH (Via Variáveis de Ambiente para maior segurança)
const AZURE_KEY = process.env.NEXT_PUBLIC_AZURE_SPEECH_KEY; 
const AZURE_REGION = process.env.NEXT_PUBLIC_AZURE_SPEECH_REGION || "eastus";

export const handleSpeak = async (text, langCode) => {
  if (typeof window === "undefined") return;

  // Mapeamento de vozes Neurais da Azure (Altíssima fidelidade)
  const voiceMap = {
    hebrew: { locale: 'he-IL', name: 'he-IL-AvriNeural' },
    greek: { locale: 'el-GR', name: 'el-GR-NestorasNeural' },
    latin: { locale: 'it-IT', name: 'it-IT-ElsaNeural' },
    pt: { locale: 'pt-BR', name: 'pt-BR-FranciscaNeural' },
    portuguese: { locale: 'pt-BR', name: 'pt-BR-FranciscaNeural' },
    en: { locale: 'en-US', name: 'en-US-JennyNeural' },
    english: { locale: 'en-US', name: 'en-US-JennyNeural' },
    aramaic: { locale: 'he-IL', name: 'he-IL-AvriNeural' },
    syriac: { locale: 'he-IL', name: 'he-IL-AvriNeural' }, // Usando Hebraico como proxy fonético
    geez: { locale: 'am-ET', name: 'am-ET-AmehaNeural' },
    armenian: { locale: 'hy-AM', name: 'hy-AM-AnahitNeural' }
  };

  // Conversor de Script Siríaco para Hebraico (Para que o motor consiga ler)
  const transliterateSyriac = (t) => {
    const sToH = {
      '\u0710':'\u05D0','\u0712':'\u05D1','\u0713':'\u05D2','\u0715':'\u05D3','\u0717':'\u05D4',
      '\u0718':'\u05D5','\u0719':'\u05D6','\u071A':'\u05D7','\u071B':'\u05D8','\u071D':'\u05D9',
      '\u071F':'\u05DB','\u0720':'\u05DC','\u0721':'\u05DE','\u0722':'\u05E0','\u0723':'\u05E1',
      '\u0725':'\u05E2','\u0726':'\u05E4','\u0728':'\u05E6','\u0729':'\u05E7','\u072A':'\u05E8',
      '\u072B':'\u05E9','\u072C':'\u05EA'
    };
    return t.split('').map(c => sToH[c] || c).join('');
  };

  const config = voiceMap[langCode.toLowerCase()] || { locale: 'en-US', name: 'en-US-JennyNeural' };
  let cleanText = text.replace(/[\u0591-\u05C7]/g, '').trim().slice(0, 5000);

  if (langCode.toLowerCase() === 'syriac') {
    cleanText = transliterateSyriac(cleanText);
  }

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
