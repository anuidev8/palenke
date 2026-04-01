const fs = require('fs');

function encodeSVGQuotes(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/backgroundImage:\s*"url\('data:image\/svg\+xml,(.*?)'\)"/g, (match, svgContent) => {
    // Replace unescaped double quotes with %22 inside the svg string
    const encodedSVG = svgContent.replace(/"/g, "%22").replace(/'/g, "%27").replace(/</g, "%3C").replace(/>/g, "%3E");
    return `backgroundImage: "url('data:image/svg+xml,${encodedSVG}')"`;
  });
  fs.writeFileSync(file, content);
}

encodeSVGQuotes('src/app/page.tsx');
encodeSVGQuotes('src/app/memoria-afroterritorial/page.tsx');
console.log('Fixed quotes in both files');
