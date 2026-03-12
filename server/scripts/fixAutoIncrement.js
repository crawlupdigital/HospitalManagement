const fs = require('fs');
const path = require('path');

const modelsDir = path.join(__dirname, '../models');
const files = fs.readdirSync(modelsDir);

let patched = 0;
files.forEach(file => {
  if (file.endsWith('.js') && file !== 'index.js') {
    const filePath = path.join(modelsDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Regex to find primaryKey: true without autoIncrement
    if (content.includes('primaryKey: true') && !content.includes('autoIncrement: true')) {
       // Replace primaryKey: true with primaryKey: true,\n    autoIncrement: true
       content = content.replace(/primaryKey:\s*true/g, 'primaryKey: true,\n    autoIncrement: true');
       fs.writeFileSync(filePath, content);
       patched++;
       console.log(`Patched ${file}`);
    }
  }
});

console.log(`Patched ${patched} files`);
