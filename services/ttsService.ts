// Cấu hình Azure TTS (điền nếu muốn dùng dịch vụ Azure)
const AZURE_KEY = '';
const AZURE_REGION = 'southeastasia';

let _currentAudio: HTMLAudioElement | null = null;
let _currentAudioUrl: string | null = null;
let _currentUtterance: SpeechSynthesisUtterance | null = null;

const clearCurrentAudio = () => {
  if (_currentAudio) {
    try {
      _currentAudio.pause();
      _currentAudio.src = '';
    } catch (e) {
      // ignore
    }
    _currentAudio = null;
  }
  if (_currentAudioUrl) {
    try { URL.revokeObjectURL(_currentAudioUrl); } catch (e) { }
    _currentAudioUrl = null;
  }
};

const clearCurrentUtterance = () => {
  if (_currentUtterance && 'speechSynthesis' in window) {
    try { window.speechSynthesis.cancel(); } catch (e) { }
  }
  _currentUtterance = null;
};

/**
 * Stop any ongoing speech (Azure audio or browser SpeechSynthesis)
 */
export const stopSpeaking = () => {
  clearCurrentAudio();
  clearCurrentUtterance();
};

/**
 * Speak text. This will first stop any ongoing speech and then start new one.
 * Returns a Promise that resolves once playback starts (not when finished).
 */
export const speak = async (text: string): Promise<void> => {
  // stop any previous
  stopSpeaking();

  // If no Azure key, use browser fallback
  if (!AZURE_KEY) {
    speakBrowser(text);
    return;
  }

  try {
    const endpoint = `https://${AZURE_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`;
    const ssml = `
      <speak version='1.0' xml:lang='vi-VN'>
        <voice xml:lang='vi-VN' xml:gender='Female' name='vi-VN-HoaiMyNeural'>
          ${text}
        </voice>
      </speak>`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': AZURE_KEY,
        'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3',
        'User-Agent': 'LawMasterApp'
      },
      body: ssml
    });

    if (!response.ok) throw new Error('Azure TTS failed');

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    _currentAudioUrl = audioUrl;
    _currentAudio = new Audio(audioUrl);
    _currentAudio.onended = () => {
      clearCurrentAudio();
    };
    await _currentAudio.play();
  } catch (err) {
    console.error('Azure TTS error, falling back to browser TTS', err);
    speakBrowser(text);
  }
};

/**
 * Browser SpeechSynthesis wrapper that tracks current utterance
 */
const speakBrowser = (text: string) => {
  if (!('speechSynthesis' in window)) {
    alert('Trình duyệt của bạn không hỗ trợ đọc văn bản.');
    return;
  }

  // cancel previous utterances
  try { window.speechSynthesis.cancel(); } catch (e) { }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'vi-VN';
  utterance.rate = 1.0;

  const voices = window.speechSynthesis.getVoices();
  const vnVoice = voices.find(v => v.lang.includes('vi') || v.name.includes('Vietnamese'));
  if (vnVoice) utterance.voice = vnVoice;

  utterance.onend = () => {
    _currentUtterance = null;
  };

  _currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
};

// Backward compatibility
export const speakText = speak;

export default speak;