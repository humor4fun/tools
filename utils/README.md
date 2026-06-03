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
<script src="../utils/tabs.js"></script>      <!-- list / transcode / barcode / qr -->
<script src="../utils/header.js"></script>
<script> /* tool code; call renderHeader() + initTabs().init() at DOMContentLoaded */ </script>
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

## Non-abstracted features (tool-specific, not extracted)

| Feature | Tool(s) | Key identifiers |
|---|---|---|
| Save/load file | list (download), text (File System Access API) | `btn-save-file`, `showSaveFilePicker` |
| Drag & drop (folder/tree) | text | `dataTransfer.setData('text/x-text-src', ...)` |
| Drag & drop (chain slots) | transcode | `.chain-slot` dragover/drop events |
| Workspace tabs (own impl) | text | `state.workspaces[]`, `renderWorkspaceTabs()` |
| Activity log | text | `#activity-log`, timestamped, save as .txt |
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

---

## Adding a new utility

1. Create `utils/newutil.js` (and `utils/newutil.css` if needed).
2. Self-load the CSS at the top of the JS (see pattern in `toast.js`).
3. Expose a single `window.newutil` function or class.
4. Document it in this README.
5. Add `"utils/README.md"` to `wrangler.jsonc` `assets.exclude` if not already there.
