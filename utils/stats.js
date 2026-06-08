/* tools/utils/stats.js
   
   Real-time metrics display with flexible config.
   Automatically tracks custom metrics and updates on source element changes.
   
   Usage:
     const stats = new Stats(editor, {
       updateOnInput: true,
       debounceMs: 100,
       metrics: [
         { name: 'chars', label: 'chars', fn: (content) => content.length },
         { name: 'words', label: 'words', fn: (content) => content.split(/\s+/).filter(Boolean).length }
       ]
     });
     
     // Or add custom metrics later
     stats.addMetric('lines', 'lines', (content) => content.split('\n').length);
   
   Renders to #stats or provided elementId in target container.
*/
'use strict';
(function () {
  const DEFAULT_CONFIG = {
    elementId: 'stats',          // where to render stats
    updateOnInput: true,         // auto-update on source element change
    debounceMs: 100,
    separator: ' · ',            // between metrics
    metrics: [                   // default metrics
      {
        name: 'chars',
        label: 'chars',
        fn: (content) => content.length
      },
      {
        name: 'words',
        label: 'words',
        fn: (content) => content.split(/\s+/).filter(Boolean).length
      },
      {
        name: 'lines',
        label: 'lines',
        fn: (content) => content.split('\n').length
      }
    ],
    format: null                 // custom formatter function (optional)
  };

  class Stats {
    constructor(sourceElement, userConfig = {}) {
      const config = { ...DEFAULT_CONFIG, ...userConfig };
      this.config = config;
      this.sourceElement = sourceElement;
      this.metrics = [...config.metrics];  // Copy default metrics
      this.currentValues = {};
      this.debounceTimer = null;
      this.isAttached = false;

      this.init();
      this.update();

      if (config.updateOnInput) {
        this.attach();
      }
    }

    init() {
      // Create or find target element
      let target = document.getElementById(this.config.elementId);
      if (!target) {
        target = document.createElement('span');
        target.id = this.config.elementId;
        // Try to insert after a logical parent (e.g., status bar)
        const statusBar = document.getElementById('stbar');
        if (statusBar) {
          statusBar.appendChild(target);
        } else {
          document.body.appendChild(target);
        }
      }
      this.targetElement = target;
    }

    addMetric(name, label, fn) {
      if (typeof fn !== 'function') {
        this.reportError(`Stats: metric function for "${name}" must be a function`);
        return;
      }
      // Remove existing metric with same name
      this.metrics = this.metrics.filter(m => m.name !== name);
      // Add new metric
      this.metrics.push({ name, label, fn });
    }

    removeMetric(name) {
      this.metrics = this.metrics.filter(m => m.name !== name);
    }

    getMetrics() {
      return { ...this.currentValues };
    }

    update(content = null) {
      clearTimeout(this.debounceTimer);
      
      const doUpdate = () => {
        const text = content !== null ? content : this.getSourceContent();
        
        try {
          this.currentValues = {};
          this.metrics.forEach(metric => {
            try {
              this.currentValues[metric.name] = metric.fn(text);
            } catch (e) {
              console.error(`Stats: metric "${metric.name}" threw:`, e);
              this.currentValues[metric.name] = '?';
            }
          });
          
          this.render();
        } catch (e) {
          this.reportError(`Stats: update failed: ${e.message}`);
        }
      };

      // Debounce if configured
      if (this.config.debounceMs > 0) {
        this.debounceTimer = setTimeout(doUpdate, this.config.debounceMs);
      } else {
        doUpdate();
      }
    }

    render() {
      if (!this.targetElement) return;

      let html;
      
      if (this.config.format && typeof this.config.format === 'function') {
        // Custom formatter
        try {
          html = this.config.format(this.currentValues);
        } catch (e) {
          this.reportError(`Stats: custom format function threw: ${e.message}`);
          html = this.renderDefault();
        }
      } else {
        html = this.renderDefault();
      }

      this.targetElement.innerHTML = html;
    }

    renderDefault() {
      const parts = this.metrics.map(metric => {
        const value = this.currentValues[metric.name];
        return `<span class="stat" data-metric="${metric.name}"><span class="stat-value">${value}</span> <span class="stat-label">${metric.label}</span></span>`;
      });
      return parts.join(`<span class="stat-sep">${this.config.separator}</span>`);
    }

    setFormat(formatFn) {
      this.config.format = formatFn;
      this.render();
    }

    attach() {
      if (this.isAttached) return;
      
      const handler = () => this.update();
      
      // Support textarea, input, contenteditable, or custom property
      if (this.sourceElement instanceof HTMLTextAreaElement || 
          this.sourceElement instanceof HTMLInputElement) {
        this.sourceElement.addEventListener('input', handler);
      } else if (this.sourceElement.contentEditable) {
        this.sourceElement.addEventListener('input', handler);
        this.sourceElement.addEventListener('keyup', handler);
      } else {
        // For custom elements, try both input and change
        this.sourceElement.addEventListener('input', handler);
        this.sourceElement.addEventListener('change', handler);
      }
      
      this.isAttached = true;
      this._handler = handler;
    }

    detach() {
      if (!this.isAttached || !this._handler) return;
      
      this.sourceElement.removeEventListener('input', this._handler);
      this.sourceElement.removeEventListener('change', this._handler);
      this.sourceElement.removeEventListener('keyup', this._handler);
      this.isAttached = false;
      this._handler = null;
    }

    getSourceContent() {
      if (this.sourceElement instanceof HTMLTextAreaElement || 
          this.sourceElement instanceof HTMLInputElement) {
        return this.sourceElement.value;
      } else if (this.sourceElement.textContent !== undefined) {
        return this.sourceElement.textContent;
      }
      return '';
    }

    reportError(msg) {
      console.error(msg);
      
      if (typeof window.toast === 'function') {
        window.toast(msg, 'warn', 3000);
      }
      
      if (window._activityLog && typeof window._activityLog.error === 'function') {
        window._activityLog.error(msg);
      }
    }
  }

  window.Stats = Stats;
})();
