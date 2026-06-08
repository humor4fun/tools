/* tools/utils/progress.js
   
   Flexible config progress bar with determinate/indeterminate modes.
   
   Usage (old API):
     const progress = window.initProgress({ containerId: 'progress-wrap', label: true })
   
   Usage (new API):
     const progress = new ProgressBar({
       containerId: 'progress-wrap',
       label: true,
       height: '4px'
     })
   
   controller methods:
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

  const DEFAULT_CONFIG = {
    containerId: 'progress-wrap',
    label: true,
    height: '4px',
    bgColor: 'var(--bg-hover)',
    showPercentage: false
  };

  class ProgressBar {
    constructor(userConfig = {}) {
      const config = { ...DEFAULT_CONFIG, ...userConfig };
      this.config = config;
      this.wrap = document.getElementById(config.containerId);

      if (!this.wrap) {
        console.warn('ProgressBar: container not found:', config.containerId);
        this.wrap = null;
        return;
      }

      this.init();
    }

    init() {
      this.wrap.innerHTML = `
        <div class="progress-bar">
          <div class="progress-fill"></div>
        </div>
        ${this.config.label ? '<div class="progress-label"></div>' : ''}
      `;

      this.fill = this.wrap.querySelector('.progress-fill');
      this.labelEl = this.wrap.querySelector('.progress-label');
      this.isIndeterminate = false;
      this.isError = false;
    }

    setValue(v) {
      if (!this.fill || this.isIndeterminate || this.isError) return;
      const pct = Math.max(0, Math.min(1, v));
      this.fill.style.width = (pct * 100) + '%';
    }

    setLabel(text) {
      if (this.labelEl) this.labelEl.textContent = text;
    }

    setIndeterminate(bool) {
      if (!this.fill) return;
      this.isIndeterminate = bool;
      this.fill.classList.toggle('indeterminate', bool);
      if (bool) {
        this.fill.style.width = '100%';
      }
    }

    setError(bool) {
      if (!this.fill) return;
      this.isError = bool;
      this.fill.classList.toggle('error', bool);
    }

    reset() {
      if (!this.fill) return;
      this.fill.style.width = '0%';
      this.fill.classList.remove('indeterminate', 'error');
      if (this.labelEl) this.labelEl.textContent = '';
      this.isIndeterminate = false;
      this.isError = false;
    }

    hide() {
      if (this.wrap) this.wrap.style.display = 'none';
    }

    show() {
      if (this.wrap) this.wrap.style.display = '';
    }
  }

  window.ProgressBar = ProgressBar;

  // Old function API — kept for backward compatibility
  window.initProgress = function initProgress(opts) {
    opts = opts || {};
    const config = { ...DEFAULT_CONFIG, ...opts };
    const containerId = config.containerId;
    const showLabel = config.label !== false;

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
