# tools/utils — Shared Utilities

Vanilla JS + CSS utilities shared across all tools. No build step — load via `<script src="../utils/x.js">`.

## Canonical load order

```html
<link rel="stylesheet" href="../utils/tokens.css">
<!-- tool's own <style> block (minus any extracted CSS) -->
<script src="../utils/debounce.js"></script>
<script src="../utils/toast.js"></script>
<script src="../utils/clipboard.js"></script>
<script src="../utils/sidebar.js"></script>
<script src="../utils/keyboard.js"></script>
<script src="../utils/color.js"></script>     <!-- barcode / qr only -->
<script src="../utils/slider.js"></script>    <!-- barcode / qr only -->
<script src="../utils/banner.js"></script>    <!-- list only -->
<script src="../utils/undo.js"></script>      <!-- list only -->
<script src="../utils/tabs.js"></script>      <!-- list / transcode / barcode / qr / join -->
<script src="../utils/progress.js"></script>   <!-- join only (so far) -->
<script src="../utils/header.js"></script>
<!-- New shared utilities -->
<script src="../utils/activity-log.js"></script>  <!-- text / list / transcode / join -->
<script src="../utils/stats.js"></script>         <!-- text / list / transcode / join -->
<script src="../utils/tab-state.js"></script>     <!-- list / transcode / join (optional) -->
<script> /* tool code; call renderHeader(), init utilities, at DOMContentLoaded */ </script>
```

---

## Utility reference

### `tokens.css`
Shared CSS custom properties (design tokens). All tools must include this.
Variables: `--bg`, `--bg-sidebar`, `--bg-content`, `--bg-input`, `--bg-hover`, `--bg-active`, `--border`, `--border-light`, `--text`, `--text-muted`, `--text-dim`, `--text-heading`, `--text-link`, `--accent-blue`, `--accent-blue-h`, `--accent-green`, `--radius`, `--r`, `--font-mono`, `--font-sans`, `--font-ui`, `--accent`, `--accent-h`.

---

### `debounce.js`
```js
window.debounce(fn, delay) → debouncedFn
```

---

### `toast.js` + `toast.css`
Auto-loads `toast.css`. Creates `#toast` element on first use.
```js
window.toast(msg, type='', duration=2600)
// type: '' | 'ok' | 'err' | 'warn'
```

---

### `clipboard.js`
Depends on `toast.js` for feedback (optional).
```js
window.copyText(text, opts)
// opts: { successMsg, errorMsg, duration }
```

---

### `sidebar.js` + `sidebar.css`
Auto-loads `sidebar.css`. Canonical sidebar classes: `.sb-sec` / `.sb-hdr` / `.sb-body`.
Stores collapse state in localStorage.
```js
window.initSidebarSections(storageKey, sectionIds[])
// sectionIds: array of element IDs, or [] to manage all .sb-sec elements
// Returns: { refresh, persist }
```

---

### `keyboard.js`
```js
window.initKeyboardShortcuts(map)
// map: [{ key, ctrl, meta, shift, alt, action }]

window.initTabIndent(el)
// Makes Tab/Shift+Tab insert/remove 2-space indent in a textarea
```

---

### `banner.js` + `banner.css`
Auto-loads `banner.css`. Inline dismissible warning banners.
```js
window.createBanner(id, opts)
// opts: { dismissKey, insertBefore, message }

window.showBanner(id, message)
window.hideBanner(id)
window.isBannerDismissed(key)
```

---

### `undo.js`
```js
const undo = new window.UndoStack(maxSize=200)
undo.push(snapshot)
undo.undo()          // → snapshot or null
undo.redo()          // → snapshot or null
undo.replaceCurrent(snapshot)
undo.canUndo         // boolean
undo.canRedo         // boolean
undo.history         // array copy
undo.cursor          // current index
undo.size            // total snapshots
undo.clear()
```
For tab-aware tools: each tab object holds its own `_undo` instance.
`_undo` is **not** serialised to localStorage.

---

