#!/usr/bin/env node
const fs = require('fs');
const glob = require('glob');
const path = require('path');

// copy d.ts files frm src to dist
const sourcePath = path.resolve(__dirname, '../src');
const distPath = path.resolve(__dirname, '../dist');
const files = glob.sync(sourcePath + '/**/*.d.ts');
for (const file of files) {
    const fileName = path.win32.basename(file);
    fs.copyFileSync(file, `${distPath}\\${fileName}`);
}
