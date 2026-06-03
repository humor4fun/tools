/* tools/utils/toast.js
   window.toast(msg, type='', duration=2600)
   type: '' | 'ok' | 'err' | 'warn'
   Self-loads toast.css from the same directory.
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

  // Create element lazily
  function getEl() {
    let el = document.getElementById('toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'toast';
      document.body.appendChild(el);
    }
    return el;
  }

  let hideTimer;
  window.toast = function toast(msg, type, duration) {
    if (duration === undefined) duration = 2600;
    const el = getEl();
    el.textContent = msg;
    el.className = 'show' + (type ? ' ' + type : '');
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => { el.classList.remove('show'); }, duration);
  };
})();
