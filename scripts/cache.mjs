import {readdir,readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
async function walk(dir){const files=[];for(const e of await readdir(dir,{withFileTypes:true})){const p=`${dir}/${e.name}`;if(e.isDirectory())files.push(...await walk(p));else if(e.name!=='sw.js')files.push(p);}return files;}
const files=await walk('dist');const hash=createHash('sha256');for(const f of files)hash.update(await readFile(f));
let sw=await readFile('dist/sw.js','utf8');sw=sw.replace("'dev'",JSON.stringify(hash.digest('hex').slice(0,16))).replace('/*PRECACHE*/ []',JSON.stringify(files.map(f=>'./'+f.slice(5))));await writeFile('dist/sw.js',sw);

