const fs = require('fs');

const path = 'src/app/memoria-afroterritorial/page.tsx';
let content = fs.readFileSync(path, 'utf8');

const oldSec2 = `<section className="border-b border-[#e8dfd3] bg-white px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-14">`;

const newSec2 = `<section className="relative overflow-hidden border-b border-[#e8dfd3] bg-white px-4 py-14 sm:px-6 lg:px-8">
        {/* Topographic Territory Background */}
        <div 
          className="pointer-events-none absolute inset-0 z-0 opacity-[0.04]"
          style={{ 
            backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"400\" height=\"400\" viewBox=\"0 0 400 400\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cpath d=\"M0 0h400v400H0V0zm200 400C89.543 400 0 310.457 0 200S89.543 0 200 0s200 89.543 200 200-89.543 200-200 200zm0-2c109.352 0 198-88.648 198-198S309.352 2 200 2 2 90.648 2 200s88.648 198 198 198zm0-40c87.26 0 158-70.74 158-158S287.26 42 200 42 42 112.74 42 200s70.74 158 158 158zm0-2c86.156 0 156-69.844 156-156S286.156 44 200 44 44 113.844 44 200s69.844 156 156 156zm0-40c65.17 0 118-52.83 118-118S265.17 82 200 82 82 134.83 82 200s52.83 118 118 118zm0-2c64.065 0 116-51.935 116-116S264.065 84 200 84 84 135.935 84 200s51.935 116 116 116zm0-40c43.08 0 78-34.92 78-78s-34.92-78-78-78-78 34.92-78 78 34.92 78 78 78zm0-2c41.973 0 76-34.027 76-76s-34.027-76-76-76-76 34.027-76 76 34.027 76 76 76zm0-40c20.987 0 38-17.013 38-38s-17.013-38-38-38-38 17.013-38 38 17.013 38 38 38zm0-2c19.882 0 36-16.118 36-36s-16.118-36-36-36-36 16.118-36 36 16.118 36 36 36z\" fill=\"%232e7d32\" fill-rule=\"evenodd\"/%3E%3C/svg%3E')", 
            backgroundSize: "200px 200px" 
          }}
          aria-hidden="true"
        />
        {/* Subtle glow for contrast */}
        <div className="absolute top-0 right-0 w-1/2 h-[400px] bg-gradient-to-l from-white to-transparent pointer-events-none z-0" />
        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-14">`;

content = content.replace(oldSec2, newSec2);
fs.writeFileSync(path, content);
console.log('Updated memoria-afroterritorial sec 2');
