// Cấu hình Gemini API
// Lấy API Key từ: https://aistudio.google.com/app/apikey
// Có thể đặt trong file .env với tên VITE_GEMINI_API_KEY hoặc đặt trực tiếp ở đây
const GEMINI_API_KEY = (import.meta as any).env?.VITE_GEMINI_API_KEY || ''; // Hoặc đặt trực tiếp: 'your-api-key-here'

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

/**
 * Audio element để phát âm thanh
 */
let currentAudio: HTMLAudioElement | null = null;

/**
 * Xử lý và làm sạch text để phát âm tiếng Việt tự nhiên hơn
 */
const normalizeTextForSpeech = (text: string): string => {
  let normalized = text;
  
  // Xử lý các từ viết tắt phổ biến trong pháp luật TRƯỚC khi làm sạch
  const abbreviations: Record<string, string> = {
    'PL': 'pháp luật',
    'NN': 'nhà nước',
    'QH': 'Quốc hội',
    'CP': 'Chính phủ',
    'UBND': 'Ủy ban nhân dân',
    'HĐND': 'Hội đồng nhân dân',
    'TAND': 'Tòa án nhân dân',
    'VKSND': 'Viện kiểm sát nhân dân',
    'BLHS': 'Bộ luật hình sự',
    'BLDS': 'Bộ luật dân sự',
    'LĐLĐ': 'Lao động',
    'ĐK': 'đăng ký',
    'KT': 'kinh tế',
    'XH': 'xã hội',
    'VN': 'Việt Nam',
    'VNCH': 'Việt Nam Cộng hòa',
    'CHXHCN': 'Cộng hòa xã hội chủ nghĩa',
    'ĐCS': 'Đảng Cộng sản',
    'CT': 'chính trị',
    'TP': 'thành phố',
    'Tp': 'thành phố',
    'TP.': 'thành phố',
    'Tp.': 'thành phố',
    'TT': 'thị trấn',
    'X': 'xã',
    'P': 'phường',
    'Q': 'quận',
    'H': 'huyện',
    'T': 'tỉnh',
    'Đ': 'điều',
    'K': 'khoản',
    'Điều': 'Điều',
    'Khoản': 'Khoản',
  };
  
  // Xử lý các từ tiếng Anh phổ biến - chuyển sang phiên âm hoặc tiếng Việt
  const englishWords: Record<string, string> = {
    'AI': 'trí tuệ nhân tạo',
    'API': 'ây pi ai',
    'TTS': 'ti ti ét',
    'PDF': 'pê đê ép',
    'HTML': 'hát tê em en',
    'CSS': 'xê ét ét',
    'JS': 'giê ét',
    'URL': 'u en en',
    'HTTP': 'hát tê tê pê',
    'HTTPS': 'hát tê tê pê ét',
    'CEO': 'xê i ô',
    'GDP': 'gi đê pê',
    'WTO': 'đáp bu liu ti ô',
    'UN': 'liên hợp quốc',
    'EU': 'liên minh châu âu',
    'USA': 'hoa kỳ',
    'UK': 'vương quốc anh',
  };
  
  // Thay thế từ viết tắt (có dấu chấm và không có dấu chấm)
  Object.entries(abbreviations).forEach(([abbr, full]) => {
    const regex = new RegExp(`\\b${abbr.replace(/\./g, '\\.')}\\b`, 'gi');
    normalized = normalized.replace(regex, full);
  });
  
  // Thay thế từ tiếng Anh phổ biến
  Object.entries(englishWords).forEach(([eng, vn]) => {
    const regex = new RegExp(`\\b${eng}\\b`, 'gi');
    normalized = normalized.replace(regex, vn);
  });
  
  // Xử lý số đếm và số thứ tự
  normalized = normalized.replace(/\b(\d+)\s*\./g, (match, num) => {
    const number = parseInt(num);
    if (number <= 20) {
      const numbers = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín', 
                       'mười', 'mười một', 'mười hai', 'mười ba', 'mười bốn', 'mười lăm', 
                       'mười sáu', 'mười bảy', 'mười tám', 'mười chín', 'hai mươi'];
      return numbers[number] + ' ';
    }
    return match;
  });
  
  // Xử lý số năm
  normalized = normalized.replace(/\b(19|20)\d{2}\b/g, (match) => {
    return match.split('').join(' '); // Đọc từng chữ số
  });
  
  // Xử lý phần trăm
  normalized = normalized.replace(/(\d+)\s*%/g, '$1 phần trăm');
  
  // Xử lý dấu ngoặc đơn - thay bằng dấu phẩy
  normalized = normalized.replace(/\(([^)]+)\)/g, ', $1,');
  
  // Xử lý dấu ngoặc vuông - loại bỏ
  normalized = normalized.replace(/\[([^\]]+)\]/g, '$1');
  
  // Xử lý dấu gạch ngang
  normalized = normalized.replace(/\s*-\s*/g, ' ');
  
  // Chuẩn hóa dấu chấm câu
  normalized = normalized.replace(/\.{2,}/g, '.');
  normalized = normalized.replace(/…/g, '.');
  
  // Thêm khoảng trắng sau dấu câu nếu thiếu
  normalized = normalized.replace(/([.,!?;:])([^\s])/g, '$1 $2');
  
  // Xử lý dấu phẩy - thêm ngắt nghỉ ngắn
  normalized = normalized.replace(/,/g, ', ');
  
  // Loại bỏ khoảng trắng thừa
  normalized = normalized.replace(/\s+/g, ' ').trim();
  
  // Xử lý các ký tự đặc biệt còn lại
  normalized = normalized.replace(/[“”]/g, '"');
  normalized = normalized.replace(/['']/g, "'");
  normalized = normalized.replace(/[–—]/g, '-');
  
  // Đảm bảo có dấu chấm cuối câu
  if (normalized && !/[.!?]$/.test(normalized.trim())) {
    normalized = normalized.trim() + '.';
  }
  
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

