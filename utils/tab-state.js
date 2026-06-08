/* tools/utils/tab-state.js
   
   Unified tab state management with flexible config.
   Manages tab lifecycle, persistence, and state.
   
   Usage:
     const tabCtrl = new TabControl({
       storageKey: 'my-tabs',
       maxTabs: 20
     });
     
     tabCtrl.newTab('My Tab');
     tabCtrl.on('change', (tab) => {
       // Apply tab state to UI
     });
     
   Each tool defines how to create/serialize tab state via callbacks.
   TabControl just manages lifecycle and persistence.
*/
'use strict';
(function () {
  const DEFAULT_CONFIG = {
    storageKey: 'tool-tabs',
    maxTabs: 20,
    defaultTabLabel: 'New Tab',
    persistence: {
      enabled: true,
      auto: true,           // auto-persist on changes
      debounceMs: 500
    },
    generateLabelFromContent: true,
    tabTemplate: {}         // tool-specific; merged with new tabs
  };

  class TabControl {
    constructor(userConfig = {}) {
      const config = { ...DEFAULT_CONFIG, ...userConfig };
      this.config = config;
      this.tabs = [];
      this.activeIdx = 0;
      this.nextId = 1;
      this.persistTimer = null;
      this.listeners = {};

      this.restore();
      
      // Auto-persist on changes if enabled
      if (this.config.persistence.auto) {
        this.setupAutoPersist();
      }
    }

    setupAutoPersist() {
      // Will be called after mutations to trigger debounced persist
      this._triggerAutoPersist = () => {
        clearTimeout(this.persistTimer);
        this.persistTimer = setTimeout(
          () => this.persist(),
          this.config.persistence.debounceMs
        );
      };
    }

    newTab(label = '') {
      if (this.tabs.length >= this.config.maxTabs) {
        this.reportError(`TabControl: Maximum ${this.config.maxTabs} tabs reached`);
        return null;
      }

      const tab = {
        id: this.nextId++,
        label: label || this.config.defaultTabLabel,
        ...this.config.tabTemplate
      };

      this.tabs.push(tab);
      this.activeIdx = this.tabs.length - 1;
      
      this.emit('new', tab);
      this._triggerAutoPersist?.();
      
      return tab;
    }

    closeTab(tabId) {
      const idx = this.tabs.findIndex(t => t.id === tabId);
      if (idx === -1) return;

      const tab = this.tabs[idx];
      this.tabs.splice(idx, 1);

      // Adjust active index if needed
      if (this.tabs.length === 0) {
        this.activeIdx = 0;
        // Create a default tab
        this.newTab();
      } else if (idx <= this.activeIdx && this.activeIdx > 0) {
        this.activeIdx--;
      }

      this.emit('close', tab);
      this._triggerAutoPersist?.();
    }

    selectTab(tabId) {
      const idx = this.tabs.findIndex(t => t.id === tabId);
      if (idx === -1) return;

      this.activeIdx = idx;
      this.emit('change', this.tabs[idx]);
      this._triggerAutoPersist?.();
    }

    renameTab(tabId, newLabel) {
      const tab = this.tabs.find(t => t.id === tabId);
      if (!tab) return;

      tab.label = newLabel || this.config.defaultTabLabel;
      this.emit('rename', tab);
      this._triggerAutoPersist?.();
    }

    current() {
      return this.tabs[this.activeIdx] || null;
    }

    setTabState(tabId, state) {
      const tab = this.tabs.find(t => t.id === tabId);
      if (!tab) return;

      Object.assign(tab, state);
      this._triggerAutoPersist?.();
    }

    getCurrentState() {
      const tab = this.current();
      if (!tab) return {};

      const state = { ...tab };
      delete state.id;
      delete state.label;
      return state;
    }

    persist() {
      if (!this.config.persistence.enabled) return;

      try {
        const data = {
          tabs: this.tabs,
          activeIdx: this.activeIdx,
          nextId: this.nextId
        };
        localStorage.setItem(this.config.storageKey, JSON.stringify(data));
      } catch (e) {
        this.reportError(`TabControl: persist failed: ${e.message}`);
      }
    }

    restore() {
      if (!this.config.persistence.enabled) {
        // Start fresh with one default tab
        this.tabs = [{ id: this.nextId++, label: this.config.defaultTabLabel, ...this.config.tabTemplate }];
        this.activeIdx = 0;
        return;
      }

      try {
        const raw = localStorage.getItem(this.config.storageKey);
        if (!raw) throw new Error('No saved tabs');

        const data = JSON.parse(raw);
        
        // Validate
        if (!Array.isArray(data.tabs) || data.tabs.length === 0) {
          throw new Error('Invalid tabs array');
        }

        this.tabs = data.tabs;
        this.activeIdx = Math.min(Number(data.activeIdx) || 0, this.tabs.length - 1);
        this.nextId = Number(data.nextId) || (this.tabs.length + 1);
      } catch (e) {
        console.warn('TabControl: restore failed, starting fresh:', e);
        this.tabs = [{ id: this.nextId++, label: this.config.defaultTabLabel, ...this.config.tabTemplate }];
        this.activeIdx = 0;
      }
    }

    export() {
      return {
        tabs: this.tabs,
        activeIdx: this.activeIdx
      };
    }

    on(event, handler) {
      if (!this.listeners[event]) {
        this.listeners[event] = [];
      }
      this.listeners[event].push(handler);
    }

    off(event, handler) {
      if (!this.listeners[event]) return;
      this.listeners[event] = this.listeners[event].filter(h => h !== handler);
    }

    emit(event, data) {
      if (!this.listeners[event]) return;
      this.listeners[event].forEach(handler => {
        try {
          handler(data);
        } catch (e) {
          this.reportError(`TabControl: event handler for "${event}" threw: ${e.message}`);
        }
      });
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

  window.TabControl = TabControl;
})();
