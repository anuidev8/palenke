const fs = require('fs');
const path = 'src/app/memoria-afroterritorial/page.tsx';
let content = fs.readFileSync(path, 'utf8');

const oldCard = `          {/* Right — Memoria viva del territorio CTA card */}
          <div
            className="relative flex min-h-[320px] flex-col justify-end overflow-hidden rounded-[28px] p-8"
            style={{
              background:
                "radial-gradient(ellipse at 25% 75%, rgba(46,125,50,0.7), transparent 55%), linear-gradient(150deg, #1a2a1a 0%, #2c3e2a 60%, #0d1f0d 100%)",
            }}
          >
            {/* decorative dots */}
            <div className="absolute right-6 top-6 grid grid-cols-4 gap-2 opacity-25" aria-hidden="true">
              {Array.from({ length: 12 }).map((_, i) => (
                <span key={i} className="h-1.5 w-1.5 rounded-full bg-white" />
              ))}
            </div>`;

const newCard = `          {/* Right — Memoria viva del territorio CTA card */}
          <div
            className="relative flex min-h-[320px] flex-col justify-end overflow-hidden rounded-[28px] p-8"
            style={{
              background:
                "radial-gradient(ellipse at 80% 80%, rgba(211,47,47,0.35), transparent 60%), radial-gradient(ellipse at 20% 20%, rgba(251,192,45,0.25), transparent 60%), radial-gradient(ellipse at 25% 75%, rgba(46,125,50,0.4), transparent 60%), linear-gradient(150deg, #1c1a19 0%, #26211e 60%, #1a1614 100%)",
            }}
          >
            {/* abstract organic flow */}
            <svg className="absolute inset-0 h-full w-full opacity-[0.15]" viewBox="0 0 400 300" preserveAspectRatio="none">
              <path d="M-50,150 Q100,250 200,100 T450,150" fill="none" stroke="#fbc02d" strokeWidth="4" />
              <path d="M-50,200 Q150,300 250,150 T450,200" fill="none" stroke="#d32f2f" strokeWidth="3" />
            </svg>
            
            {/* decorative colored dots */}
            <div className="absolute right-6 top-6 grid grid-cols-4 gap-2 opacity-60" aria-hidden="true">
              {['bg-[#fbc02d]', 'bg-[#d32f2f]', 'bg-[#2e7d32]', 'bg-[#fbc02d]',
                'bg-[#2e7d32]', 'bg-[#fbc02d]', 'bg-[#d32f2f]', 'bg-[#2e7d32]',
                'bg-[#d32f2f]', 'bg-[#2e7d32]', 'bg-[#fbc02d]', 'bg-[#d32f2f]'].map((color, i) => (
                <span key={i} className={\`h-1.5 w-1.5 rounded-full \${color}\`} />
              ))}
            </div>`;

content = content.replace(oldCard, newCard);
fs.writeFileSync(path, content);
console.log('Updated Memoria viva CTA card correctly');
