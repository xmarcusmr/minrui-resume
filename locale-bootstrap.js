/* Only explicit language selections are remembered. No third-party requests. */
(() => {
  const valid = value => ['zh', 'en', 'ko'].includes(value);
  const regionLocale = country => {
    country = String(country || '').trim().toUpperCase();
    return country === 'KR' ? 'ko' : ['CN', 'HK', 'MO', 'TW'].includes(country) ? 'zh' : 'en';
  };
  const browserLanguage = String(navigator.language || '').toLowerCase();
  const fallback = browserLanguage.startsWith('ko') ? 'ko' : browserLanguage.startsWith('zh') ? 'zh' : 'en';
  const preferenceKey = 'portfolio-manual-language-v2';
  let manual = null;
  try { manual = localStorage.getItem(preferenceKey); } catch {}
  const initial = valid(manual) ? manual : fallback;
  // Avoid briefly showing the wrong language while the local country API resolves.
  if (!valid(manual) && location.protocol !== 'file:') {
    document.documentElement.setAttribute('data-locale-pending', '');
    setTimeout(() => document.documentElement.removeAttribute('data-locale-pending'), 2000);
  }
  const detect = async () => {
    if (valid(manual) || location.protocol === 'file:') return initial;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 1800);
    try {
      const response = await fetch('/api/visitor-country', {
        signal: controller.signal, cache: 'no-store', credentials: 'same-origin'
      });
      if (!response.ok) return initial;
      const data = await response.json();
      const country = String(data.country || '').trim().toUpperCase();
      return /^[A-Z]{2}$/.test(country) ? regionLocale(country) : initial;
    } catch { return initial; }
    finally { clearTimeout(timer); }
  };
  window.portfolioLocale = {
    initial, regionLocale, ready: detect(),
    remember(locale) {
      if (!valid(locale)) return;
      try { localStorage.setItem(preferenceKey, locale); } catch {}
    }
  };
})();
