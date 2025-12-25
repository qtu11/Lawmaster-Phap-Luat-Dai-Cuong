// Cấu hình Azure TTS
// Bạn cần điền Key và Region từ Azure Portal vào đây
const AZURE_KEY = ''; // Ví dụ: 'a1b2c3d4...'
const AZURE_REGION = 'southeastasia'; // Ví dụ: 'southeastasia' hoặc 'eastus'

/**
 * Hàm gọi API Microsoft Azure Neural TTS
 */
let currentAudio: HTMLAudioElement | null = null;

/**
 * Xử lý và làm sạch text để phát âm tự nhiên hơn
 */
const normalizeTextForSpeech = (text: string): string => {
  let normalized = text;
  
  // Loại bỏ các ký tự đặc biệt không cần thiết
  normalized = normalized.replace(/[\(\)\[\]]/g, ' ');
  
  // Chuẩn hóa dấu chấm câu
  normalized = normalized.replace(/\.{2,}/g, '.');
  
  // Thêm khoảng trắng sau dấu câu nếu thiếu
  normalized = normalized.replace(/([.,!?])([^\s])/g, '$1 $2');
  
  // Loại bỏ khoảng trắng thừa
  normalized = normalized.replace(/\s+/g, ' ').trim();
  
  // Xử lý các từ viết tắt phổ biến trong pháp luật
  normalized = normalized.replace(/\bPL\b/gi, 'pháp luật');
  normalized = normalized.replace(/\bNN\b/gi, 'nhà nước');
  
  return normalized;
};

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
    
    // Normalize text trước khi tạo SSML
    const normalizedText = normalizeTextForSpeech(text);
    
    // Escape XML special characters
    const escapedText = normalizedText
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
    
    // Sử dụng giọng nói tự nhiên hơn với prosody (nhịp điệu) và break (ngắt nghỉ)
    const ssml = `
      <speak version='1.0' xml:lang='vi-VN'>
        <voice xml:lang='vi-VN' xml:gender='Female' name='vi-VN-HoaiMyNeural'>
          <prosody rate="0.95" pitch="+0Hz">
            ${escapedText}
          </prosody>
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

    // Normalize text trước khi đọc
    const normalizedText = normalizeTextForSpeech(text);

    const utterance = new SpeechSynthesisUtterance(normalizedText);
    utterance.lang = 'vi-VN';
    utterance.rate = 0.9; // Tốc độ hơi chậm để rõ ràng hơn
    utterance.pitch = 1.0; // Độ cao giọng bình thường
    utterance.volume = 1.0; // Âm lượng tối đa

    // Đợi voices load (nếu chưa có)
    const setVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      // Ưu tiên giọng Google Vietnamese hoặc Microsoft Vietnamese
      let vnVoice = voices.find(v => 
        v.name.includes('Vietnamese') || 
        v.name.includes('vi-VN') ||
        (v.lang.includes('vi') && v.name.includes('Google'))
      );
      
      // Nếu không tìm thấy, tìm bất kỳ giọng tiếng Việt nào
      if (!vnVoice) {
        vnVoice = voices.find(v => v.lang.includes('vi'));
      }
      
      if (vnVoice) {
        utterance.voice = vnVoice;
      }
    };

    // Thử set voice ngay lập tức
    setVoice();
    
    // Nếu chưa có voices, đợi voiceschanged event
    if (window.speechSynthesis.getVoices().length === 0) {
      const voicesChanged = () => {
        setVoice();
        window.speechSynthesis.onvoiceschanged = null;
      };
      window.speechSynthesis.onvoiceschanged = voicesChanged;
    }

    window.speechSynthesis.speak(utterance);
  } else {
    alert("Trình duyệt của bạn không hỗ trợ đọc văn bản.");
  }
};