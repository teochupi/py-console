const VERSION='dev';
const FILES=/*PRECACHE*/ [];
const CACHE='py-console-'+VERSION;
const pending=new Map();
self.addEventListener('install',event=>event.waitUntil((async()=>{const cache=await caches.open(CACHE);await cache.addAll(FILES);})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{const older=(await caches.keys()).filter(key=>key.startsWith('py-console-')&&key!==CACHE);for(const key of older.slice(0,-1))await caches.delete(key);await self.clients.claim();})()));
self.addEventListener('message',event=>{const {type,id,value}=event.data||{};if(type==='input'){const resolve=pending.get(id);if(resolve){resolve(new Response(value,{headers:{'Content-Type':'text/plain; charset=utf-8'}}));pending.delete(id);}}});
self.addEventListener('fetch',event=>{const url=new URL(event.request.url);if(url.origin!==self.location.origin)return;if(url.pathname.endsWith('/__input')){event.respondWith(new Promise(resolve=>{pending.set(url.searchParams.get('id'),resolve);setTimeout(()=>{if(pending.delete(url.searchParams.get('id')))resolve(new Response('',{status:408}));},300000);}));return;}if(event.request.method!=='GET')return;event.respondWith((async()=>{const cache=await caches.open(CACHE);const cached=await cache.match(event.request,{ignoreVary:true});if(cached)return cached;if(event.request.mode==='navigate'&&FILES.length){const index=await cache.match(new URL('./index.html',self.registration.scope));if(index)return index;}if(url.pathname.includes('/assets/')){const previous=await caches.match(event.request,{ignoreVary:true});if(previous)return previous;}return fetch(event.request);})());});


