import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
const source=await readFile(new URL('../public/sw.js',import.meta.url),'utf8');
function bridge(){
 const listeners=new Map(),timers=[];
 const self={location:{origin:'https://example.test'},registration:{scope:'https://example.test/app/'},addEventListener:(name,handler)=>listeners.set(name,handler)};
 vm.runInNewContext(source,{self,URL,Response,Map,Set,setTimeout:(fn,delay)=>{timers.push({fn,delay});return timers.length;}});
 const request=id=>{let response;listeners.get('fetch')({request:{url:'https://example.test/app/__input?id='+id},clientId:'worker',respondWith:promise=>{response=promise;}});return response;};
 const message=(type,id,value)=>{let ack;listeners.get('message')({data:{type,id,value},source:{id:'window'},ports:[{postMessage:data=>{ack=data;}}]});return ack;};
 return {request,message,advance:ms=>{for(const timer of timers.splice(0))if(timer.delay<=ms)timer.fn();}};
}
test('input can wait beyond five minutes and still accept a response',async()=>{
 const b=bridge();const response=b.request('long');let settled=false;response.then(()=>{settled=true;});
 b.advance(360000);await Promise.resolve();assert.equal(settled,false);
 assert.equal(b.message('input','long','42').ok,true);
 const result=await response;assert.equal(result.status,200);assert.equal(await result.text(),'42');
 assert.equal(b.message('input','long','again').ok,false);
});
test('Stop releases a pending input and a lost request is rejected explicitly',async()=>{
 const b=bridge();const response=b.request('stop');
 assert.equal(b.message('cancel-input','stop').ok,true);
 assert.equal((await response).status,410);
 assert.equal(b.message('input','stop','42').ok,false);
 assert.equal(b.message('input','missing','42').ok,false);
});
