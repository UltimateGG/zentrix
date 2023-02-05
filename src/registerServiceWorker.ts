export function register() {
  if (!('serviceWorker' in navigator)) return;
  const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
  if (publicUrl.origin !== window.location.origin) return;

  window.addEventListener('load', () => {
    const swUrl = `${process.env.PUBLIC_URL}/sw.js`;
    registerValidSW(swUrl);
  });
}

function registerValidSW(swUrl: string) {
  navigator.serviceWorker.register(swUrl).then((registration) => {
    registration.onupdatefound = () => {
      const installingWorker = registration.installing;
      if (installingWorker == null) return;

      installingWorker.onstatechange = () => {
        if (installingWorker.state !== 'installed') return;
        if (navigator.serviceWorker.controller) {
          // At this point, the updated precached content has been fetched,
          // but the previous service worker will still serve the older
          // content until all client tabs are closed.
          console.log(
            'New content is available and will be used when all ' +
              'tabs for this page are closed. See https://cra.link/PWA.'
          );
        } else {
          // At this point, everything has been precached.
          // It's the perfect time to display a
          // "Content is cached for offline use." message.
          console.log('Content is cached for offline use.');
        }
      };
    };
  }).catch((error) => {
    console.error('Error during service worker registration:', error);
  });
}

export function unregister() {
  if (!('serviceWorker' in navigator)) return;

  navigator.serviceWorker.ready.then((registration) => {
    registration.unregister();
  }).catch((error) => {
    console.error(error.message);
  });
}
