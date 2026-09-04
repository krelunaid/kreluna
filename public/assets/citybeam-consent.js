(() => {
  const key = 'kreluna-cookie-choice';
  const banner = document.getElementById('cookie-banner');
  const settings = document.getElementById('cookie-settings');
  let choice;
  try { choice = localStorage.getItem(key); } catch {}
  function show(visible) { banner.hidden = !visible; settings.hidden = visible; }
  function track() {
    if (choice !== 'accepted') return;
    if (!window.fbq) {
      const fbq = window.fbq = window._fbq = function () {
        if (fbq.callMethod) fbq.callMethod.apply(fbq, arguments);
        else fbq.queue.push(arguments);
      };
      fbq.queue = []; fbq.loaded = true; fbq.version = '2.0';
      const script = document.createElement('script');
      script.async = true; script.src = 'https://connect.facebook.net/en_US/fbevents.js';
      document.head.appendChild(script);
      fbq('init', '1347647340858998');
    }
    window.fbq('consent', 'grant');
    if (!window.__krelunaMetaLastPage) {
      window.fbq('track', 'PageView');
      window.__krelunaMetaLastPage = location.pathname;
    }
  }
  settings.addEventListener('click', () => show(true));
  banner.addEventListener('click', event => {
    const button = event.target.closest('[data-choice]');
    if (!button) return;
    choice = button.dataset.choice;
    try { localStorage.setItem(key, choice); } catch {}
    window.dispatchEvent(new CustomEvent('kreluna-consent-change', { detail: { choice } }));
    if (choice === 'accepted') track(); else window.fbq?.('consent', 'revoke');
    show(false); settings.focus();
  });
  show(!choice); track();
})();