### `tabs.js` + `tabs.css`
Auto-loads `tabs.css`. Renders a chip-style tab bar in `#tab-bar`.
Double-click a chip to rename it inline.
```js
const ctrl = window.initTabs({
  storageKey,          // localStorage key
  containerId,         // default: 'tab-bar'
  defaultTab: () => ({ /* new tab state */ }),
  tabLabel: (tab) => string,
  onSwitch: (tab) => void,   // apply tab state to UI
  onSave:   () => object,    // snapshot current UI state
})
ctrl.init()     // call once after DOM ready (loads from storage, renders, calls onSwitch)
ctrl.newTab()
ctrl.closeTab(i)
ctrl.switchTab(i)
ctrl.persist()
ctrl.renderBar()
ctrl.current()  // → active tab object
ctrl.tabs       // array
ctrl.activeIdx  // number
```

---

### `header.js` + `header.css`
Auto-loads `header.css`. Targets `document.querySelector('header')` automatically.
Renders: logo → `/` sep → tool icon + name → tab-bar → header-actions → GitHub link.
```js
window.renderHeader({
  title,        // e.g. 'transcode'
  toolIconSvg,  // raw SVG string (14×14 recommended)
  githubPath,   // e.g. 'transcode' → links to github.com/humor4fun/tools/tree/main/transcode
                // omit or null to hide GitHub link
})
```
`#header-actions` is rendered empty; append buttons to it after calling `renderHeader`.

---

### `color.js`
```js
window.wireColorPair(picker, hexInput, onChange)
// picker: <input type="color">, hexInput: <input type="text">, onChange: fn (optional)
```

---

### `slider.js`
```js
window.wireSlider(id, valId, fmt, onChange)
// id: range input ID, valId: display element ID
// fmt: (value) => string, e.g. v => `${v}px`
// onChange: fn (optional). Initialises display immediately.
```

---

### `progress.js` + `progress.css`
Auto-loads `progress.css`. Creates a progress bar container.
```js
const progress = window.initProgress({
  containerId: 'progress-wrap',  // default
  label: true                    // show text label (default: true)
})

// Determinate mode (known progress)
progress.setValue(0.65)           // 0-1 scale
progress.setLabel('Loading file 2/5...')

// Indeterminate mode (unknown duration)
progress.setIndeterminate(true)
progress.setLabel('Compressing...')

// Error state
progress.setError(true)
progress.setLabel('Error: out of memory')

// Reset and visibility
progress.reset()
progress.hide()
progress.show()
```
Returns `null` if container not found.

---

## New Shared Utilities

### `activity-log.js` + `activity-log.css`
Unified activity/event logging panel with configurable persistence and timestamps.
Auto-loads `activity-log.css`. Registers itself globally as `window._activityLog` for error reporting.

**Default Config:**
```js
{
  elementId: 'activity-log',
  maxEntries: 500,
  position: 'right',              // 'left' or 'right'
  width: '280px',
  autoClose: false,
  autoCloseDelay: 5000,
  timestamps: true,
  allowSave: true,
  allowClear: true,
  storageKey: 'activity-log',
  persistToLocalStorage: true
}
```

**Usage:**
```js
const log = new ActivityLog('activity-log');  // Uses defaults
const log = new ActivityLog('activity-log', {
  position: 'left',
  maxEntries: 1000
});

// Log entries (auto-removes "no activity" placeholder)
log.log('Hello');
log.ok('Success!');
log.warn('Warning message');
log.error('Error occurred');

// UI control
log.toggle();
log.open();
log.close();

// Data access
log.clear();
log.save();  // Download as .txt
log.export();  // Get array
log.getEntries();
```

---

### `stats.js`
Real-time metrics display for any source element (textarea, input, contenteditable, custom).
Automatically tracks and updates on input changes with configurable debounce.

**Default Config:**
```js
{
  elementId: 'stats',
  updateOnInput: true,
  debounceMs: 100,
  separator: ' · ',
  metrics: [
    { name: 'chars', label: 'chars', fn: (content) => content.length },
    { name: 'words', label: 'words', fn: (content) => content.split(/\s+/).filter(Boolean).length },
    { name: 'lines', label: 'lines', fn: (content) => content.split('\n').length }
  ],
  format: null  // custom formatter (optional)
}
```

