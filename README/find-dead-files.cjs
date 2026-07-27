const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function getFiles(dir, filesList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getFiles(filePath, filesList);
    } else if (filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
      filesList.push(filePath);
    }
  }
  return filesList;
}

const allFiles = getFiles(srcDir);
const visited = new Set();

function crawl(filePath) {
  if (visited.has(filePath)) return;
  visited.add(filePath);

  const content = fs.readFileSync(filePath, 'utf8');
  
  // Match `import ... from '...'` and `import('...')`
  const importRegex = /import.*?from\s+['"]([^'"]+)['"]|import\(['"]([^'"]+)['"]\)/g;
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    const importPath = match[1] || match[2];
    if (importPath.startsWith('.')) {
      let resolvedPath = path.resolve(path.dirname(filePath), importPath);
      let found = false;

      // check exact, .js, .jsx, /index.js, /index.jsx
      const checks = [
        resolvedPath,
        resolvedPath + '.js',
        resolvedPath + '.jsx',
        path.join(resolvedPath, 'index.js'),
        path.join(resolvedPath, 'index.jsx')
      ];

      for (const check of checks) {
        if (fs.existsSync(check) && !fs.statSync(check).isDirectory()) {
          crawl(check);
          found = true;
          break;
        }
      }
    }
  }
}

// Start crawling from main entries
crawl(path.join(srcDir, 'main.jsx'));

const deadFiles = allFiles.filter(f => !visited.has(f));
console.log(JSON.stringify(deadFiles, null, 2));
