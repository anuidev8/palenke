const fs = require('fs');

const path = 'src/app/page.tsx';
let content = fs.readFileSync(path, 'utf8');

const oldSection = `{/* ── ¿Quiénes somos? ── */}
      <section
        id="quienes-somos"
        className="relative overflow-hidden bg-[#fcfaf7] px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
      >
        {/* Modern UI/UX Background - Nuestra esencia */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
          {/* Abstract wavy gradient blobs representing the vibrant Afro-Colombian essence (PCN colors) */}
          <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[60%] rounded-full bg-gradient-to-tr from-[#2e7d32]/10 to-transparent blur-[120px]" />
          <div className="absolute top-[20%] -right-[10%] w-[60%] h-[70%] rounded-full bg-gradient-to-bl from-[#fbc02d]/10 to-transparent blur-[140px]" />
          <div className="absolute -bottom-[20%] left-[20%] w-[50%] h-[50%] rounded-full bg-gradient-to-t from-[#d32f2f]/5 to-transparent blur-[100px]" />
          
          {/* Subtle tribal/organic SVG texture mask overlay */}
          <div 
            className="absolute inset-0 opacity-[0.03] mix-blend-multiply"
            style={{ 
              backgroundImage: "url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cpath d=%22M54.627 0l1.373 1.373v57.254l-1.373 1.373H-1.373L-2.746 58.627V1.373L-1.373 0h56zM54 2.828H2.828v54.344H54V2.828z%22 fill=%22%231a1a1a%22 fill-rule=%22evenodd%22/%3E%3C/svg%3E')", 
              backgroundSize: "60px 60px" 
            }}
          />
        </div>`;

const newSection = `{/* ── ¿Quiénes somos? ── */}
      <section
        id="quienes-somos"
        className="relative overflow-hidden bg-[#F2EFE9] px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
      >
        {/* Dribbble-style Afro Abstract Background Graphics */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
          {/* Large Abstract Mudcloth/Geometric Shapes */}
          <svg className="absolute -top-32 -left-32 w-[600px] h-[600px] text-[#2e7d32]/5 rotate-12" fill="currentColor" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path d="M100,0 L200,100 L100,200 L0,100 Z" />
            <circle cx="100" cy="100" r="50" fill="#F2EFE9" />
            <circle cx="100" cy="100" r="20" />
            <path d="M40,40 L160,160 M40,160 L160,40" stroke="#F2EFE9" strokeWidth="8" />
          </svg>
          
          {/* Graphic Rhythmic Stepped Lines */}
          <svg className="absolute top-1/2 -right-20 w-[400px] h-[400px] text-[#d32f2f]/5 -translate-y-1/2" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <polyline points="20,100 60,60 100,100 140,60 180,100" />
            <polyline points="20,140 60,100 100,140 140,100 180,140" />
            <polyline points="20,180 60,140 100,180 140,140 180,180" />
            <circle cx="100" cy="100" r="12" fill="currentColor" />
          </svg>

          {/* Yellow vibrant accent blob */}
          <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] rounded-full bg-gradient-to-t from-[#fbc02d]/10 to-transparent blur-[120px]" />
          
          {/* Subtle repeating grid texture to reduce "white space" feel */}
          <div className="absolute inset-0 opacity-[0.04] mix-blend-multiply"
               style={{ backgroundImage: "radial-gradient(#1a1a1a 2px, transparent 2px)", backgroundSize: "32px 32px" }} />
        </div>`;

if (content.includes(oldSection)) {
  content = content.replace(oldSection, newSection);
  fs.writeFileSync(path, content);
  console.log('Successfully updated background in page.tsx');
} else {
  console.log('Could not find old section in page.tsx. The file might have been modified.');
}
