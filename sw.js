const C='sal-v2';
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(['./','index.html'])))});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!=C).map(x=>caches.delete(x)))).then(()=>clients.claim())));
self.addEventListener('fetch',e=>{const r=e.request,u=new URL(r.url);
if(r.method!='GET'||r.headers.has('range')||/\.m4a$/.test(u.pathname))return;
if(u.origin!=location.origin&&!/cdn\.jsdelivr\.net/.test(u.host))return;
const html=r.mode=='navigate'||/index\.html$|\/$/.test(u.pathname);
const put=res=>{const cp=res.clone();caches.open(C).then(c=>c.put(r,cp));return res};
e.respondWith(html?fetch(r).then(put).catch(()=>caches.match(r).then(h=>h||caches.match('index.html'))):caches.match(r).then(h=>h||fetch(r).then(put).catch(()=>h)));});
