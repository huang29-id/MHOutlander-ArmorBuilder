// Offline support: pages load from the network when online (so updates show up), and fall back to the cache offline.
const CACHE="forge-v2";
const FILES=["./","index.html","manifest.webmanifest","icons/icon-192.png","icons/icon-512.png","icons/icon-maskable-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET"||new URL(e.request.url).origin!==location.origin) return;
  e.respondWith(fetch(e.request,{cache:"no-cache"}).then(r=>{const cp=r.clone(); caches.open(CACHE).then(c=>c.put(e.request,cp)); return r}).catch(()=>caches.match(e.request).then(m=>m||caches.match("./"))));
});
