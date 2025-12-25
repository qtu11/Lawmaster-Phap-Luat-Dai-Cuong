import { Question } from '../types';
import { QUESTIONS as FALLBACK_QUESTIONS, QUESTIONS_FILE_NAME } from '../constants';

/**
 * Parse raw text of the question bank file into Question[]
 * Expected structure (flexible):
 * Câu <number>: <question text> A. <optA> B. <optB> C. <optC> D. <optD>
 * Đáp án: <LETTER>.
 * Giải thích: <explanation>
 */
export function parseQuestionsFromText(raw: string): Question[] {
  const lines = raw.split(/\r?\n/);
  const questions: Question[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const cauMatch = line.match(/^Câu\s*(\d+)\s*:\s*(.*)/i);
    if (!cauMatch) continue;

    const id = Number(cauMatch[1]);
    let rest = cauMatch[2] || '';

    // Attempt to extract inline options from the same line (A. ... B. ...)
    let optionsText = '';
    const inlineOptionsIndex = rest.search(/\bA\./i);
    if (inlineOptionsIndex !== -1) {
      const questionText = rest.slice(0, inlineOptionsIndex).trim();
      optionsText = rest.slice(inlineOptionsIndex).trim();
      rest = questionText;
    } else {
      // If not inline, gather subsequent lines until we hit 'Đáp án' or 'Giải thích' or next 'Câu'
      let j = i + 1;
      while (j < lines.length && !/^Đáp án\s*:/i.test(lines[j]) && !/^Giải thích\s*:/i.test(lines[j]) && !/^Câu\s*\d+\s*:/i.test(lines[j])) {
        if (lines[j].trim()) {
          // lines that look like options often start with A. B. C.
          optionsText += (optionsText ? ' ' : '') + lines[j].trim();
        }
        j++;
      }
      // move i forward to the last consumed line before next marker
      // j points to first non-option line
      i = j - 1;
    }

    // Split optionsText into array by looking for A. B. C. D. markers
    let options: string[] = [];
    if (optionsText) {
      // Ensure markers like 'A.' are preserved in pieces
      const parts = optionsText.split(/(?=\b[A-D]\.)/i).map(p => p.trim()).filter(Boolean);
      options = parts.map(p => p.replace(/\s+/g, ' ').trim());
    }

    // Find Đáp án and Giải thích lines following
    let answerIndex: number = 0;
    let explanation = undefined as string | undefined;
    let k = i + 1;
    for (; k < lines.length; k++) {
      const l = lines[k].trim();
      const dapAn = l.match(/^Đáp\s*án\s*:\s*([A-D])/i);
      if (dapAn) {
        const letter = dapAn[1].toUpperCase();
        answerIndex = letter.charCodeAt(0) - 65; // A->0
        continue;
      }

      const giaiThich = l.match(/^Giải\s*thích\s*:\s*(.*)/i);
      if (giaiThich) {
        explanation = giaiThich[1].trim();
        // collect subsequent explanation lines until next 'Câu' or blank line
        let m = k + 1;
        while (m < lines.length && !/^Câu\s*\d+\s*:/i.test(lines[m])) {
          const next = lines[m].trim();
          if (!next) break;
          explanation += ' ' + next;
          m++;
        }
        i = m - 1;
        break;
      }

      // If we hit next question, step back one and stop
      if (/^Câu\s*\d+\s*:/i.test(l)) {
        break;
      }
    }

    // If options array is empty but rest may contain inline options without markers
    if (options.length === 0 && rest) {
      // try to split by letters like ' A. ' inside rest
      const inlineParts = rest.split(/(?=\bA\.|\bB\.|\bC\.|\bD\.)/i).map(p => p.trim()).filter(Boolean);
      if (inlineParts.length > 1) {
        // first part is question text
        rest = inlineParts.shift() as string;
        options = inlineParts;
      }
    }

    // If options still empty, create placeholder options to avoid runtime errors
    if (options.length === 0) {
      options = ["A. Đáp án 1", "B. Đáp án 2", "C. Đáp án 3", "D. Đáp án 4"];
    }

    const questionText = rest.replace(/\s+/g, ' ').trim();

    const question: Question = {
      id,
      category: '',
      question: questionText,
      options,
      correctAnswer: Math.max(0, Math.min(answerIndex, options.length - 1)),
      explanation
    };

    questions.push(question);
  }

  return questions;
}

/**
 * Load questions by fetching the `QUESTIONS_FILE_NAME` from server root.
 * If fetch fails or parse returns no items, return the fallback embedded questions.
 */
export async function loadQuestions(): Promise<Question[]> {
  try {
    const url = '/' + encodeURIComponent(QUESTIONS_FILE_NAME);
    const res = await fetch(url);
    if (!res.ok) throw new Error('Fetch failed');
    const raw = await res.text();
    const parsed = parseQuestionsFromText(raw);
    if (parsed.length > 0) {
      // Try to preserve categories by mapping from fallback by id when possible
      const mapped = parsed.map(p => {
        const fallback = FALLBACK_QUESTIONS.find(f => f.id === p.id);
        return { ...p, category: fallback ? fallback.category : (p.category || '') } as Question;
      });
      return mapped;
    }
  } catch (err) {
    // ignore and fallback
  }
  return FALLBACK_QUESTIONS;
}

export default loadQuestions;
