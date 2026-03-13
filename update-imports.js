const fs = require('fs');

const p1 = 'src/app/(private)/mentor/dashboard/tasks/page.tsx';
let f1 = fs.readFileSync(p1, 'utf8');
if (!f1.includes('Bell')) {
    f1 = f1.replace('import { Plus,', 'import { Bell, Plus,');
    fs.writeFileSync(p1, f1);
    console.log('Fixed tasks');
}

const p2 = 'src/app/(private)/mentor/dashboard/projects/page.tsx';
let f2 = fs.readFileSync(p2, 'utf8');
if (!f2.includes('Bell')) {
    f2 = f2.replace('import { Plus,', 'import { Bell, Plus,');
    fs.writeFileSync(p2, f2);
    console.log('Fixed projects');
}
