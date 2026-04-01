const fs = require('fs');
const path = 'src/app/memoria-afroterritorial/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// Tone down sec 2 green/opacity
content = content.replace('text-[#2e7d32]/10 rotate-[15deg]', 'text-[#2e7d32]/[0.04] rotate-[15deg]');
content = content.replace('text-[#d32f2f]/10" fill="currentColor"', 'text-[#d32f2f]/[0.05]" fill="currentColor"');
content = content.replace('from-[#fbc02d]/20', 'from-[#fbc02d]/[0.08]');
content = content.replace('from-[#d32f2f]/15', 'from-[#d32f2f]/[0.06]');
content = content.replace('opacity-[0.04] mix-blend-multiply', 'opacity-[0.02] mix-blend-multiply');

// Tone down sec 3
content = content.replace('text-[#fbc02d]/20 translate-x-1/3', 'text-[#fbc02d]/[0.06] translate-x-1/3');
content = content.replace('text-[#d32f2f]/10 -translate-x-1/4', 'text-[#d32f2f]/[0.04] -translate-x-1/4');

fs.writeFileSync(path, content);
console.log('Toned down overall visibility');
