// Offline support: pages load from the network when online (so updates show up), and fall back to the cache offline.
const CACHE="forge-v9", IMG="forge-img";
const FILES=["./","index.html","manifest.webmanifest","icons/icon-192.png","icons/icon-512.png","icons/icon-maskable-512.png","icons/visages.webp","icons/adventurers.webp"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE&&x!==IMG).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const u=new URL(e.request.url);
  // equipment icons from gacha.gg: keep a copy so they also show offline
  if(e.request.method==="GET"&&u.hostname==="www.gacha.gg"){ e.respondWith(caches.open(IMG).then(c=>c.match(e.request).then(m=>m||fetch(e.request).then(r=>{ if(r.ok||r.type==="opaque") c.put(e.request,r.clone()); return r })))); return }
  if(e.request.method!=="GET"||u.origin!==location.origin) return;
  e.respondWith(fetch(e.request,{cache:"no-cache"}).then(r=>{const cp=r.clone(); caches.open(CACHE).then(c=>c.put(e.request,cp)); return r}).catch(()=>caches.match(e.request).then(m=>m||caches.match("./"))));
});
