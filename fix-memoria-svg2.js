const fs = require('fs');
const path = 'src/app/memoria-afroterritorial/page.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/url\('data:image\/svg\+xml,.*?([^']*)'\)/g, (match) => {
  return match.replace(/"/g, "%22");
});
fs.writeFileSync(path, content);
console.log('Fixed syntax error in memoria');
