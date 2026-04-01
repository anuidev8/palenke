const fs = require('fs');
const path = 'src/app/memoria-afroterritorial/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Update the bullet points to alternate colors
const oldList = `              {[
                "Cuidar como tesoro colectivo el conocimiento jurídico y político del Pueblo Negro.",
                "Elevar las voces y saberes de nuestras comunidades, celebrando nuestra producción cultural.",
                "Tejer lazos de identidad y pensamiento propio que conecten a las nuevas generaciones.",
                "Ser faro e inspiración para la formación política y la defensa incansable de nuestros derechos.",
              ].map((fn) => (
                <li key={fn} className="flex items-start gap-3 text-sm leading-6 text-[#4a4540]">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2e7d32]" />
                  {fn}
                </li>
              ))}`;

const newList = `              {[
                { text: "Cuidar como tesoro colectivo el conocimiento jurídico y político del Pueblo Negro.", color: "bg-[#2e7d32]" },
                { text: "Elevar las voces y saberes de nuestras comunidades, celebrando nuestra producción cultural.", color: "bg-[#fbc02d]" },
                { text: "Tejer lazos de identidad y pensamiento propio que conecten a las nuevas generaciones.", color: "bg-[#d32f2f]" },
                { text: "Ser faro e inspiración para la formación política y la defensa incansable de nuestros derechos.", color: "bg-[#2e7d32]" },
              ].map((item) => (
                <li key={item.text} className="flex items-start gap-3 text-sm leading-6 text-[#4a4540]">
                  <span className={\`mt-2 h-1.5 w-1.5 shrink-0 rounded-full \${item.color}\`} />
                  {item.text}
                </li>
              ))}`;

content = content.replace(oldList, newList);

// 2. Update the Right Card
const oldCard = `          {/* Right — Imagen representativa */}
          <div
            className="relative min-h-[320px] overflow-hidden rounded-[28px] lg:min-h-[400px]"
            style={{
              background:
                "radial-gradient(ellipse at 30% 70%, rgba(46,125,50,0.75), transparent 55%), radial-gradient(ellipse at 80% 20%, rgba(27,94,32,0.5), transparent 50%), linear-gradient(150deg, #0d1f0d 0%, #2c3e2a 60%, #1a2a1a 100%)",
            }}
          >
            <svg
              className="absolute inset-0 h-full w-full opacity-20"
              viewBox="0 0 600 400"
              preserveAspectRatio="xMidYMid slice"
              aria-hidden="true"
            >
              <path
                d="M50,400 Q150,240 200,180 Q280,100 350,120 Q420,140 500,70"
                stroke="white" strokeWidth="3" fill="none" opacity="0.6"
              />
              <path
                d="M0,290 Q100,260 180,240 Q260,215 320,245 Q400,275 600,235"
                stroke="white" strokeWidth="1.5" fill="none" opacity="0.4"
              />
              <ellipse cx="180" cy="200" rx="65" ry="45" fill="#2e7d32" opacity="0.3" />
              <ellipse cx="390" cy="130" rx="85" ry="52" fill="#1b5e20" opacity="0.25" />
              <circle cx="170" cy="170" r="5" fill="white" opacity="0.8" />
              <circle cx="310" cy="115" r="5" fill="white" opacity="0.8" />
              <circle cx="460" cy="95" r="5" fill="white" opacity="0.8" />
            </svg>`;

const newCard = `          {/* Right — Imagen representativa */}
          <div
            className="relative min-h-[320px] overflow-hidden rounded-[28px] lg:min-h-[400px]"
            style={{
              background:
                "radial-gradient(ellipse at 20% 80%, rgba(46,125,50,0.4), transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(251,192,45,0.25), transparent 60%), radial-gradient(ellipse at 90% 90%, rgba(211,47,47,0.3), transparent 60%), linear-gradient(150deg, #1f1d1b 0%, #292420 60%, #171513 100%)",
            }}
          >
            <svg
              className="absolute inset-0 h-full w-full opacity-30"
              viewBox="0 0 600 400"
              preserveAspectRatio="xMidYMid slice"
              aria-hidden="true"
            >
              {/* Decorative Brand Color Circles */}
              <circle cx="180" cy="250" r="80" fill="#2e7d32" opacity="0.2" filter="blur(20px)" />
              <circle cx="420" cy="120" r="100" fill="#fbc02d" opacity="0.15" filter="blur(25px)" />
              <circle cx="480" cy="300" r="60" fill="#d32f2f" opacity="0.2" filter="blur(15px)" />
              
              {/* Connection paths */}
              <path
                d="M50,400 Q150,240 200,180 Q280,100 350,120 Q420,140 500,70"
                stroke="white" strokeWidth="2" fill="none" opacity="0.5" strokeDasharray="4 8"
              />
              <path
                d="M0,290 Q100,260 180,240 Q260,215 320,245 Q400,275 600,235"
                stroke="white" strokeWidth="1.5" fill="none" opacity="0.4"
              />
              
              {/* Nodes representing communities */}
              <circle cx="200" cy="180" r="4" fill="#2e7d32" stroke="white" strokeWidth="2" />
              <circle cx="350" cy="120" r="5" fill="#fbc02d" stroke="white" strokeWidth="2" />
              <circle cx="320" cy="245" r="4" fill="#d32f2f" stroke="white" strokeWidth="2" />
              <circle cx="500" cy="70" r="3" fill="#ffffff" opacity="0.8" />
            </svg>`;

content = content.replace(oldCard, newCard);
fs.writeFileSync(path, content);
console.log('Updated card colors successfully.');
