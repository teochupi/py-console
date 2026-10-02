import {EditorView} from '@codemirror/view';
import {basicSetup} from 'codemirror';
import {python} from '@codemirror/lang-python';
import {insertion} from './toolbar.mjs';
import './style.css';
const app=document.querySelector<HTMLDivElement>('#app')!;
app.innerHTML=`<header><div><span class="mark">›_</span><h1>Py Console</h1></div><div class="header-actions"><span id="status" role="status">Подготовка…</span><button id="theme" type="button" aria-label="Смяна на цветния режим">Light mode</button></div></header><main><section class="editor-panel"><div class="panel-heading"><span>PYTHON <small class="app-caption">Runs on your device</small></span><div><button id="new">New</button><button id="export">Export .py</button><button id="run" class="primary" disabled>▶ Run</button><button id="stop" hidden>■ Stop</button></div></div><div id="editor"></div><nav id="toolbar" aria-label="Програмна лента"></nav><footer id="save" role="status"></footer></section><section class="console-panel"><div class="panel-heading"><span>OUTPUT / CONSOLE</span><button id="clear">Clear</button></div><pre id="output" aria-label="Python output" tabindex="0"></pre><form id="input-form" hidden><label id="prompt" for="input">Вход</label><div><input id="input" autocomplete="off" autocapitalize="off" spellcheck="false"><button class="primary">Enter ↵</button></div></form></section></main><aside><a href="https://teodor.chupetlov.eu" target="_blank" rel="noopener noreferrer">teodor.chupetlov.eu</a><span id="offline" role="status"></span></aside>`;
const el=(id:string)=>document.getElementById(id)!;
const run=el('run') as HTMLButtonElement;
let theme = 'dark';
try { theme = localStorage.getItem('py-console.theme') === 'light' ? 'light' : 'dark'; } catch {}
function applyTheme() {
  document.documentElement.dataset.theme = theme;
  el('theme').textContent = theme === 'dark' ? 'Light mode' : 'Dark mode';
  el('theme').setAttribute('aria-label', theme === 'dark' ? 'Включи светъл режим' : 'Включи тъмен режим');
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#111b27' : '#f3f6fa');
}
applyTheme();
el('theme').onclick = () => {
  theme = theme === 'dark' ? 'light' : 'dark';
  applyTheme();
  try { localStorage.setItem('py-console.theme', theme); } catch {}
};
let restored='';try{restored=localStorage.getItem('py-console.code')||'';}catch{el('save').textContent='Локалното запазване е недостъпно';}
const editor=new EditorView({doc:restored,parent:el('editor'),extensions:[basicSetup,python(),EditorView.lineWrapping,EditorView.theme({'&':{height:'100%'},'.cm-scroller':{overflow:'auto',fontFamily:'Consolas, monospace'},'.cm-content':{minHeight:'240px'}}),EditorView.updateListener.of(update=>{if(update.docChanged){try{localStorage.setItem('py-console.code',update.state.doc.toString());el('save').textContent='';}catch{el('save').textContent='Неуспешно локално запазване — използвайте Export .py';}}})]});
for(const key of ['TAB','←','→','()','[]','{}',':','"',"'",'=','_','#']){const b=document.createElement('button');b.textContent=key;b.type='button';b.setAttribute('aria-label',key==='TAB'?'Вмъкни 4 интервала':key);b.onpointerdown=e=>e.preventDefault();b.onclick=()=>{const s=editor.state.selection.main;if(key==='←'||key==='→'){const pos=Math.max(0,Math.min(editor.state.doc.length,s.head+(key==='←'?-1:1)));editor.dispatch({selection:{anchor:pos},scrollIntoView:true});}else{const change=insertion(editor.state.doc.toString(),s.from,s.to,key);editor.dispatch({changes:{from:change.from,to:change.to,insert:change.insert},selection:{anchor:change.anchor,head:change.head},scrollIntoView:true});}editor.focus();};el('toolbar').append(b);}
let worker:Worker|undefined,inputId:string|undefined,ready=false;
function finish(){run.disabled=!ready;el('stop').hidden=true;el('input-form').hidden=true;inputId=undefined;el('status').textContent='';}
function append(text:string){const out=el('output');out.textContent=(out.textContent+text).slice(-200000);out.scrollTop=out.scrollHeight;}
el('new').onclick=()=>{if(editor.state.doc.length&&!confirm('Да изчистя текущия код?'))return;worker?.terminate();worker=undefined;editor.dispatch({changes:{from:0,to:editor.state.doc.length,insert:''}});el('output').textContent='';(el('input') as HTMLInputElement).value='';finish();editor.focus();};
el('export').onclick=()=>{const url=URL.createObjectURL(new Blob([editor.state.doc.toString()],{type:'text/x-python;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='session.py';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
el('clear').onclick=()=>{el('output').textContent='';};
run.onclick=()=>{run.disabled=true;el('stop').hidden=false;el('status').textContent='Изпълнение…';el('output').textContent='';worker??=new Worker(new URL('./worker.js',document.baseURI));worker.onmessage=({data})=>{if(data.type==='output')append(data.text);if(data.type==='done')finish();if(data.type==='input'){inputId=data.id;el('prompt').textContent=data.prompt||'Вход';el('input-form').hidden=false;el('status').textContent='Очаква вход';(el('input') as HTMLInputElement).focus();}};worker.onerror=e=>{append(e.message+'\n');worker?.terminate();worker=undefined;finish();};worker.postMessage({type:'run',code:editor.state.doc.toString()});};
el('stop').onclick=()=>{worker?.terminate();worker=undefined;if(inputId)navigator.serviceWorker.controller?.postMessage({type:'input',id:inputId,value:''});append('Изпълнението е спряно.\n');finish();};
el('input-form').onsubmit=e=>{e.preventDefault();if(!inputId)return;const field=el('input') as HTMLInputElement;navigator.serviceWorker.controller?.postMessage({type:'input',id:inputId,value:field.value});append((el('prompt').textContent==='Вход'?'':el('prompt').textContent)+field.value+'\n');field.value='';inputId=undefined;el('input-form').hidden=true;el('status').textContent='Изпълнение…';};
async function init(){try{await navigator.serviceWorker.register(new URL('./sw.js',document.baseURI),{scope:new URL('./',document.baseURI).pathname});await navigator.serviceWorker.ready;if(!navigator.serviceWorker.controller)await new Promise<void>(resolve=>navigator.serviceWorker.addEventListener('controllerchange',()=>resolve(),{once:true}));ready=true;finish();}catch(error){el('status').textContent='PWA грешка';el('offline').textContent=String(error);}}
init();





