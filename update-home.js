const fs = require('fs');

const path = 'src/app/page.tsx';
let content = fs.readFileSync(path, 'utf8');

const oldBg = `        {/* Decorative background elements */}
        <div className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-[#2e7d32]/5 blur-3xl" aria-hidden="true" />
        <div className="absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-[#fbc02d]/10 blur-3xl" aria-hidden="true" />
        <div 
          className="absolute left-1/2 top-1/2 h-[800px] w-[1200px] -translate-x-1/2 -translate-y-1/2 opacity-[0.03] mix-blend-overlay pointer-events-none" 
          style={{ backgroundImage: "radial-gradient(#1a1a1a 2px, transparent 2px)", backgroundSize: "32px 32px" }} 
          aria-hidden="true" 
        />`;

const newBg = `        {/* Modern UI/UX Background - Nuestra esencia */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
          {/* Abstract wavy gradient blobs representing the vibrant Afro-Colombian essence (PCN colors) */}
          <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[60%] rounded-full bg-gradient-to-tr from-[#2e7d32]/10 to-transparent blur-[120px]" />
          <div className="absolute top-[20%] -right-[10%] w-[60%] h-[70%] rounded-full bg-gradient-to-bl from-[#fbc02d]/10 to-transparent blur-[140px]" />
          <div className="absolute -bottom-[20%] left-[20%] w-[50%] h-[50%] rounded-full bg-gradient-to-t from-[#d32f2f]/5 to-transparent blur-[100px]" />
          
          {/* Subtle tribal/organic SVG texture mask overlay */}
          <div 
            className="absolute inset-0 opacity-[0.03] mix-blend-multiply"
            style={{ 
              backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath d=\"M54.627 0l1.373 1.373v57.254l-1.373 1.373H-1.373L-2.746 58.627V1.373L-1.373 0h56zM54 2.828H2.828v54.344H54V2.828z\" fill=\"%231a1a1a\" fill-rule=\"evenodd\"/%3E%3C/svg%3E')", 
              backgroundSize: "60px 60px" 
            }}
          />
        </div>`;

content = content.replace(oldBg, newBg);
fs.writeFileSync(path, content);
console.log('Updated page.tsx');
