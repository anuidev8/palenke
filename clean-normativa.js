const fs = require('fs');
const path = 'src/app/memoria-afroterritorial/page.tsx';
let content = fs.readFileSync(path, 'utf8');

const oldRegex = /<section className="relative overflow-hidden bg-\[#EAE6DD\] px-4 py-14 sm:px-6 lg:px-8 border-b border-\[#e8dfd3\]">[\s\S]*?<div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-14">\s*\{\/\* Left — Normativa vigente card \*\/}\s*<div className="flex flex-col gap-6 rounded-\[28px\] border-2 border-\[#2e7d32\] bg-white p-8 shadow-sm">/m;

const newSection = `<section className="bg-[#f8f5f2] px-4 py-14 sm:px-6 lg:px-8 border-b border-[#e8dfd3]">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-14">

          {/* Left — Normativa vigente card (Gradient Border) */}
          <div className="relative rounded-[28px] p-[2px] bg-gradient-to-br from-[#2e7d32] via-[#fbc02d] to-[#d32f2f] shadow-sm">
            <div className="flex h-full flex-col gap-6 rounded-[26px] bg-white p-8">`;

if(content.match(oldRegex)) {
  content = content.replace(oldRegex, newSection);
  fs.writeFileSync(path, content);
  console.log('Fixed normative background and border');
} else {
  console.log('Could not match old section. Let me check the actual content');
}