/**
 * Sử dụng Gemini API để cải thiện text trước khi đọc
 * Gemini sẽ rewrite text để dễ đọc và tự nhiên hơn cho TTS
 */
const improveTextWithGemini = async (text: string): Promise<string> => {
  if (!GEMINI_API_KEY) {
    return text; // Nếu không có key, trả về text gốc
  }

  try {
    const prompt = `Bạn là trợ lý ảo LawMaster chuyên cải thiện văn bản để đọc tự nhiên bằng giọng nói.

Nhiệm vụ: Viết lại đoạn văn bản sau để dễ đọc và tự nhiên hơn khi phát âm bằng TTS tiếng Việt.

Quy tắc:
1. Chỉ trả lời bằng tiếng Việt, không dùng tiếng Anh
2. Viết câu ngắn, sau mỗi 10-15 từ phải có dấu phẩy (,) hoặc dấu chấm (.)
3. Thay thế từ viết tắt bằng từ đầy đủ (ví dụ: PL → pháp luật, NN → nhà nước)
4. Thay từ tiếng Anh bằng phiên âm hoặc tiếng Việt (ví dụ: AI → trí tuệ nhân tạo)
5. Giữ nguyên ý nghĩa và nội dung
6. Chỉ trả về văn bản đã cải thiện, không giải thích thêm

Văn bản cần cải thiện:
${text}`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API Error: ${response.statusText}`);
    }

    const data = await response.json();
    const improvedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (improvedText) {
      console.log('✅ Đã cải thiện text bằng Gemini');
      return improvedText.trim();
    }
    
    return text; // Fallback về text gốc nếu không parse được
  } catch (error) {
    console.warn("Lỗi khi gọi Gemini API, sử dụng text gốc:", error);
    return text; // Fallback về text gốc nếu lỗi
  }
};

export const speakText = async (text: string): Promise<void> => {
  // 1. Nếu có Gemini API Key, sử dụng Gemini để cải thiện text
  let finalText = text;
  
  if (GEMINI_API_KEY) {
    try {
      finalText = await improveTextWithGemini(text);
    } catch (error) {
      console.warn("Không thể cải thiện text bằng Gemini, sử dụng text gốc:", error);
    }
  }
  
  // 2. Normalize text và đọc bằng Browser TTS
  speakBrowserFallback(finalText);
};

/**
 * Fallback sử dụng SpeechSynthesis của trình duyệt - Tối ưu cho tiếng Việt
 * Ưu tiên giọng Google Vietnamese (tự nhiên nhất)
 */
const speakBrowserFallback = (text: string) => {
  if (!('speechSynthesis' in window)) {
    console.warn("Trình duyệt không hỗ trợ đọc văn bản.");
    return;
  }

  // Hủy các lệnh đọc trước đó
  window.speechSynthesis.cancel();
  try { 
    if (currentAudio) { 
      currentAudio.pause(); 
      currentAudio = null; 
    } 
  } catch(e) {}

  // Normalize text trước khi đọc
  const normalizedText = normalizeTextForSpeech(text);

  const utterance = new SpeechSynthesisUtterance(normalizedText);
  utterance.lang = 'vi-VN';
  utterance.rate = 0.9;  // Tốc độ vừa phải, tự nhiên
  utterance.pitch = 1.0; // Độ cao giọng bình thường
  utterance.volume = 1.0;

  // Hàm tìm và set giọng tốt nhất
  const findAndSetBestVietnameseVoice = () => {
    const voices = window.speechSynthesis.getVoices();
    
    // CHIẾN THUẬT: Ưu tiên Google Vietnamese (giọng tự nhiên nhất)
    // Tìm giọng Google với lang='vi-VN'
    let vnVoice = voices.find(v => 
      v.lang === 'vi-VN' && v.name.includes('Google')
    );
    
    // Nếu không có Google, tìm Microsoft Vietnamese
    if (!vnVoice) {
      vnVoice = voices.find(v => 
        v.lang === 'vi-VN' && (v.name.includes('Microsoft') || v.name.includes('Vietnamese'))
      );
    }
    
    // Nếu vẫn không có, tìm bất kỳ giọng vi-VN nào
    if (!vnVoice) {
      vnVoice = voices.find(v => v.lang === 'vi-VN');
    }
    
    // Cuối cùng, tìm bất kỳ giọng có 'vi' trong lang
    if (!vnVoice) {
      vnVoice = voices.find(v => v.lang.includes('vi'));
    }
    
    if (vnVoice) {
      utterance.voice = vnVoice;
      console.log(`Đang sử dụng giọng: ${vnVoice.name} (${vnVoice.lang})`);
    } else {
      console.warn("Không tìm thấy giọng tiếng Việt, sử dụng giọng mặc định.");
    }
  };

  // Thử set voice ngay lập tức
  findAndSetBestVietnameseVoice();
  
  // Nếu chưa có voices (thường xảy ra lần đầu), đợi voiceschanged event
  if (window.speechSynthesis.getVoices().length === 0) {
    const voicesChanged = () => {
      findAndSetBestVietnameseVoice();
      window.speechSynthesis.onvoiceschanged = null;
    };
    window.speechSynthesis.onvoiceschanged = voicesChanged;
    
    // Fallback: Nếu sau 1 giây vẫn chưa có voices, thử lại
    setTimeout(() => {
      if (!utterance.voice) {
        findAndSetBestVietnameseVoice();
      }
    }, 1000);
  }

  // Xử lý lỗi
  utterance.onerror = (event) => {
    console.error('Lỗi phát âm:', event);
  };

  window.speechSynthesis.speak(utterance);
};