**Usage:**
```js
const stats = new Stats(editor, {  // editor is textarea or input
  updateOnInput: true,
  debounceMs: 200
});

// Add custom metrics
stats.addMetric('paragraphs', 'paragraphs', 
  (content) => content.split(/\n\n+/).filter(Boolean).length
);

// Programmatic updates
stats.update(newContent);
stats.update();  // read from source

// Custom rendering
stats.setFormat((metrics) => {
  return `${metrics.words} words, ${metrics.chars} chars`;
});

// Data access
stats.getMetrics();  // { words: 150, chars: 850, lines: 20 }

// Lifecycle
stats.attach();   // Start listening
stats.detach();   // Stop listening
stats.render();   // Manual render
```

---

### `tab-state.js`
Unified tab lifecycle and state persistence. Manages creating, closing, renaming, and persisting tabs.
Each tool defines its own tab state structure; TabControl just manages the lifecycle.

**Default Config:**
```js
{
  storageKey: 'tool-tabs',
  maxTabs: 20,
  defaultTabLabel: 'New Tab',
  persistence: {
    enabled: true,
    auto: true,              // auto-persist on changes
    debounceMs: 500
  },
  generateLabelFromContent: true,  // For auto-generated labels
  tabTemplate: {}            // Merged into each new tab (tool-specific)
}
```

**Usage:**
```js
const tabs = new TabControl({
  storageKey: 'list-tabs',
  tabTemplate: {             // Tool-specific fields
    content: '',
    selections: []
  }
});

// Tab lifecycle
const tab = tabs.newTab('My Tab');
tabs.selectTab(tab.id);
tabs.renameTab(tab.id, 'Renamed');
tabs.closeTab(tab.id);

// Current state
const active = tabs.current();  // { id, label, content, selections, ... }

// State management
tabs.setTabState(tabId, { content: '...', selections: [...] });
tabs.getCurrentState();  // Get active tab state (minus id/label)

// Events
tabs.on('new', (tab) => console.log('Tab created', tab));
tabs.on('change', (tab) => console.log('Tab switched', tab));
tabs.on('close', (tab) => console.log('Tab closed', tab));
tabs.on('rename', (tab) => console.log('Tab renamed', tab));

// Persistence
tabs.persist();   // Save to localStorage
tabs.restore();   // Load from localStorage
tabs.export();    // Get all tabs as JSON
```

---

## Non-abstracted features (tool-specific, not extracted)

| Feature | Tool(s) | Key identifiers |
|---|---|---|
| Save/load file | list (download), text (File System Access API) | `btn-save-file`, `showSaveFilePicker` |
| Drag & drop (folder/tree) | text | `dataTransfer.setData('text/x-text-src', ...)` |
| Drag & drop (chain slots) | transcode | `.chain-slot` dragover/drop events |
| Workspace tabs (own impl) | text | `state.workspaces[]`, `renderWorkspaceTabs()` |
| Auto-refresh / polling | text | `setInterval` 10s per workspace |
| Split view | text | `#split-divider`, 20–80% drag, synced scroll |
| Breadcrumb navigation | text | `#breadcrumb`, clickable ancestors, dirty dot |
| Tree search/filter | text | `#tree-search-input`, `[data-search-hidden]` |
| Beautify / view-format | text | `toggleBeautify()` |
| Hex viewer | text | 64KB pages, offset/hex/ASCII columns |
| Print | list | `window.print()` |
| Chain execution | transcode | `.chain-slot`, `runChain()`, `focusedSlotIdx` |
| QR matrix generation | qr | `generateQRMatrix()`, WebCrypto-free |
| DataMatrix generation | qr | `generateDataMatrix()` |
| Barcode encoding | barcode | `encodeCode128()`, `encodeEAN13()`, etc. |
| Center image overlay | qr | `loadCenterImg()`, `centerImgDataUrl` |
| CIRCL hash lookup | transcode | `circlLookup()`, `hashlookup.circl.lu` |
| Pure-JS MD5 | transcode | `md5()` (50-line implementation) |
| File organizer drag-drop | join | `.file-card` drag events |
| PDF merge | join | `mergeFiles()`, pdf-lib CDN |

---

## Adding a new utility

1. Create `utils/newutil.js` (and `utils/newutil.css` if needed).
2. Self-load the CSS at the top of the JS (see pattern in `toast.js`).
3. Expose a single `window.newutil` function or class.
4. Document it in this README.
5. Add `"utils/README.md"` to `wrangler.jsonc` `assets.exclude` if not already there.
