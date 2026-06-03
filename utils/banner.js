/* tools/utils/banner.js
   Inline dismissible warning banners.
   Self-loads banner.css.

   API:
     createBanner(id, opts) → bannerEl
       opts.dismissKey   — localStorage key for permanent dismissal (optional)
       opts.insertBefore — selector of element to insert banner before (default: first child of body)
       opts.message      — initial message text (optional)

     showBanner(id, message)   — show banner with message
     hideBanner(id)            — hide banner (not dismissed permanently)
     isBannerDismissed(key)    — returns true if permanently dismissed
*/
'use strict';
(function () {
  // Self-load CSS
  const src = document.currentScript && document.currentScript.src;
  if (src) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = src.replace(/\.js$/, '.css');
    document.head.appendChild(link);
  }

  const registry = {};

  window.createBanner = function createBanner(id, opts) {
    opts = opts || {};

    // If permanently dismissed, don't create
    if (opts.dismissKey && localStorage.getItem(opts.dismissKey) === '1') {
      registry[id] = null;
      return null;
    }

    const el = document.createElement('div');
    el.id = id;
    el.className = 'util-banner';

    const msgEl = document.createElement('span');
    msgEl.className = 'util-banner-msg';
    if (opts.message) msgEl.textContent = opts.message;
    el.appendChild(msgEl);

    if (opts.dismissKey) {
      const btn = document.createElement('button');
      btn.className = 'util-banner-dismiss';
      btn.textContent = 'Dismiss';
      btn.addEventListener('click', () => {
        localStorage.setItem(opts.dismissKey, '1');
        el.classList.remove('visible');
      });
      el.appendChild(btn);
    }

    // Insert into DOM
    if (opts.insertBefore) {
      const ref = document.querySelector(opts.insertBefore);
      if (ref) ref.parentNode.insertBefore(el, ref);
      else document.body.prepend(el);
    } else {
      document.body.prepend(el);
    }

    registry[id] = { el, msgEl };
    return el;
  };

  window.showBanner = function showBanner(id, message) {
    const entry = registry[id];
    if (!entry) return;
    if (message !== undefined) entry.msgEl.textContent = message;
    entry.el.classList.add('visible');
  };

  window.hideBanner = function hideBanner(id) {
    const entry = registry[id];
    if (!entry) return;
    entry.el.classList.remove('visible');
  };

  window.isBannerDismissed = function isBannerDismissed(key) {
    return localStorage.getItem(key) === '1';
  };
})();
