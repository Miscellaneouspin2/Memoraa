/* Memoraa Step 8 - privacy-first service worker */
const VERSION='memoraa-step8-v1';
const SHELL=`${VERSION}-public-shell`;
const PUBLIC_SHELL=['./mother-website(8).html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
const PRIVATE_PATHS=[/customer-workspace/i,/admin-dashboard/i,/\/api\//i,/\/auth\//i,/\/account\//i,/\/orders?\//i,/\/payments?\//i,/\/invoices?\//i,/\/uploads?\//i,/\/messages?\//i,/\/documents?\//i,/\/approvals?\//i,/\/revisions?\//i,/\/audit/i,/\/reconciliation/i,/\/support\/tickets/i];
function privateRequest(req,url){
 if(req.method!=='GET') return true;
 if(req.headers.has('authorization')||req.headers.has('cookie')) return true;
 if(req.cache==='no-store'||req.credentials==='include') return true;
 return PRIVATE_PATHS.some(rx=>rx.test(url.pathname));
}
self.addEventListener('install',event=>event.waitUntil(caches.open(SHELL).then(c=>c.addAll(PUBLIC_SHELL))));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
 for(const key of await caches.keys()) if(key.startsWith('memoraa-')&&key!==SHELL) await caches.delete(key);
 await self.clients.claim();
})()));
self.addEventListener('message',event=>{if(event.data&&event.data.type==='SKIP_WAITING') self.skipWaiting();});
self.addEventListener('fetch',event=>{
 const req=event.request, url=new URL(req.url);
 if(url.origin!==self.location.origin) return; // third-party resources remain network-managed
 if(privateRequest(req,url)){
   event.respondWith(fetch(req,{cache:'no-store'}).catch(()=>new Response(
    '<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Private area unavailable</title><style>body{font:16px system-ui;background:#080a0f;color:#f8f2e8;padding:2rem}main{max-width:42rem;margin:auto;border:1px solid #d6a94a;border-radius:24px;padding:2rem}a{color:#f3cd72}</style><main><h1>Private area unavailable offline</h1><p>For your privacy, customer and administration information is never stored in the offline cache. Reconnect and retry.</p><p lang="hi">आपकी गोपनीयता के लिए ग्राहक और एडमिन जानकारी ऑफलाइन कैश में सहेजी नहीं जाती। इंटरनेट से जुड़कर दोबारा कोशिश करें।</p><a href="./mother-website(8).html">Return to Memoraa</a></main>',
    {status:503,headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'}})));
   return;
 }
 if(req.mode==='navigate'){
   event.respondWith((async()=>{
    try{const res=await fetch(req,{cache:'no-store'}); if(res.ok&&url.pathname.endsWith('mother-website(8).html')){const c=await caches.open(SHELL);c.put('./mother-website(8).html',res.clone());} return res;}
    catch{return (await caches.match('./mother-website(8).html'))||new Response('Offline',{status:503});}
   })()); return;
 }
 if(PUBLIC_SHELL.some(x=>url.pathname.endsWith(x.replace('./','')))){
   event.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(async res=>{if(res.ok){const c=await caches.open(SHELL);c.put(req,res.clone())}return res}))); 
 }
});
