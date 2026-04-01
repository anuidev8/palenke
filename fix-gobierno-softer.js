const fs = require('fs');
const path = 'src/app/gobierno-propio/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// Tone down opacity in Gobierno Propio
content = content.replace('text-[#2e7d32]/[0.06]', 'text-[#2e7d32]/[0.03]');
content = content.replace('text-[#d32f2f]/[0.05]', 'text-[#d32f2f]/[0.025]');
content = content.replace('from-[#2e7d32]/10', 'from-[#2e7d32]/[0.05]');
content = content.replace('from-[#fbc02d]/10', 'from-[#fbc02d]/[0.05]');

fs.writeFileSync(path, content);
console.log('Made Gobierno Propio background much softer');
