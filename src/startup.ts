/** Wait for a controlling service worker without leaving the UI stuck forever. */
export function prepareServiceWorker(timeoutMs = 45000): Promise<void> {
  return new Promise((resolve, reject) => {
    const container = navigator.serviceWorker;
    if (!container) { reject(new Error('Браузърът не поддържа offline режим.')); return; }
    let done = false;
    let registered = false;
    let installing: ServiceWorker | null = null;
    const cleanup = () => {
      clearTimeout(timer);
      container.removeEventListener('controllerchange', check);
      installing?.removeEventListener('statechange', stateChanged);
    };
    const settle = (error?: Error) => {
      if (done) return;
      done = true;
      cleanup();
      if (error) reject(error); else resolve();
    };
    const check = () => { if (registered && container.controller) settle(); };
    const stateChanged = () => {
      if (installing?.state === 'redundant' && !container.controller)
        settle(new Error('Изтеглянето на offline файловете не завърши. Проверете връзката и опитайте отново.'));
      else check();
    };
    const timer = setTimeout(() => settle(new Error('Подготовката се забави. Проверете интернет връзката и опитайте отново.')), timeoutMs);
    container.addEventListener('controllerchange', check);
    container.register(new URL('./sw.js', document.baseURI), {scope:new URL('./',document.baseURI).pathname})
      .then(registration => {
        if (done) return;
        registered = true;
        installing = registration.installing;
        installing?.addEventListener('statechange', stateChanged);
        stateChanged();
      })
      .catch(error => settle(error instanceof Error ? error : new Error(String(error))));
  });
}
