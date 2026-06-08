/* tools/utils/toast.js
   
   Flexible config toast notification system.
   
   Usage:
     window.toast(msg, type='', duration=2600)        // Simple API
     new Toast(msg, { type: 'ok', duration: 3000 })   // Class-based with config
   
   type: '' | 'ok' | 'err' | 'warn'
   duration: milliseconds (0 = persistent, no auto-dismiss)
   
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

  const DEFAULT_CONFIG = {
    defaultDuration: 2600,
    position: 'bottom-center',        // 'bottom-center', 'top-center', etc.
    typeMap: {                        // CSS class mapping
      '': 'info',
      'ok': 'ok',
      'err': 'error',
      'warn': 'warn'
    },
    maxVisible: 3                     // max toasts shown at once (not implemented)
  };

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
  
  // Old simple API — kept for backward compatibility
  window.toast = function toast(msg, type, duration) {
    if (duration === undefined) duration = DEFAULT_CONFIG.defaultDuration;
    const el = getEl();
    el.textContent = msg;
    el.className = 'show' + (type ? ' ' + type : '');
    clearTimeout(hideTimer);
    // duration=0 means persistent — no auto-dismiss
    if (duration > 0) {
      hideTimer = setTimeout(() => { el.classList.remove('show'); }, duration);
    }
  };

  // New class-based API with flexible config
  class Toast {
    constructor(msg, userConfig = {}) {
      const config = { ...DEFAULT_CONFIG, ...userConfig };
      this.config = config;
      this.msg = msg;
      this.type = userConfig.type || '';
      this.duration = userConfig.duration !== undefined ? userConfig.duration : config.defaultDuration;
      
      this.show();
    }

    show() {
      const el = getEl();
      el.textContent = this.msg;
      el.className = 'show' + (this.type ? ' ' + this.type : '');
      clearTimeout(hideTimer);
      
      if (this.duration > 0) {
        hideTimer = setTimeout(() => { el.classList.remove('show'); }, this.duration);
      }
    }

    hide() {
      clearTimeout(hideTimer);
      const el = getEl();
      el.classList.remove('show');
    }
  }

  window.Toast = Toast;
})();
