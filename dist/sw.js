if(!self.define){let e,s={};const n=(n,i)=>(n=new URL(n+".js",i).href,s[n]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=s,document.head.appendChild(e)}else e=n,importScripts(n),s()})).then((()=>{let e=s[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(i,r)=>{const o=e||("document"in self?document.currentScript.src:"")||location.href;if(s[o])return;let t={};const d=e=>n(e,o),l={module:{uri:o},exports:t,require:d};s[o]=Promise.all(i.map((e=>l[e]||d(e)))).then((e=>(r(...e),t)))}}define(["./workbox-5ffe50d4"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index-Cyar1Ln5.css",revision:null},{url:"assets/index-D9_Iv-2g.js",revision:null},{url:"assets/workbox-window.prod.es5-B9K5rw8f.js",revision:null},{url:"index.html",revision:"23d9ec16c1b2a8cf85fb075f6c0afc2c"},{url:"pwa-192x192.png",revision:"518f02650669d259a4370f765ebedb86"},{url:"pwa-512x512.png",revision:"518f02650669d259a4370f765ebedb86"},{url:"manifest.webmanifest",revision:"9dd1a1e601bd88d71b77eeed1bcc4bac"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
