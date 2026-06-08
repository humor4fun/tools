/* tools/utils/activity-log.js
   
   Unified activity/event logging UI panel with flexible config.
   
   Usage:
     const log = new ActivityLog('activity-log');
     log.log('Hello');
     log.ok('Success!');
     log.warn('Warning');
     log.error('Error occurred');
   
   Or with config:
     const log = new ActivityLog('activity-log', {
       maxEntries: 1000,
       position: 'left',
       timestamps: true,
       storageKey: 'my-log'
     });
   
   Self-loads activity-log.css from the same directory.
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
    elementId: 'activity-log',
    maxEntries: 500,
    position: 'right',           // 'left' or 'right'
    width: '280px',
    autoClose: false,            // auto-hide after inactivity
    autoCloseDelay: 5000,
    timestamps: true,
    allowSave: true,
    allowClear: true,
    storageKey: 'activity-log',
    persistToLocalStorage: true
  };

  class ActivityLog {
    constructor(elementId, userConfig = {}) {
      const config = { ...DEFAULT_CONFIG, ...userConfig };
      this.config = config;
      this.entries = [];
      this.closeTimer = null;

      // Use provided elementId if it's a string, else use config
      if (typeof elementId === 'string') {
        this.elementId = elementId;
      } else if (typeof elementId === 'object') {
        // Called with just config (backward compat)
        this.elementId = DEFAULT_CONFIG.elementId;
        this.config = { ...DEFAULT_CONFIG, ...elementId };
      } else {
        this.elementId = config.elementId;
      }

      this.init();
      this.restore();
      
      // Register globally for error reporting
      if (!window._activityLog) {
        window._activityLog = this;
      }
    }

    init() {
      let container = document.getElementById(this.elementId);
      
      if (!container) {
        // Auto-create container if it doesn't exist
        container = document.createElement('div');
        container.id = this.elementId;
        document.body.appendChild(container);
      }

      // Build HTML structure
      container.innerHTML = `
        <div class="activity-log-panel" data-position="${this.config.position}">
          <div class="activity-log-header">
            <span class="activity-log-title">Activity Log</span>
            <div class="activity-log-buttons">
              ${this.config.allowSave ? '<button class="activity-log-save" title="Save log to file">Save</button>' : ''}
              ${this.config.allowClear ? '<button class="activity-log-clear" title="Clear log">Clear</button>' : ''}
            </div>
          </div>
          <div class="activity-log-body">
            <div class="activity-log-empty">No activity yet.</div>
          </div>
        </div>
      `;

      this.panel = container.querySelector('.activity-log-panel');
      this.bodyEl = container.querySelector('.activity-log-body');
      this.emptyEl = container.querySelector('.activity-log-empty');

      // Wire button handlers
      const clearBtn = container.querySelector('.activity-log-clear');
      if (clearBtn) {
        clearBtn.addEventListener('click', () => this.clear());
      }

      const saveBtn = container.querySelector('.activity-log-save');
      if (saveBtn) {
        saveBtn.addEventListener('click', () => this.save());
      }

      // Apply position styling
      if (this.panel) {
        this.panel.style.width = this.config.width;
      }
    }

    log(message, level = 'log') {
      if (!message) return;
      
      const entry = this.createEntry(message, level);
      this.entries.unshift(entry);
      this.renderEntry(entry);

      // Enforce max entries
      if (this.entries.length > this.config.maxEntries) {
        this.entries = this.entries.slice(0, this.config.maxEntries);
        // Remove oldest DOM nodes
        const nodes = this.bodyEl.querySelectorAll('.activity-log-entry');
        for (let i = this.config.maxEntries; i < nodes.length; i++) {
          nodes[i].remove();
        }
      }

      // Hide "no activity" message
      if (this.emptyEl && this.entries.length > 0) {
        this.emptyEl.style.display = 'none';
      }

      if (this.config.persistToLocalStorage) {
        this.persist();
      }

      if (this.config.autoClose && level === 'log') {
        this.resetAutoClose();
      }
    }

    warn(message) {
      this.log(message, 'warn');
    }

    error(message) {
      this.log(message, 'error');
    }

    ok(message) {
      this.log(message, 'ok');
    }

    createEntry(message, level) {
      const now = new Date();
      const time = now.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      });

      return {
        timestamp: now,
        time: time,
        message: message,
        level: level
      };
    }

    renderEntry(entry) {
      const entryEl = document.createElement('div');
      entryEl.className = 'activity-log-entry' + (entry.level ? ` log-${entry.level}` : '');

      if (this.config.timestamps) {
        const timeEl = document.createElement('span');
        timeEl.className = 'activity-log-entry-time';
        timeEl.textContent = entry.time;
        entryEl.appendChild(timeEl);
      }

      const msgEl = document.createElement('span');
      msgEl.className = 'activity-log-entry-msg';
      msgEl.textContent = entry.message;
      entryEl.appendChild(msgEl);

      this.bodyEl.prepend(entryEl);
    }

    clear() {
      this.entries = [];
      this.bodyEl.innerHTML = '';
      if (this.emptyEl) {
        this.emptyEl.style.display = '';
        this.bodyEl.appendChild(this.emptyEl);
      }
      if (this.config.persistToLocalStorage) {
        this.persist();
      }
    }

    toggle() {
      if (this.panel) {
        this.panel.classList.toggle('visible');
      }
    }

    open() {
      if (this.panel) {
        this.panel.classList.add('visible');
      }
    }

    close() {
      if (this.panel) {
        this.panel.classList.remove('visible');
      }
    }

    resetAutoClose() {
      clearTimeout(this.closeTimer);
      if (this.config.autoClose) {
        this.closeTimer = setTimeout(() => this.close(), this.config.autoCloseDelay);
      }
    }

    save() {
      if (this.entries.length === 0) {
        if (typeof window.toast === 'function') {
          window.toast('Log is empty', 'warn', 2000);
        }
        return;
      }

      const lines = this.entries
        .slice()
        .reverse()
        .map(e => {
          const prefix = this.config.timestamps ? `[${e.time}] ` : '';
          return prefix + e.message;
        });

      const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `activity-log-${new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-')}.txt`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 5000);

      if (typeof window.toast === 'function') {
        window.toast('Log saved', 'ok', 2000);
      }
    }

    export() {
      return this.entries.map(e => ({
        timestamp: e.timestamp.toISOString(),
        time: e.time,
        message: e.message,
        level: e.level
      }));
    }

    getEntries() {
      return this.entries;
    }

    persist() {
      if (!this.config.persistToLocalStorage) return;
      try {
        const data = this.entries.map(e => ({
          time: e.time,
          message: e.message,
          level: e.level
        }));
        localStorage.setItem(this.config.storageKey, JSON.stringify(data));
      } catch (e) {
        console.warn('ActivityLog: Failed to persist to localStorage', e);
      }
    }

    restore() {
      if (!this.config.persistToLocalStorage) return;
      try {
        const data = localStorage.getItem(this.config.storageKey);
        if (!data) return;
        const entries = JSON.parse(data);
        if (!Array.isArray(entries)) return;

        this.entries = entries.map(e => ({
          timestamp: new Date(e.time),
          time: e.time,
          message: e.message,
          level: e.level
        }));

        // Render all entries
        if (this.entries.length > 0) {
          if (this.emptyEl) this.emptyEl.style.display = 'none';
          this.entries.forEach(entry => this.renderEntry(entry));
        }
      } catch (e) {
        console.warn('ActivityLog: Failed to restore from localStorage', e);
      }
    }
  }

  window.ActivityLog = ActivityLog;
})();
