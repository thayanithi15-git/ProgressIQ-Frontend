const fs = require('fs');

const files = [
  'e:/Projects/ProgressIQ/Frontend/src/app/(private)/student/dashboard/page.tsx',
  'e:/Projects/ProgressIQ/Frontend/src/app/(private)/admin/dashboard/students-manage/page.tsx',
  'e:/Projects/ProgressIQ/Frontend/src/app/(private)/mentor/dashboard/assigned-students/page.tsx',
  'e:/Projects/ProgressIQ/Frontend/src/app/(private)/student/dashboard/profile/page.tsx'
];

files.forEach(f => {
  if (fs.existsSync(f)) {
    let c = fs.readFileSync(f, 'utf8');
    // Replace all escaped backticks \` with `
    c = c.replace(/\\`/g, '`');
    // Replace all escaped dollars \$ with $
    c = c.replace(/\\\$/g, '$');
    fs.writeFileSync(f, c);
  }
});
console.log('Fixed all escaped backticks and dollars successfully.');
