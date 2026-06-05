/* tools/utils/tabs.js
   window.initTabs(opts) → controller

   opts:
     storageKey  {string}    localStorage key for tab persistence
     containerId {string}    ID of the tab-bar container element (default: 'tab-bar')
     defaultTab  {function}  () => tabState object for a new tab
     tabLabel    {function}  (tab) => string display label
     onSwitch    {function}  (tab) => void  apply tab state to UI
     onSave      {function}  () => object   snapshot current UI state

   Each tab object may include a _undo property (UndoStack instance).
   _undo is NOT serialized to localStorage (it is re-created on restore).

   controller:
     .newTab()
     .closeTab(i)
     .switchTab(i)
     .persist()
     .current()      → active tab object
     .renderBar()
     .tabs           → tabs array (read)
     .activeIdx      → active index (read)

   Self-loads tabs.css from same directory.
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

  window.initTabs = function initTabs(opts) {
    opts = opts || {};
    const storageKey  = opts.storageKey  || 'tabs';
    const containerId = opts.containerId || 'tab-bar';
    const makeDefault = opts.defaultTab  || (() => ({ name: '' }));
    const getLabel    = opts.tabLabel    || (tab => tab.name || 'Untitled');
    const onSwitch    = opts.onSwitch    || (() => {});
    const onSave      = opts.onSave      || (() => ({}));

    let tabs       = [];
    let activeIdx  = 0;
    let nextId     = 1;

    // ── Persistence ────────────────────────────────────────────────────────
    function persist() {
      // Strip _undo (non-serialisable) before storing
      const serialisable = tabs.map(t => {
        const copy = Object.assign({}, t);
        delete copy._undo;
        return copy;
      });
      try {
        localStorage.setItem(storageKey, JSON.stringify({ tabs: serialisable, activeIdx, nextId }));
      } catch(e) { /* quota */ }
    }

    // Validate that a value from localStorage is a safe plain-object array.
    // Guards against prototype pollution from crafted __proto__ payloads.
    function isValidTabsArray(arr) {
      return Array.isArray(arr) &&
        arr.length > 0 &&
        arr.every(t =>
          t !== null &&
          typeof t === 'object' &&
          !Array.isArray(t) &&
          Object.getPrototypeOf(t) === Object.prototype
        );
    }

    function load() {
      try {
        const raw = localStorage.getItem(storageKey);
        if (!raw) throw new Error('empty');
        const data = JSON.parse(raw);
        if (!isValidTabsArray(data.tabs)) throw new Error('bad');
        tabs      = data.tabs;
        activeIdx = Math.min(Number(data.activeIdx) || 0, tabs.length - 1);
        nextId    = Number(data.nextId) || tabs.length + 1;
      } catch(e) {
        tabs      = [Object.assign({ id: nextId++, name: '' }, makeDefault())];
        activeIdx = 0;
      }
    }

    // ── Save current UI state into active tab ───────────────────────────────
    function saveActive() {
      if (!tabs.length) return;
      const state = onSave();
      Object.assign(tabs[activeIdx], state);
      tabs[activeIdx].id = tabs[activeIdx].id || nextId++;
    }

    // ── Render tab bar ──────────────────────────────────────────────────────
    function renderBar() {
      const bar = document.getElementById(containerId);
      if (!bar) return;
      bar.innerHTML = '';

      tabs.forEach((tab, i) => {
        const chip = document.createElement('span');
        chip.className = 'path-chip' + (i === activeIdx ? ' active' : '');

        const label = document.createElement('span');
        label.className = 'ws-chip-label';
        label.textContent = getLabel(tab);
        label.title = getLabel(tab);

        // Single click → switch
        label.addEventListener('click', () => {
          if (i !== activeIdx) ctrl.switchTab(i);
        });

        // Double-click → inline rename
        label.addEventListener('dblclick', (e) => {
          e.stopPropagation();
          startInlineRename(chip, label, tab, i);
        });

        chip.appendChild(label);

        // Close button (only when >1 tab)
        if (tabs.length > 1) {
          const closeBtn = document.createElement('button');
          closeBtn.className = 'ws-chip-close';
          closeBtn.textContent = '\u00d7';
          closeBtn.title = 'Close tab';
          closeBtn.addEventListener('click', e => {
            e.stopPropagation();
            ctrl.closeTab(i);
          });
          chip.appendChild(closeBtn);
        }

        bar.appendChild(chip);
      });

      // Add (+) button
      const addBtn = document.createElement('button');
      addBtn.className = 'ws-chip-add';
      addBtn.textContent = '+';
      addBtn.title = 'New tab';
      addBtn.addEventListener('click', () => ctrl.newTab());
      bar.appendChild(addBtn);
    }

    // ── Inline rename ───────────────────────────────────────────────────────
    function startInlineRename(chip, labelEl, tab, i) {
      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'ws-chip-input';
      input.value = tab.name || '';
      input.maxLength = 40;
      input.spellcheck = false;

      chip.replaceChild(input, labelEl);
      input.focus();
      input.select();

      let committed = false;
      function commit() {
        if (committed) return;
        committed = true;
        const val = input.value.trim();
        tabs[i].name = val;
        persist();
        renderBar();
      }
      function cancel() {
        if (committed) return;
        committed = true;
        renderBar();
      }

      input.addEventListener('blur', commit);
      input.addEventListener('keydown', e => {
        if (e.key === 'Enter') { e.preventDefault(); input.blur(); }
        if (e.key === 'Escape') { input.removeEventListener('blur', commit); cancel(); }
      });
    }

    // ── Controller ──────────────────────────────────────────────────────────
    const ctrl = {
      get tabs()      { return tabs; },
      get activeIdx() { return activeIdx; },

      current() {
        return tabs[activeIdx] || null;
      },

      persist,
      renderBar,

      switchTab(i) {
        if (i === activeIdx) return;
        saveActive();
        activeIdx = i;
        persist();
        onSwitch(tabs[activeIdx]);
        renderBar();
      },

      newTab() {
        saveActive();
        const tab = Object.assign({ id: nextId++, name: '' }, makeDefault());
        tabs.push(tab);
        activeIdx = tabs.length - 1;
        persist();
        onSwitch(tabs[activeIdx]);
        renderBar();
      },

      closeTab(i) {
        if (tabs.length <= 1) return;
        if (i === activeIdx) saveActive();
        tabs.splice(i, 1);
        if (activeIdx >= tabs.length) activeIdx = tabs.length - 1;
        else if (activeIdx > i) activeIdx--;
        persist();
        onSwitch(tabs[activeIdx]);
        renderBar();
      },

      // Call this after DOM is ready to bootstrap from storage
      init() {
        load();
        renderBar();
        onSwitch(tabs[activeIdx]);
        return ctrl;
      }
    };

    return ctrl;
  };
})();
