const METRIKA_ID_PATTERN = /^\d+$/;
const GA_ID_PATTERN = /^G-[A-Z0-9]+$/;

interface AnalyticsIds {
  metrikaId?: string;
  gaId?: string;
}

let isLoaded = false;

function addScript(attributes: { src?: string; text?: string }): void {
  const script = document.createElement('script');
  script.async = true;
  if (attributes.src) {
    script.src = attributes.src;
  }
  if (attributes.text) {
    script.text = attributes.text;
  }
  document.head.append(script);
}

/** Whether the pages must be reloaded to stop the counters that already run. */
export function isAnalyticsLoaded(): boolean {
  return isLoaded;
}

/** Adds the Metrika and GA4 scripts for the ids that are set. Call only after the visitor accepted cookies. */
export function loadAnalytics({ metrikaId, gaId }: AnalyticsIds): void {
  if (isLoaded || typeof document === 'undefined') {
    return;
  }
  const hasMetrika = Boolean(metrikaId && METRIKA_ID_PATTERN.test(metrikaId));
  const hasGa = Boolean(gaId && GA_ID_PATTERN.test(gaId));
  if (!hasMetrika && !hasGa) {
    return;
  }
  isLoaded = true;
  if (hasMetrika) {
    addScript({
      text: `(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,'script','https://mc.yandex.ru/metrika/tag.js','ym');ym(${metrikaId},'init',{clickmap:true,trackLinks:true,accurateTrackBounce:true});`,
    });
  }
  if (hasGa) {
    addScript({ src: `https://www.googletagmanager.com/gtag/js?id=${gaId}` });
    addScript({
      text: `window.dataLayer=window.dataLayer||[];window.gtag=function(){window.dataLayer.push(arguments)};gtag('js',new Date());gtag('config','${gaId}');`,
    });
  }
}
