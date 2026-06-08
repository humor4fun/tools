/* tools/utils/clipboard.js
   
   Flexible config clipboard copy utility.
   
   Usage:
     window.copyText(text, { successMsg: 'Done!', duration: 2000 })
   
   Depends on: toast.js (optional — falls back to alert if not loaded)
*/
'use strict';
(function () {
  const DEFAULT_CONFIG = {
    successMsg: 'Copied!',
    errorMsg: 'Copy failed',
    duration: 2600
  };

  window.copyText = function copyText(text, userConfig = {}) {
    const opts = { ...DEFAULT_CONFIG, ...userConfig };
    const successMsg = opts.successMsg;
    const errorMsg = opts.errorMsg;
    const duration = opts.duration;

  const notify = (msg, type) => {
    if (typeof window.toast === 'function') window.toast(msg, type, duration);
  };

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(
      () => notify(successMsg, 'ok'),
      () => {
        fallback(text)
          ? notify(successMsg, 'ok')
          : notify(errorMsg, 'err');
      }
    );
  } else {
    fallback(text)
      ? notify(successMsg, 'ok')
      : notify(errorMsg, 'err');
  }
};

  function fallback(text) {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    } catch(e) {
      return false;
    }
  }
})();
