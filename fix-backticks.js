const fs = require('fs');

const files = [
  'e:/Projects/ProgressIQ/Frontend/src/app/(private)/student/dashboard/page.tsx',
  'e:/Projects/ProgressIQ/Frontend/src/app/(private)/admin/dashboard/students-manage/page.tsx',
  'e:/Projects/ProgressIQ/Frontend/src/app/(private)/mentor/dashboard/assigned-students/page.tsx',
  'e:/Projects/ProgressIQ/Frontend/src/app/(private)/student/dashboard/profile/page.tsx'
];

files.forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  // Replace \`https with `https
  c = c.replace(/\\`https/g, '`https');
  // Replace }\` with }`
  c = c.replace(/\}\\`/g, '}`');
  fs.writeFileSync(f, c);
});
console.log('Fixed escaped backticks');
