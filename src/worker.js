function formatError(error) {
 if (error?.message) return String(error.message);
 if (error?.type) return 'Python runtime: ' + error.type + (error.filename ? ' (' + error.filename + ')' : '');
 if (typeof error === 'string') return error;
 try { const detail = JSON.stringify(error); if (detail && detail !== '{}') return detail; } catch {}
 return 'Python runtime не успя да стартира. Отвори приложението онлайн в Safari и опитай отново.';
}
let runtime;
let sequence=0;
onmessage=async({data})=>{
 if(data.type!=='run')return;
 let stage = runtime ? 'Изпълнение' : 'Инициализация на Python 0.28.3';
 try{
 if(!runtime){importScripts('./runtime/pyodide.js');runtime=await loadPyodide({indexURL:'./runtime/',enableRunUntilComplete:false,stderr:text=>postMessage({type:'output',channel:'stderr',text:text+'\n'})});const stdoutDecoder = new TextDecoder();const stderrDecoder = new TextDecoder();runtime.setStdout({write:bytes=>{const text=stdoutDecoder.decode(bytes.slice(),{stream:true});if(text)postMessage({type:'output',channel:'stdout',text});return bytes.length;}});runtime.setStderr({write:bytes=>{const text=stderrDecoder.decode(bytes.slice(),{stream:true});if(text)postMessage({type:'output',channel:'stderr',text});return bytes.length;}});}
 stage = 'Изпълнение';
 self.askInput=(prompt)=>{const id=crypto.randomUUID()+'-'+sequence++;postMessage({type:'input',id,prompt:String(prompt)});const xhr=new XMLHttpRequest();xhr.open('GET','./__input?id='+encodeURIComponent(id),false);xhr.send();if(xhr.status!==200)throw Error('Input timed out');return xhr.responseText;};
 runtime.runPython(`import builtins, sys\nfrom js import askInput\ndef _console_input(prompt=''):\n    sys.stdout.flush()\n    sys.stderr.flush()\n    return str(askInput(str(prompt)))\nbuiltins.input = _console_input`);
 const globals=runtime.toPy({__name__:'__main__'});
 try{await runtime.runPythonAsync(data.code,{globals});}finally{try{runtime.runPython('sys.stdout.flush(); sys.stderr.flush()');}catch{}try{globals.destroy();}catch{}}
 postMessage({type:'done'});
 }catch(error){const text=formatError(error);const reset=!runtime||/exit\(|Aborted|fatal|memory access out of bounds/i.test(text);if(reset)runtime=undefined;postMessage({type:'output',channel:'stderr',text:stage+': '+text+'\n'});postMessage({type:'done',reset});}
};

