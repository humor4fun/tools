/* tools/utils/progress.js
   window.initProgress(opts) → progress controller
   
   opts:
     containerId {string}  ID of element to inject into (default: 'progress-wrap')
     label       {boolean} Show text label (default: true)
   
   controller:
     .setValue(v)          Set progress 0-1 (determinate mode)
     .setLabel(text)       Update label text
     .setIndeterminate(b)  Toggle indeterminate animation
     .setError(b)          Toggle error state (red)
     .reset()              Clear to zero, remove all states
     .hide()               Hide progress container
     .show()               Show progress container
   
   Self-loads progress.css from same directory.
   
   Usage notes:
     - For known progress (e.g., file count), use setValue(0-1)
     - For unknown duration tasks (e.g., compression), use setIndeterminate(true)
     - On error, setError(true) turns the bar red
     - Always call reset() before starting a new operation
*/
'use strict';
(function () {
  const src = document.currentScript && document.currentScript.src;
  if (src) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = src.replace(/\.js$/, '.css');
    document.head.appendChild(link);
  }

  window.initProgress = function initProgress(opts) {
    opts = opts || {};
    const containerId = opts.containerId || 'progress-wrap';
    const showLabel = opts.label !== false;

    const wrap = document.getElementById(containerId);
    if (!wrap) {
      console.warn('initProgress: container not found:', containerId);
      return null;
    }

    wrap.innerHTML = `
      <div class="progress-bar">
        <div class="progress-fill"></div>
      </div>
      ${showLabel ? '<div class="progress-label"></div>' : ''}
    `;

    const fill = wrap.querySelector('.progress-fill');
    const labelEl = wrap.querySelector('.progress-label');
    let isIndeterminate = false;
    let isError = false;

    function setValue(v) {
      if (isIndeterminate || isError) return;
      const pct = Math.max(0, Math.min(1, v));
      fill.style.width = (pct * 100) + '%';
    }

    function setLabel(text) {
      if (labelEl) labelEl.textContent = text;
    }

    function setIndeterminate(bool) {
      isIndeterminate = bool;
      fill.classList.toggle('indeterminate', bool);
      if (bool) {
        fill.style.width = '100%';
      }
    }

    function setError(bool) {
      isError = bool;
      fill.classList.toggle('error', bool);
    }

    function reset() {
      fill.style.width = '0%';
      fill.classList.remove('indeterminate', 'error');
      if (labelEl) labelEl.textContent = '';
      isIndeterminate = false;
      isError = false;
    }

    function hide() {
      wrap.style.display = 'none';
    }

    function show() {
      wrap.style.display = '';
    }

    return {
      setValue,
      setLabel,
      setIndeterminate,
      setError,
      reset,
      hide,
      show
    };
  };
})();
