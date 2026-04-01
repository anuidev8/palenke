const fs = require('fs');
const path = 'src/app/memoria-afroterritorial/page.tsx';
let content = fs.readFileSync(path, 'utf8');

const oldRegex = /<section className="relative overflow-hidden border-t border-\[#e8dfd3\] bg-\[#FAFAF7\] px-4 py-14 sm:px-6 lg:px-8">\s*<div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">[\s\S]*?<div className="relative z-10 mx-auto grid max-w-7xl items-start gap-10 lg:grid-cols-2 lg:gap-14">/;

const newSection = `<section className="relative overflow-hidden border-t border-[#e8dfd3] bg-[#FAFAF7] px-4 py-14 sm:px-6 lg:px-8">
        <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
          {/* Rhythmic flowing ribbons with PCN Brand Colors */}
          <svg className="absolute top-1/2 left-0 w-full h-[600px] -translate-y-1/2 opacity-[0.06]" preserveAspectRatio="none" viewBox="0 0 1000 200" fill="none" strokeWidth="6" strokeLinecap="round" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,100 C150,200 350,0 500,100 C650,200 850,0 1000,100" stroke="#fbc02d" />
            <path d="M0,120 C150,220 350,20 500,120 C650,220 850,20 1000,120" stroke="#d32f2f" />
            <path d="M0,140 C150,240 350,40 500,140 C650,240 850,40 1000,140" stroke="#2e7d32" />
          </svg>
          
          {/* Soft multi-color glows */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-[#fbc02d]/10 to-transparent blur-[140px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#d32f2f]/5 to-transparent blur-[120px]" />
          
          {/* Extremely delicate dots matrix (less visible) */}
          <div className="absolute inset-0 opacity-[0.015] mix-blend-multiply" style={{ backgroundImage: "radial-gradient(#1a1a1a 1.5px, transparent 1.5px)", backgroundSize: "64px 64px" }} />
        </div>
        <div className="relative z-10 mx-auto grid max-w-7xl items-start gap-10 lg:grid-cols-2 lg:gap-14">`;

if(content.match(oldRegex)) {
  content = content.replace(oldRegex, newSection);
  fs.writeFileSync(path, content);
  console.log('Fixed Memoria Viva BG');
} else {
  console.log('Not matched');
}
