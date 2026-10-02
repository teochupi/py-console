import {EditorView} from '@codemirror/view';
import {basicSetup} from 'codemirror';
import {python} from '@codemirror/lang-python';
import {insertion} from './toolbar.mjs';
import {HighlightStyle, syntaxHighlighting} from '@codemirror/language';
import {tags} from '@lezer/highlight';
import {Transcript} from './transcript';
import {prepareServiceWorker} from './startup';
import './style.css';
const app=document.querySelector<HTMLDivElement>('#app')!;
window.dispatchEvent(new Event('py-console-started'));
app.innerHTML=`<header><div><span class="mark">›_</span><h1>Py Console</h1></div><div class="header-actions"><span id="status" role="status">Подготовка…</span><button id="theme" type="button" aria-label="Смяна на цветния режим">Light mode</button></div></header><main><section class="editor-panel"><div class="panel-heading"><span>PYTHON <small class="app-caption">Runs on your device</small></span><div><button id="new">New</button><button id="export">Export .py</button><button id="run" class="primary" disabled>▶ Run</button><button id="stop" hidden>■ Stop</button></div></div><div id="editor"></div><nav id="toolbar" aria-label="Програмна лента"></nav><footer id="save" role="status"></footer></section><section class="console-panel"><div class="panel-heading"><span>OUTPUT / CONSOLE</span><button id="clear">Clear</button></div><pre id="output" aria-label="Python console" tabindex="0"></pre><form id="input-form" hidden><label id="prompt" for="input">Вход</label><div><input id="input" autocomplete="off" autocapitalize="off" spellcheck="false"><button class="primary">Enter ↵</button></div></form></section></main><aside><a href="https://teodor-chupetlov.eu/" target="_blank" rel="noopener noreferrer external">teodor-chupetlov.eu</a><span id="offline" role="status"></span><button id="retry" type="button" hidden>Опитай отново</button></aside>`;
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
const codeHighlight = syntaxHighlighting(HighlightStyle.define([
  {tag: tags.keyword, class: 'pc-keyword'},
  {tag: [tags.number, tags.bool, tags.null], class: 'pc-number'},
  {tag: [tags.string, tags.special(tags.string)], class: 'pc-string'},
  {tag: tags.comment, class: 'pc-comment'},
  {tag: [tags.function(tags.variableName), tags.function(tags.propertyName)], class: 'pc-function'},
  {tag: [tags.typeName, tags.className], class: 'pc-type'},
  {tag: tags.operator, class: 'pc-operator'},
  {tag: [tags.punctuation, tags.bracket], class: 'pc-punctuation'},
  {tag: [tags.variableName, tags.propertyName], class: 'pc-variable'},
]));
const editor=new EditorView({doc:restored,parent:el('editor'),extensions:[basicSetup,python(),codeHighlight,EditorView.lineWrapping,EditorView.theme({'&':{height:'100%'},'.cm-scroller':{overflow:'auto',fontFamily:'Consolas, monospace'},'.cm-content':{minHeight:'240px'}}),EditorView.updateListener.of(update=>{if(update.docChanged){try{localStorage.setItem('py-console.code',update.state.doc.toString());el('save').textContent='';}catch{el('save').textContent='Неуспешно локално запазване — използвайте Export .py';}}})]});
for(const key of ['TAB','←','→','()','[]','{}',':','"',"'",'=','_','#']){const b=document.createElement('button');b.textContent=key;b.type='button';b.setAttribute('aria-label',key==='TAB'?'Вмъкни 4 интервала':key);b.onpointerdown=e=>e.preventDefault();b.onclick=()=>{const s=editor.state.selection.main;if(key==='←'||key==='→'){const pos=Math.max(0,Math.min(editor.state.doc.length,s.head+(key==='←'?-1:1)));editor.dispatch({selection:{anchor:pos},scrollIntoView:true});}else{const change=insertion(editor.state.doc.toString(),s.from,s.to,key);editor.dispatch({changes:{from:change.from,to:change.to,insert:change.insert},selection:{anchor:change.anchor,head:change.head},scrollIntoView:true});}editor.focus();};el('toolbar').append(b);}
const transcript = new Transcript(el('output'));
let pendingPrompt = '';
let worker:Worker|undefined,inputId:string|undefined,ready=false;
let executionCode='',inputIndex=0,generation=0;
let transportId:string|undefined;
type InputDraft={code:string;prompt:string;index:number;value:string};
let draft:InputDraft|undefined;
try{const raw=localStorage.getItem('py-console.input-draft');if(raw){const value=JSON.parse(raw);if(typeof value.code==='string'&&typeof value.prompt==='string'&&typeof value.value==='string'&&Number.isInteger(value.index))draft=value;}}catch{}
function clearDraft(){draft=undefined;try{localStorage.removeItem('py-console.input-draft');}catch{}}
function markExecution(active:boolean){try{if(active)sessionStorage.setItem('py-console.running','1');else sessionStorage.removeItem('py-console.running');}catch{}}
function interruptionText(){
 let saved=false;try{saved=localStorage.getItem('py-console.code')===editor.state.doc.toString();}catch{}
 return 'Изпълнението беше прекъснато. '+(saved?'Кодът ти е запазен — ':'')+'Натисни Run отново.\n';
}
function cancelInput(){for(const id of new Set([inputId,transportId]))if(id)navigator.serviceWorker.controller?.postMessage({type:'cancel-input',id});transportId=undefined;}
window.addEventListener('pagehide',event=>{if(!event.persisted)cancelInput();});
function interrupted(){generation++;cancelInput();worker?.terminate();worker=undefined;transcript.append(interruptionText(),'system');finish();}
try{if(sessionStorage.getItem('py-console.running')){sessionStorage.removeItem('py-console.running');transcript.append(interruptionText(),'system');}}catch{}
(el('input') as HTMLInputElement).oninput=()=>{
 if(!inputId)return;
 draft={code:executionCode,prompt:pendingPrompt,index:inputIndex,value:(el('input') as HTMLInputElement).value};
 try{localStorage.setItem('py-console.input-draft',JSON.stringify(draft));}catch{el('save').textContent='Отговорът не може да се запази на устройството.';}
};
function finish(){markExecution(false);run.disabled=!ready;el('stop').hidden=true;el('input-form').hidden=true;inputId=undefined;el('status').textContent='';}

