// Cấu hình Azure TTS
// Bạn cần điền Key và Region từ Azure Portal vào đây
const AZURE_KEY = ''; // Ví dụ: 'a1b2c3d4...'
const AZURE_REGION = 'southeastasia'; // Ví dụ: 'southeastasia' hoặc 'eastus'

/**
 * Hàm gọi API Microsoft Azure Neural TTS
 */
let currentAudio: HTMLAudioElement | null = null;

export const stopSpeaking = () => {
  try {
    if (currentAudio) {
      currentAudio.pause();
      try { URL.revokeObjectURL(currentAudio.src); } catch (e) {}
      currentAudio = null;
    }
  } catch (e) {
    // ignore
  }
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
};

export const speakText = async (text: string): Promise<void> => {
  // 1. Kiểm tra nếu có Azure Key thì dùng Azure, không thì dùng Browser TTS
  if (!AZURE_KEY) {
    console.warn("Chưa có Azure Key, sử dụng Browser TTS dự phòng.");
    speakBrowserFallback(text);
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

    if (!response.ok) {
      throw new Error(`Azure TTS Error: ${response.statusText}`);
    }

    // Chuyển response thành Blob âm thanh và phát ngay lập tức
    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    // Stop any previous audio before playing new
    stopSpeaking();
    currentAudio = new Audio(audioUrl);
    currentAudio.onended = () => {
      try { URL.revokeObjectURL(audioUrl); } catch (e) {}
      currentAudio = null;
    };
    await currentAudio.play();

  } catch (error) {
    console.error("Lỗi khi gọi Azure TTS:", error);
    // Fallback về trình duyệt nếu Azure lỗi
    speakBrowserFallback(text);
  }
};

/**
 * Fallback sử dụng SpeechSynthesis của trình duyệt
 */
const speakBrowserFallback = (text: string) => {
  if ('speechSynthesis' in window) {
    // Hủy các lệnh đọc trước đó để đọc câu mới ngay lập tức
    window.speechSynthesis.cancel();
    // Also stop any existing audio
    try { if (currentAudio) { currentAudio.pause(); currentAudio = null; } } catch(e) {}

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'vi-VN';
    utterance.rate = 1.0; // Tốc độ bình thường

    // Cố gắng tìm giọng tiếng Việt Google hoặc Microsoft trong máy
    const voices = window.speechSynthesis.getVoices();
    const vnVoice = voices.find(v => v.lang.includes('vi') || v.name.includes('Vietnamese'));
    if (vnVoice) {
      utterance.voice = vnVoice;
    }

    window.speechSynthesis.speak(utterance);
  } else {
    alert("Trình duyệt của bạn không hỗ trợ đọc văn bản.");
  }
};