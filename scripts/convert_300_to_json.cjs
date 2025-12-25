const fs = require('fs');
const path = require('path');

const input = path.join(__dirname, '..', '300 câu.txt');
const output = path.join(__dirname, '..', 'questions_300.json');

if (!fs.existsSync(input)) {
  console.error('Input file not found:', input);
  process.exit(1);
}

const txt = fs.readFileSync(input, 'utf8');

// Split into blocks starting with "Câu <number>:"
const blockRegex = /Câu\s+(\d+):([\s\S]*?)(?=(?:\r?\nCâu\s+\d+:)|$)/g;
const blocks = [];
let m;
while ((m = blockRegex.exec(txt)) !== null) {
  blocks.push({ id: Number(m[1]), text: m[2].trim() });
}

const results = [];
blocks.forEach(b => {
  const s = b.text;

  // Extract answer letter (A-D)
  const answerMatch = s.match(/Đáp án:\s*([A-D])/i);

  // Extract explanation
  const explMatch = s.match(/Giải thích:\s*([\s\S]*)$/i);

  // Question text is everything before first option label 'A.' if present
  let question = s;
  const aIndex = s.search(/\bA\./);
  if (aIndex !== -1) question = s.slice(0, aIndex).trim();

  // Extract options robustly (handles A./B./C./D. on same line or separate lines)
  const letters = ['A', 'B', 'C', 'D'];
  const options = [];
  letters.forEach((L, i) => {
    const nextLabels = letters.slice(i + 1).map(x => x + '\\.').join('|');
    const pattern = new RegExp(L + '\\\.\\s*([\\s\\S]*?)(?=(?:' + (nextLabels || 'Đáp án:') + ')|$)', 'i');
    const mm = s.match(pattern);
    if (mm) options.push(mm[1].trim());
  });

  const correctLetter = answerMatch ? answerMatch[1].toUpperCase() : null;
  const letterToIndex = { A: 0, B: 1, C: 2, D: 3 };
  const correctAnswer = correctLetter ? letterToIndex[correctLetter] : null;
  const explanation = explMatch ? explMatch[1].trim() : '';

  results.push({
    id: b.id,
    question: question.replace(/\r?\n/g, ' ').trim(),
    options,
    correctAnswer,
    explanation
  });
});

fs.writeFileSync(output, JSON.stringify(results, null, 2), 'utf8');
console.log('Wrote', results.length, 'questions to', output);
