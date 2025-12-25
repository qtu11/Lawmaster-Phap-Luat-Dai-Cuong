const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'questions_300.json');
if (!fs.existsSync(file)) {
  console.error('questions_300.json not found');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(file, 'utf8'));

const categories = {
  c1: 'Lý luận về Nhà nước',
  c2: 'Lý luận về Pháp luật',
  c3: 'Quy phạm & Quan hệ PL',
  c4: 'Luật Dân sự',
  c5: 'Xây dựng & Áp dụng PL',
  c6: 'Vi phạm & Trách nhiệm PL'
};

const tagged = data.map(q => {
  const id = q.id;
  let category = '';
  if (id >= 1 && id <= 50) category = categories.c1;
  else if (id >= 51 && id <= 100) category = categories.c2;
  else if (id >= 101 && id <= 150) category = categories.c3;
  else if (id >= 151 && id <= 210) category = categories.c4;
  else if (id >= 211 && id <= 255) category = categories.c5;
  else if (id >= 256 && id <= 300) category = categories.c6;
  return Object.assign({}, q, { category });
});

fs.writeFileSync(file, JSON.stringify(tagged, null, 2), 'utf8');
console.log('Tagged', tagged.length, 'questions with categories in', file);
