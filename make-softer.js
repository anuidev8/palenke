const fs = require('fs');
const path = 'src/app/memoria-afroterritorial/page.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace('opacity-[0.06]" preserveAspectRatio', 'opacity-[0.035]" preserveAspectRatio');
content = content.replace('from-[#fbc02d]/10', 'from-[#fbc02d]/[0.05]');
content = content.replace('from-[#d32f2f]/5', 'from-[#d32f2f]/[0.03]');

fs.writeFileSync(path, content);
console.log('Made Memoria viva background much softer');
