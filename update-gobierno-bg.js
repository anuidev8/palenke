const fs = require('fs');
const path = 'src/app/gobierno-propio/page.tsx';
let content = fs.readFileSync(path, 'utf8');

const oldRegex = /<section className="bg-\[#fcfaf7\] px-4 py-16 sm:px-6 lg:px-8 border-b border-\[#e8dfd3\]">\s*<div className="mx-auto w-full max-w-7xl">/;

const newSection = `<section className="relative overflow-hidden bg-[#EAE6DD] px-4 py-16 sm:px-6 lg:px-8 border-b border-[#e8dfd3]">
        {/* Dribbble-style Afro Abstract Background Graphics */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
          {/* Large dynamic circle & arch representing community and leadership */}
          <svg className="absolute -top-40 -left-20 w-[800px] h-[800px] text-[#2e7d32]/[0.06]" fill="currentColor" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path d="M 0 100 A 100 100 0 0 1 200 100" />
            <circle cx="100" cy="100" r="40" fill="#EAE6DD" />
            <circle cx="100" cy="100" r="15" />
            <path d="M 10 100 L 190 100" stroke="#EAE6DD" strokeWidth="4" />
          </svg>

          {/* Stepped ancestral patterns */}
          <svg className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] text-[#d32f2f]/[0.05]" fill="none" stroke="currentColor" strokeWidth="6" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <polyline points="0,200 40,200 40,160 80,160 80,120 120,120 120,80 160,80 160,40 200,40" />
            <polyline points="0,160 40,160 40,120 80,120 80,80 120,80 120,40 160,40 160,0" />
          </svg>

          {/* Deep green rich blur overlay for PCN aesthetic */}
          <div className="absolute top-[20%] right-[30%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#2e7d32]/10 to-transparent blur-[140px]" />
          <div className="absolute bottom-0 left-[20%] w-[400px] h-[400px] rounded-full bg-gradient-to-t from-[#fbc02d]/10 to-transparent blur-[100px]" />
        </div>
        
        <div className="relative z-10 mx-auto w-full max-w-7xl">`;

if(content.match(oldRegex)) {
  content = content.replace(oldRegex, newSection);
  fs.writeFileSync(path, content);
  console.log('Updated gobierno-propio background');
} else {
  console.log('Regex did not match in gobierno-propio');
}
