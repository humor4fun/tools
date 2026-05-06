# mdweb — Local File Browser & Editor

A single HTML file that turns any local folder of text files into a browsable, readable, and editable workspace — directly in the browser, with no server, no install, and no build step.

Open `index.html`, pick a folder, and read, navigate, and edit files across a wide range of text formats.

---

## Requirements

- **Chrome or Edge (desktop)** — uses the browser's [File System Access API](https://developer.mozilla.org/en-US/docs/Web/API/File_System_API) (`showDirectoryPicker`), not supported in Firefox or Safari.
- **Internet connection on first load** — Markdown is rendered by [marked.js](https://cdn.jsdelivr.net/npm/marked@12/marked.min.js) and code is highlighted by [Prism.js](https://cdn.jsdelivr.net/npm/prismjs@1/), both loaded from the jsDelivr CDN. After the page loads, no further network access is needed.
- No installation. No build step. No server. No package manager.

---

## Getting started

1. Open `index.html` in Chrome or Edge
2. Click **Open Folder** in the sidebar
3. Select any local folder containing text files

The tool scans the folder, builds a file tree in the sidebar, and opens `README.md` automatically if one is present. If not, it opens the first readable file found.

---

## Supported file types

Files are grouped into four categories. Each category has a distinct display mode and coloured label.

### Markdown — rendered

Rendered as formatted HTML using GitHub-Flavored Markdown.

`md` `mdx` `markdown`

### HTML — live preview

Rendered in a sandboxed iframe. JavaScript execution is disabled; only the visual layout is shown.

`html` `htm` `svg`

### Code — syntax highlighted

Displayed with full syntax highlighting via Prism.js with language autodetection. Prism loads language grammars on demand, so nearly any language is supported.

| Category | Extensions |
|----------|-----------|
| JavaScript / TypeScript | `js` `mjs` `cjs` `jsx` `ts` `tsx` |
| Web styles | `css` `scss` `less` |
| Data & config | `json` `jsonc` `yaml` `yml` `toml` `xml` |
| Shell | `sh` `bash` `zsh` `fish` |
| Python | `py` |
| Ruby | `rb` |
| Go | `go` |
| Rust | `rs` |
| Java / JVM | `java` `kt` |
| Swift | `swift` |
| C family | `c` `cpp` `h` `hpp` `cs` |
| PHP | `php` |
| Query languages | `sql` `graphql` |
| Build files | `Dockerfile` `Makefile` `makefile` |

### Text — plain

Displayed as plain monospace text, no highlighting.

`txt` `log` `csv` `tsv` `ini` `cfg` `conf` `env` `gitignore` `gitattributes` `editorconfig`

Also: `LICENSE` `LICENCE` `NOTICE` `AUTHORS` `CONTRIBUTING` `CHANGELOG` `CHANGES` `README` `TODO` `FIXME` `INSTALL` `COPYING` (extensionless).

---

## Feature reference

### Browsing and navigation

**Folder picker**
Click **Open Folder** in the sidebar to select a local directory. Before a folder is loaded the button is large and prominent. After loading it collapses to a small **Change folder** link at the bottom of the sidebar.

**Sidebar file tree**
The left sidebar shows the full directory tree of the selected folder. Directories expand and collapse; clicking them also opens the folder card view for that directory. Files show their full filename (including extension) with a small colour-coded dot indicating file type: blue for Markdown, green for HTML, purple for code, grey for text.

**Folder card view**
When a directory is selected the main panel shows a card grid of its contents. Subdirectories appear as folder cards with a file count. Files are grouped by category (Markdown, HTML, Code, Text) and shown as cards displaying the filename, a file type label badge, and a content snippet from the first lines of the file. Clicking any card opens it.

**Clickable breadcrumb**
The breadcrumb bar shows the full path of the current file or folder. Every segment except the current one is clickable. Clicking a directory segment opens the card view for that directory. Clicking the root name opens the root card view.

**Auto-open**
When a folder is loaded, `README.md` is opened automatically if found. Otherwise the first readable file found alphabetically is opened.

**Unsaved changes guard**
Navigating away from a file with unsaved edits shows a confirmation dialog before discarding.

---

### Reading

**Markdown rendering**
Markdown files are rendered using GitHub-Flavored Markdown (GFM) via marked.js. Supported elements include headings, paragraphs, bold, italic, ordered and unordered lists, task lists, tables, fenced code blocks, inline code, blockquotes, horizontal rules, and links.

**HTML preview**
HTML files are displayed in a sandboxed `<iframe>`. The iframe uses `sandbox="allow-same-origin"` which prevents JavaScript execution, form submission, and navigation while still rendering the visual layout, styles, and images correctly.

**Syntax-highlighted code**
Code files are displayed in a styled block with Prism.js syntax highlighting. The language grammar is detected from the file extension and loaded on demand by the Prism autoloader. The colour theme is tuned to the dark UI.

**Plain text**
Text files are displayed in a scrollable monospace block. No processing is applied.

**File type badge**
The toolbar shows a coloured label indicating the current file's type (e.g. `JavaScript`, `YAML`, `Markdown`, `HTML`).

**Markdown metadata strip**
Markdown files that begin with an HTML comment block containing structured metadata fields are parsed and displayed as a badge row above the rendered content. The comment block is stripped from the rendered body.

Recognised fields:

| Field | Rendered as |
|-------|-------------|
| `ARTIFACT: A1` through `B2` | Blue pill badge |
| Program type: `PSIRT`, `AppSec`, `CSIRT`, `OSS` | Colour-coded pill badge |
| Role text (rest of artifact description) | Grey pill badge |
| `Last updated: YYYY-MM-DD` | Muted date text |
| `PRECEDENCE NOTE: ...` | Amber highlighted note |

**Internal link navigation**
Relative links to other readable files in Markdown content are intercepted and navigate within the app. External links open in a new tab.

---

### Editing

**Entering edit mode**
Click **Edit** in the toolbar. The rendered view is replaced by a monospace textarea containing the raw file content. The toolbar switches to show **Save** and **Cancel**.

**Edit works for all file types**
The textarea editor is available for every supported file type — Markdown, HTML, JavaScript, CSS, JSON, plain text, and all others. There is no file type that is read-only.

**Write permission**
On the first **Edit** click in a session, the browser requests write permission for the selected folder. Granting it covers all files in that folder for the session. If denied, an amber message appears in the toolbar.

**Tab key**
Inserts 2 spaces at the cursor position without losing focus.

**Unsaved indicator**
A `●` dot appears before the filename in the breadcrumb and a blue dot appears on the file in the sidebar tree when there are unsaved changes.

**Exiting edit mode**
- Click **Cancel** — exits and discards unsaved changes (confirm dialog if dirty)
- Press `Escape` — same as Cancel
- Navigate to another file — triggers the unsaved changes guard

---

### Saving

**Save button**
The **Save** button is active (blue) when there are unsaved changes and dimmed when clean.

**Keyboard shortcut**
`Cmd+S` (macOS) or `Ctrl+S` (Windows/Linux) saves the current file while in edit mode.

**Save failure**
If the write fails, the button shows `⚠ Save failed` briefly. No edits are lost.

---

### Split view

Split view is available for all file types. The left pane is always the textarea editor. The right pane shows the live preview appropriate for the file type: rendered Markdown, a live HTML iframe, or syntax-highlighted code.

**Enabling split view**
Click **Split** in the toolbar while in edit mode.

**Resizing**
Drag the divider between panes. The editor can be sized between 20% and 80% of the total width.

**Resetting to 50/50**
Click the **50/50** button (dims when already centred) or double-click the divider.

**Live preview**
The preview re-renders 300ms after each keystroke.

**Synchronized scrolling**
Scrolling either pane drives the other proportionally. Applies to Markdown and code/text previews. Not applied to HTML iframes (iframes manage their own scroll independently).

---

### Line wrap toggle

The **Wrap** button (visible in read and edit mode) toggles line wrapping. Applies to the textarea editor, code/text previews, and rendered code blocks in read mode. Does not affect Markdown rendered prose.

- **Wrap on (default):** long lines wrap within the pane
- **Wrap off:** long lines scroll horizontally

---

### Keyboard shortcuts

| Shortcut | Context | Action |
|----------|---------|--------|
| `Cmd+S` / `Ctrl+S` | Edit mode | Save current file |
| `Escape` | Edit mode | Exit edit mode (confirms if unsaved) |
| `Tab` | Edit mode, cursor in textarea | Insert 2 spaces |

---

## Implementation notes

- **Single file.** All HTML, CSS, and JavaScript is contained in `index.html`. No companion files.
- **No framework.** Vanilla JS and CSS only.
- **Two external dependencies:**
  - [marked.js](https://github.com/markedjs/marked) — Markdown parsing, loaded from jsDelivr
  - [Prism.js](https://github.com/PrismJS/prism) — syntax highlighting with autoloader, loaded from jsDelivr
- **Fully offline after first load.** For permanent offline use, download both CDN scripts locally and update the `<script src>` tags to point to your local copies.
- **HTML preview security.** HTML files are rendered in a sandboxed iframe (`sandbox="allow-same-origin"`). JavaScript in the rendered HTML does not execute.
- **File tree built once.** The directory tree is walked recursively at folder load time. Individual files are read on demand.
- **Prism language autoloader.** Language grammars are fetched from jsDelivr on first use per language. After the first load of a language, it is cached by the browser.

---

## License

GNU Affero General Public License v3.0 (AGPL-3.0)

You are free to use, modify, and distribute this tool under the terms of the AGPL-3.0. If you modify the tool and offer it as a network service, you must make the modified source available under the same license.

Full license text: [LICENSE](../LICENSE) | https://www.gnu.org/licenses/agpl-3.0.html

---

## Author

Chris Holt
