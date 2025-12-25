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

  // Extract options A. ... B. ... C. ... D.
  const optRegex = /A\.\s*([\s\S]*?)\r?\nB\.\s*([\s\S]*?)\r?\nC\.\s*([\s\S]*?)\r?\nD\.\s*([\s\S]*?)(?=(?:\r?\nĐáp án:)|$)/i;
  const optMatch = s.match(optRegex);

  // Extract answer letter (A-D)
  const answerMatch = s.match(/Đáp án:\s*([A-D])/i);

  // Extract explanation
  const explMatch = s.match(/Giải thích:\s*([\s\S]*)$/i);

  // Question text is everything before 'A.' (if options found)
  let question = s;
  if (optMatch) {
    const idx = s.search(/A\./);
    if (idx !== -1) question = s.slice(0, idx).trim();
  } else {
    const idx = s.search(/A\./);
    if (idx !== -1) question = s.slice(0, idx).trim();
  }

  const options = optMatch ? [optMatch[1].trim(), optMatch[2].trim(), optMatch[3].trim(), optMatch[4].trim()] : [];
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