el('new').onclick=()=>{if(editor.state.doc.length&&!confirm('Да изчистя текущия код?'))return;generation++;cancelInput();clearDraft();worker?.terminate();worker=undefined;editor.dispatch({changes:{from:0,to:editor.state.doc.length,insert:''}});transcript.clear();(el('input') as HTMLInputElement).value='';finish();editor.focus();};
el('export').onclick=()=>{const url=URL.createObjectURL(new Blob([editor.state.doc.toString()],{type:'text/x-python;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='session.py';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
el('clear').onclick=()=>{transcript.clear();};
run.onclick=()=>{generation++;executionCode=editor.state.doc.toString();inputIndex=0;markExecution(true);run.disabled=true;el('stop').hidden=false;el('status').textContent='Изпълнение…';transcript.clear();worker??=new Worker(new URL('./worker.js',document.baseURI));const activeWorker=worker;worker.onmessage=({data})=>{if(worker!==activeWorker)return;if(data.type==='output')transcript.append(data.text, data.channel === 'stderr' ? 'stderr' : 'stdout');if(data.type==='interrupted'){interrupted();return;}if(data.type==='done'){if(draft?.code===executionCode&&draft.index<=inputIndex&&!inputId)clearDraft();if(data.reset){worker?.terminate();worker=undefined;}finish();}if(data.type==='input'){inputId=data.id;pendingPrompt=data.prompt;inputIndex++;(el('input') as HTMLInputElement).value=draft?.code===executionCode&&draft.prompt===pendingPrompt&&draft.index===inputIndex?draft.value:'';el('prompt').textContent=data.prompt||'Вход';el('input-form').hidden=false;el('status').textContent='Очаква вход';(el('input') as HTMLInputElement).focus();}};worker.onerror=e=>{if(worker!==activeWorker)return;if(inputId){interrupted();return;}transcript.append((e.message || 'Python worker не може да стартира в този браузър.')+'\n', 'stderr');worker?.terminate();worker=undefined;finish();};worker.postMessage({type:'run',code:executionCode});};
el('stop').onclick=()=>{generation++;cancelInput();worker?.terminate();worker=undefined;transcript.append('Изпълнението е спряно.\n', 'system');finish();};
el('input-form').onsubmit=async e=>{
 e.preventDefault();if(!inputId)return;
 const id=inputId,field=el('input') as HTMLInputElement;
 const controller=navigator.serviceWorker.controller;
 if(!controller){interrupted();return;}
 const value=field.value,runGeneration=generation;
 const submittedDraft:InputDraft={code:executionCode,prompt:pendingPrompt,index:inputIndex,value};
 draft=submittedDraft;
 try{localStorage.setItem('py-console.input-draft',JSON.stringify(draft));}catch{}
 // Record input before releasing Python, so output always follows the response.
 transcript.append(pendingPrompt+value+'\n','input');
 field.value='';inputId=undefined;transportId=id;el('input-form').hidden=true;el('status').textContent='Изпълнение…';
 const channel=new MessageChannel();
 let timer:ReturnType<typeof setTimeout>|undefined;
 try{
  const ok=await new Promise<boolean>((resolve,reject)=>{
   channel.port1.onmessage=event=>resolve(event.data?.ok===true);
   timer=setTimeout(()=>reject(new Error('No input acknowledgement')),10000);
   controller.postMessage({type:'input',id,value},[channel.port2]);
  });
  if(generation!==runGeneration)return;
  if(!ok){interrupted();return;}
  if(draft===submittedDraft)clearDraft();
 }catch{
  if(generation===runGeneration&&run.disabled&&!inputId){
   inputId=id;field.value=value;el('input-form').hidden=false;
   el('status').textContent='Входът не е потвърден — опитай отново или Stop';
  }
 }finally{
  if(timer)clearTimeout(timer);
  if(transportId===id)transportId=undefined;
  channel.port1.close();channel.port2.close();
 }
};
async function init(){
 el('retry').hidden=true;
 el('status').textContent='Подготовка…';
 el('offline').textContent='';
 try{
  await prepareServiceWorker();
  ready=true;
  finish();
 }catch(error){
  ready=false;
  run.disabled=true;
  el('status').textContent='Подготовката не завърши';
  el('offline').textContent=error instanceof Error ? error.message : String(error);
  el('retry').hidden=false;
 }
}
el('retry').onclick=()=>{void init();};
void init();
