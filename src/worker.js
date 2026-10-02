let runtime;
let sequence=0;
onmessage=async({data})=>{
 if(data.type!=='run')return;
 try{
 if(!runtime){importScripts('./runtime/pyodide.js');runtime=await loadPyodide({indexURL:'./runtime/'});runtime.setStdout({batched:text=>postMessage({type:'output',channel:'stdout',text:text+'\n'})});runtime.setStderr({batched:text=>postMessage({type:'output',text:text+'\n'})});}
 self.askInput=(prompt)=>{const id=crypto.randomUUID()+'-'+sequence++;postMessage({type:'input',id,prompt:String(prompt)});const xhr=new XMLHttpRequest();xhr.open('GET','./__input?id='+encodeURIComponent(id),false);xhr.send();if(xhr.status!==200)throw Error('Input timed out');return xhr.responseText;};
 runtime.runPython(`import builtins, sys\nfrom js import askInput\ndef _console_input(prompt=''):\n    sys.stdout.flush()\n    sys.stderr.flush()\n    return str(askInput(str(prompt)))\nbuiltins.input = _console_input`);
 const globals=runtime.toPy({__name__:'__main__'});
 try{await runtime.runPythonAsync(data.code,{globals});}finally{globals.destroy();}
 postMessage({type:'done'});
 }catch(error){postMessage({type:'output',channel:'stderr',text:String(error)+'\n'});postMessage({type:'done'});}
};



