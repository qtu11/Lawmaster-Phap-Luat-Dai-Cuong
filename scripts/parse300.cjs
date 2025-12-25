const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', '300 câu.txt');
const raw = fs.readFileSync(filePath, 'utf8');

function parseQuestionsFromText(raw) {
  const lines = raw.split(/\r?\n/);
  const questions = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const cauMatch = line.match(/^Câu\s*(\d+)\s*:\s*(.*)/i);
    if (!cauMatch) continue;

    const id = Number(cauMatch[1]);
    let rest = cauMatch[2] || '';

    let optionsText = '';
    const inlineOptionsIndex = rest.search(/\bA\./i);
    if (inlineOptionsIndex !== -1) {
      const questionText = rest.slice(0, inlineOptionsIndex).trim();
      optionsText = rest.slice(inlineOptionsIndex).trim();
      rest = questionText;
    } else {
      let j = i + 1;
      while (j < lines.length && !/^Đáp án\s*:/i.test(lines[j]) && !/^Giải thích\s*:/i.test(lines[j]) && !/^Câu\s*\d+\s*:/i.test(lines[j])) {
        if (lines[j].trim()) {
          optionsText += (optionsText ? ' ' : '') + lines[j].trim();
        }
        j++;
      }
      i = j - 1;
    }

    let options = [];
    if (optionsText) {
      const parts = optionsText.split(/(?=\b[A-D]\.)/i).map(p => p.trim()).filter(Boolean);
      options = parts.map(p => p.replace(/\s+/g, ' ').trim());
    }

    let answerIndex = 0;
    let explanation = undefined;
    let k = i + 1;
    for (; k < lines.length; k++) {
      const l = lines[k].trim();
      const dapAn = l.match(/^Đáp\s*án\s*:\s*([A-D])/i);
      if (dapAn) {
        const letter = dapAn[1].toUpperCase();
        answerIndex = letter.charCodeAt(0) - 65;
        continue;
      }

      const giaiThich = l.match(/^Giải\s*thích\s*:\s*(.*)/i);
      if (giaiThich) {
        explanation = giaiThich[1].trim();
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

      if (/^Câu\s*\d+\s*:/i.test(l)) {
        break;
      }
    }

    if (options.length === 0 && rest) {
      const inlineParts = rest.split(/(?=\bA\.|\bB\.|\bC\.|\bD\.)/i).map(p => p.trim()).filter(Boolean);
      if (inlineParts.length > 1) {
        rest = inlineParts.shift();
        options = inlineParts;
      }
    }

    if (options.length === 0) {
      options = ['A. Đáp án 1','B. Đáp án 2','C. Đáp án 3','D. Đáp án 4'];
    }

    const questionText = rest.replace(/\s+/g, ' ').trim();

    const question = {
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

const parsed = parseQuestionsFromText(raw);
console.log('Parsed count:', parsed.length);
console.log('First 3 parsed:', parsed.slice(0,3));
