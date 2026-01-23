// 版本號：如果修改了 index.html，請修改這裡的數字 (例如 v1 -> v2) 以強制更新快取
const CACHE_NAME = 'trip-app-v1.2';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  'https://unpkg.com/vue@3/dist/vue.global.js',
  'https://cdn.tailwindcss.com',
  'https://cdn.jsdelivr.net/npm/chart.js',
  'https://img.icons8.com/color/180/snowflake.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (e) => {
  // 對於 API 請求 (Google Script)，不快取，直接聯網
  if (e.request.url.includes('script.google.com')) {
      return; 
  }

  e.respondWith(
    caches.match(e.request).then((res) => {
      // 策略：快取優先，但背景更新 (Stale-while-revalidate)
      const fetchPromise = fetch(e.request).then((networkRes) => {
        caches.open(CACHE_NAME).then((cache) => cache.put(e.request, networkRes.clone()));
        return networkRes;
      });
      return res || fetchPromise;
    })
  );
});
