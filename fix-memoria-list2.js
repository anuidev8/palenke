const fs = require('fs');
const path = 'src/app/memoria-afroterritorial/page.tsx';
let content = fs.readFileSync(path, 'utf8');

const oldList = `              {[
                "Dar a conocer las investigaciones y el pensamiento propio nacido de nuestras entrañas.",
                "Recoger con amor las historias, luchas y experiencias de cada rincón del territorio.",
                "Celebrar nuestras prácticas culturales, saberes y el arte que nos define.",
                "Construir puentes vivos entre el conocimiento comunitario, la organización y la academia.",
              ].map((fn) => (
                <li key={fn} className="flex items-start gap-3 text-sm leading-6 text-[#4a4540]">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2e7d32]" />
                  {fn}
                </li>
              ))}`;

const newList = `              {[
                { text: "Dar a conocer las investigaciones y el pensamiento propio nacido de nuestras entrañas.", color: "bg-[#2e7d32]" },
                { text: "Recoger con amor las historias, luchas y experiencias de cada rincón del territorio.", color: "bg-[#fbc02d]" },
                { text: "Celebrar nuestras prácticas culturales, saberes y el arte que nos define.", color: "bg-[#d32f2f]" },
                { text: "Construir puentes vivos entre el conocimiento comunitario, la organización y la academia.", color: "bg-[#2e7d32]" },
              ].map((item) => (
                <li key={item.text} className="flex items-start gap-3 text-sm leading-6 text-[#4a4540]">
                  <span className={\`mt-2 h-1.5 w-1.5 shrink-0 rounded-full \${item.color}\`} />
                  {item.text}
                </li>
              ))}`;

content = content.replace(oldList, newList);
fs.writeFileSync(path, content);
console.log('Updated list 2');
