/** Inline on purpose: it must paint before any external CSS or JS has arrived. */
export const PAGE_LOADER_MIN_MS = 500;

export function buildPageLoaderCss(label: string): string {
  return `
html:not([data-ready])::before{content:${JSON.stringify(`${label}…`)};position:fixed;inset:0;z-index:2147483647;display:flex;align-items:flex-end;justify-content:center;padding-bottom:max(48px,env(safe-area-inset-bottom));box-sizing:border-box;background:#fff;color:#737373;font:500 14px/1.4 system-ui,-apple-system,sans-serif;letter-spacing:.02em}
html:not([data-ready])::after{content:"";position:fixed;top:50%;left:50%;z-index:2147483647;width:36px;height:36px;margin:-18px 0 0 -18px;border:3px solid #e5e5e5;border-top-color:#d92d3e;border-radius:50%;animation:brw-spin .7s linear infinite}
html.dark:not([data-ready])::before{background:#0a0a0a;color:#a3a3a3}
html.dark:not([data-ready])::after{border-color:#333;border-top-color:#d92d3e}
@keyframes brw-spin{to{transform:rotate(360deg)}}
@media (prefers-reduced-motion:reduce){html:not([data-ready])::after{animation-duration:2s}}
`;
}

/** Marks <html> ready once styles/scripts/fonts have loaded and React has hydrated; a timeout keeps the page from hanging. */
export const PAGE_LOADER_SCRIPT = `
(function(){
  var root=document.documentElement,started=Date.now(),done={load:false,fonts:false,app:false};
  function show(){root.setAttribute('data-ready','')}
  function check(){if(done.load&&done.fonts&&done.app)setTimeout(show,Math.max(0,${PAGE_LOADER_MIN_MS}-(Date.now()-started)))}
  function mark(k){return function(){done[k]=true;check()}}
  window.brwAppReady=mark('app');
  if(document.readyState==='complete')mark('load')();else window.addEventListener('load',mark('load'));
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(mark('fonts'),mark('fonts'));else mark('fonts')();
  setTimeout(show,8000);
})();
`;
