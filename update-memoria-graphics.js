const fs = require('fs');
const path = 'src/app/memoria-afroterritorial/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// --- 1. NUESTRA MEMORIA SECTION ---
const sec2Old = /<section className="relative overflow-hidden border-b border-\[#e8dfd3\] bg-\[#F7F5F0\] px-4 py-14 sm:px-6 lg:px-8">[\s\S]*?<div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-14">/;

const sec2New = `<section className="relative overflow-hidden border-b border-[#e8dfd3] bg-[#F7F5F0] px-4 py-14 sm:px-6 lg:px-8">
        {/* Dribbble-style Afro Abstract Background Graphics */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
          {/* Topographic organic afro-territorial lines - GREEN */}
          <svg className="absolute -top-[5%] -right-[5%] w-[800px] h-[800px] text-[#2e7d32]/10 rotate-[15deg]" viewBox="0 0 400 400" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" xmlns="http://www.w3.org/2000/svg">
            <path d="M 50 200 Q 100 100 200 200 T 350 200" />
            <path d="M 50 230 Q 100 130 200 230 T 350 230" />
            <path d="M 50 260 Q 100 160 200 260 T 350 260" />
            <path d="M 50 290 Q 100 190 200 290 T 350 290" />
            <path d="M 50 320 Q 100 220 200 320 T 350 320" />
            <circle cx="200" cy="200" r="100" strokeWidth="4" strokeDasharray="10 10" />
            <circle cx="200" cy="200" r="150" strokeWidth="3" />
          </svg>

          {/* Abstract solid shapes representing earth and roots - RED */}
          <svg className="absolute -bottom-10 -left-10 w-[500px] h-[500px] text-[#d32f2f]/10" fill="currentColor" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 200 L 200 200 L 200 100 Q 150 50 100 100 T 0 100 Z" />
            <circle cx="50" cy="150" r="20" fill="#F7F5F0" />
            <circle cx="150" cy="150" r="10" fill="#F7F5F0" />
          </svg>

          {/* Warm energetic glows (YELLOW & RED) */}
          <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-t from-[#fbc02d]/20 to-transparent blur-[120px]" />
          <div className="absolute top-10 left-10 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-[#d32f2f]/15 to-transparent blur-[100px]" />
          
          {/* Very faint tribal pattern mask */}
          <div className="absolute inset-0 opacity-[0.04] mix-blend-multiply" style={{ backgroundImage: "radial-gradient(#1a1a1a 2px, transparent 2px)", backgroundSize: "32px 32px" }} />
        </div>
        
        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-14">`;


// --- 2. NORMATIVA VIGENTE SECTION ---
const sec3Old = /<section className="bg-\[#f8f5f2\] px-4 py-14 sm:px-6 lg:px-8">\s*<div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-14">/;

const sec3New = `<section className="relative overflow-hidden bg-[#EAE6DD] px-4 py-14 sm:px-6 lg:px-8 border-b border-[#e8dfd3]">
        <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
          {/* Large Yellow African Sun/Shield Motif */}
          <svg className="absolute top-0 right-0 w-[700px] h-[700px] text-[#fbc02d]/20 translate-x-1/3 -translate-y-1/3" viewBox="0 0 200 200" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="80" />
            <circle cx="100" cy="100" r="95" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="4 8" />
          </svg>
          
          {/* Bold Red Zig-Zag tribal lines */}
          <svg className="absolute bottom-10 left-0 w-[400px] h-[400px] text-[#d32f2f]/10 -translate-x-1/4" fill="none" stroke="currentColor" strokeWidth="8" strokeLinejoin="miter" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <polyline points="0,20 20,0 40,20 60,0 80,20 100,0" />
            <polyline points="0,40 20,20 40,40 60,20 80,40 100,20" />
            <polyline points="0,60 20,40 40,60 60,40 80,60 100,40" />
          </svg>
          
          <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent" />
        </div>
        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-14">`;


// --- 3. MEMORIA VIVA DEL TERRITORIO SECTION ---
const sec4Old = /<section className="bg-white px-4 py-14 sm:px-6 lg:px-8">\s*<div className="mx-auto grid max-w-7xl items-start gap-10 lg:grid-cols-2 lg:gap-14">/;

const sec4New = `<section className="relative overflow-hidden border-t border-[#e8dfd3] bg-[#FAFAF7] px-4 py-14 sm:px-6 lg:px-8">
        <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
          {/* Rhythmic flowing green ribbons (Mangroves/Rivers) */}
          <svg className="absolute top-1/2 left-0 w-full h-[600px] text-[#2e7d32]/10 -translate-y-1/2" preserveAspectRatio="none" viewBox="0 0 1000 200" fill="none" stroke="currentColor" strokeWidth="4" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,100 C150,200 350,0 500,100 C650,200 850,0 1000,100" />
            <path d="M0,120 C150,220 350,20 500,120 C650,220 850,20 1000,120" />
            <path d="M0,140 C150,240 350,40 500,140 C650,240 850,40 1000,140" />
          </svg>
          
          {/* Deep green soft glow */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-[#2e7d32]/10 to-transparent blur-[130px]" />
          
          {/* Delicate red dots matrix */}
          <div className="absolute inset-0 opacity-[0.03] mix-blend-multiply" style={{ backgroundImage: "radial-gradient(#d32f2f 2.5px, transparent 2.5px)", backgroundSize: "48px 48px" }} />
        </div>
        <div className="relative z-10 mx-auto grid max-w-7xl items-start gap-10 lg:grid-cols-2 lg:gap-14">`;

if(content.match(sec2Old)) {
  content = content.replace(sec2Old, sec2New);
  console.log('Updated sec2');
} else {
  console.log('Sec 2 not matched');
}

if(content.match(sec3Old)) {
  content = content.replace(sec3Old, sec3New);
  console.log('Updated sec3');
} else {
  console.log('Sec 3 not matched');
}

if(content.match(sec4Old)) {
  content = content.replace(sec4Old, sec4New);
  console.log('Updated sec4');
} else {
  console.log('Sec 4 not matched');
}

fs.writeFileSync(path, content);
