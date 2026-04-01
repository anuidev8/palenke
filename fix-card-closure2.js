const fs = require('fs');
const path = 'src/app/memoria-afroterritorial/page.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  /<\/Link>\s*<\/div>\s*\{\/\*\s*Right — Definición y Función\s*\*\/\}/,
  `</Link>
            </div>
          </div>

          {/* Right — Definición y Función */}`
);

fs.writeFileSync(path, content);
console.log('Fixed wrapper closure');
