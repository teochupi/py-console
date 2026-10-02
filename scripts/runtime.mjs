import {mkdir,copyFile} from 'node:fs/promises';
await mkdir('public/runtime',{recursive:true});
await copyFile('src/worker.js','public/worker.js');
for(const name of ['pyodide.js','pyodide.asm.js','pyodide.asm.wasm','python_stdlib.zip','pyodide-lock.json']) await copyFile(`node_modules/pyodide/${name}`,`public/runtime/${name}`);

