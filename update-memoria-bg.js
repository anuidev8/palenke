const fs = require('fs');
const path = 'src/app/memoria-afroterritorial/page.tsx';
let content = fs.readFileSync(path, 'utf8');

const oldRegex = /<section className="relative overflow-hidden border-b border-\[#e8dfd3\] bg-white px-4 py-14 sm:px-6 lg:px-8">[\s\S]*?<div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-14">/;

const newSection = `<section className="relative overflow-hidden border-b border-[#e8dfd3] bg-[#F7F5F0] px-4 py-14 sm:px-6 lg:px-8">
        {/* Dribbble-style Afro Abstract Background Graphics */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
          {/* Topographic organic afro-territorial lines */}
          <svg className="absolute -top-[10%] -right-[10%] w-[800px] h-[800px] text-[#2e7d32]/[0.03] rotate-[15deg]" viewBox="0 0 400 400" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" xmlns="http://www.w3.org/2000/svg">
            <path d="M 50 200 Q 100 100 200 200 T 350 200" />
            <path d="M 50 230 Q 100 130 200 230 T 350 230" />
            <path d="M 50 260 Q 100 160 200 260 T 350 260" />
            <path d="M 50 290 Q 100 190 200 290 T 350 290" />
            <path d="M 50 320 Q 100 220 200 320 T 350 320" />
            <circle cx="200" cy="200" r="100" strokeWidth="2" strokeDasharray="8 8" />
            <circle cx="200" cy="200" r="150" strokeWidth="2" />
          </svg>

          {/* Abstract solid shapes representing earth and roots */}
          <svg className="absolute -bottom-32 -left-32 w-[500px] h-[500px] text-[#8D6E63]/5" fill="currentColor" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 200 L 200 200 L 200 100 Q 150 50 100 100 T 0 100 Z" />
            <circle cx="50" cy="150" r="20" fill="#F7F5F0" />
            <circle cx="150" cy="150" r="10" fill="#F7F5F0" />
          </svg>

          {/* Warm energetic glow overlay */}
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-t from-[#fbc02d]/10 to-transparent blur-[120px]" />
        </div>
        
        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-14">`;

content = content.replace(oldRegex, newSection);
fs.writeFileSync(path, content);
console.log('Updated memoria-afroterritorial section 2 background');
