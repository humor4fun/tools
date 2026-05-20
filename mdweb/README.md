# mdweb — Local File Browser & Editor

A single HTML file that turns any local folder of text files into a browsable, readable, and editable workspace — directly in the browser, with no server, no install, and no build step.

Open `index.html`, pick one or more folders, and read, navigate, and edit files across a wide range of text formats.

---

## Requirements

- **Chrome or Edge (desktop)** — uses the browser's [File System Access API](https://developer.mozilla.org/en-US/docs/Web/API/File_System_API) (`showDirectoryPicker`), not supported in Firefox or Safari.
- **Internet connection on first load** — Markdown is rendered by [marked.js](https://cdn.jsdelivr.net/npm/marked@12/marked.min.js) and code is highlighted by [Prism.js](https://cdn.jsdelivr.net/npm/prismjs@1/), both loaded from the jsDelivr CDN. After the page loads, no further network access is needed.
- No installation. No build step. No server. No package manager.

---

## Getting started

1. Open `index.html` in Chrome or Edge
2. Click **Open Folder** in the sidebar (or the **+** button in the header)
3. Select any local folder containing text files

The tool scans the folder, builds a file tree in the sidebar, and opens `README.md` automatically if one is present. Otherwise it opens the first readable file found.

---

## Terminal shortcut (`mdweb` command)

You can open mdweb directly from your terminal using a shell function. Add the following to your `~/.zshrc` (or `~/.bashrc`):

```zsh
mdweb() {
  open -a "Google Chrome" "file:///path/to/mdweb/index.html?autoopen"
}
```

Replace `/path/to/mdweb/index.html` with the actual path to `index.html` on your machine.

After reloading your shell (`source ~/.zshrc`), typing `mdweb` in any directory will open the tool in Chrome with the folder picker dialog already open — no button click needed.

**Note:** Due to browser security restrictions, the picker dialog cannot pre-navigate to the directory you ran `mdweb` from. You will still need to navigate to the desired folder in the OS dialog. The dialog typically remembers the last folder you selected.

**How it works:** When `index.html` is opened with the `?autoopen` query parameter, the app automatically calls `showDirectoryPicker()` on load instead of waiting for a button click.

---

## Supported file types

Files are grouped into categories. Each category has a distinct display mode and coloured label.

### Markdown — rendered

Rendered as formatted HTML using GitHub-Flavored Markdown.

`md` `mdx` `markdown`

### Web — HTML / XML / CSS

| Type | Extensions | Display |
|------|-----------|---------|
| HTML | `html` `htm` | Sandboxed live iframe |
| XML | `xml` | Syntax highlighted code |
| CSS / Styles | `css` `scss` `less` | Syntax highlighted code |

### Images — viewer

Displayed in a centred viewer panel. SVG files can also be edited in the textarea with live preview.

`png` `jpg` `jpeg` `gif` `webp` `avif` `ico` `bmp` `svg` `pdf`

### Video / Audio — native player

`mp4` `webm` `ogv` `mov` `mp3` `ogg` `wav` `flac` `m4a`

### Code — syntax highlighted

Displayed with full syntax highlighting via Prism.js. Language grammars are loaded on demand.

| Category | Extensions |
|----------|-----------|
| JavaScript | `js` `mjs` `cjs` `jsx` |
| TypeScript | `ts` `tsx` |
| Python | `py` |
| Shell | `sh` `bash` `zsh` `fish` |
| C / C++ | `c` `h` `cpp` `hpp` |
| C# | `cs` |
| Java / Kotlin | `java` `kt` |
| Swift | `swift` |
| Ruby | `rb` |
| Go | `go` |
| Rust | `rs` |
| PHP | `php` |
| SQL / GraphQL | `sql` `graphql` |
| Data & config | `json` `jsonc` `yaml` `yml` `toml` |
| Build files | `Dockerfile` `Makefile` |

### Text — plain

Displayed as plain monospace text, no highlighting.

`txt` `log` `csv` `tsv` `ini` `cfg` `conf` `env` `gitignore` `gitattributes` `editorconfig`

Also: `LICENSE` `LICENCE` `NOTICE` `AUTHORS` `CONTRIBUTING` `CHANGELOG` `CHANGES` `README` `TODO` `FIXME` `INSTALL` `COPYING` (extensionless filenames).

### Unsupported — hex viewer

All other binary or unrecognised files are shown as a "Cannot display" notice by default. Enable **Show all files** in the sidebar to reveal them in the tree; selecting one opens a hex dump viewer.

---

## Feature reference

### Multiple workspaces

mdweb supports opening multiple folders simultaneously, each as its own independent workspace.

**Workspace tabs**
The header bar shows one chip per open folder. Click a chip to switch to that workspace; the sidebar tree and content pane update immediately. The last-open file or directory in each workspace is remembered and restored when you switch back.

**Adding a workspace**
Click the **+** button at the end of the header tab bar (or use **Open Folder** / **Change folder** in the sidebar) to open another folder. Both can be open at the same time.

**Closing a workspace**
Hover over a tab chip to reveal an **×** button. Click it to close that workspace. If it was the last open workspace, the app returns to the welcome state.

**Duplicate folder names**
If two open folders share the same name (e.g. two different `src` directories), tabs are labelled `src` and `src (2)` to distinguish them.

---

### Browsing and navigation

**Sidebar file tree**
The left sidebar shows the full directory tree of the active workspace. Directories expand and collapse; clicking them also opens the folder card view for that directory. Files show their filename with a small colour-coded dot indicating file type.

**File type filter**
A collapsible filter panel at the top of the sidebar lets you show or hide files by type group (Markdown, Web, Code, Text, Images, Video, Audio, Unsupported). The filter is hierarchical — click a group header to toggle the entire group, or expand it to toggle individual subtypes. A hidden-count badge appears next to the **Filter** label when any types are deselected.

**Show all files**
The **Show all files** button at the bottom of the sidebar reveals binary and unrecognised files in the tree (hidden by default). When active, selecting one of those files opens the hex viewer.

**Folder card view**
When a directory is selected the main panel shows a card grid of its contents. Subdirectories appear as folder cards with a file count. Files are grouped by category and shown as cards displaying the filename, a file type badge, and a content snippet. Clicking any card opens it.

**Clickable breadcrumb**
The breadcrumb bar below the header shows the full path of the current file or folder within the active workspace. Every ancestor segment is clickable and navigates to the card view for that directory. The root name opens the root card view.

**Find file**
A search bar sits above the file tree. Typing filters the tree to show only files whose full path contains the search term. Matching parent directories are auto-expanded; non-matching items are hidden. Clear the input to restore the full tree.

**Auto-open**
When a folder is loaded, `README.md` is opened automatically if found. Otherwise the first readable file found alphabetically is opened.

**Unsaved changes guard**
Navigating away from a file with unsaved edits shows a confirmation dialog before discarding.

---

### Tree controls (sidebar bottom bar)

| Button | Action |
|--------|--------|
| **Refresh tree** | Re-scans the folder from disk and repaints the sidebar |
| **Collapse all** / **Expand all** | Collapses or expands all directories in the tree; label toggles |
| **New file** | Prompts for a filename and creates a new empty file in the current directory |
| **Show all files** / **Show text files** | Toggles visibility of binary / unsupported files in the tree |
| **Change folder** | Opens another folder and adds it as a new workspace tab |

**Auto-refresh**
The tree is automatically re-scanned every 10 seconds. If any files or directories are added, removed, or renamed, the sidebar updates automatically. If the currently open file is deleted, a notice banner replaces the content pane.

---

### Reading

**Markdown rendering**
Markdown files are rendered using GitHub-Flavored Markdown (GFM) via marked.js. Supported elements include headings, paragraphs, bold, italic, ordered and unordered lists, task lists (non-interactive), tables, fenced code blocks, inline code, blockquotes, horizontal rules, and links.

**HTML preview**
HTML files are displayed in a sandboxed `<iframe>`. The iframe uses `sandbox="allow-same-origin"` which prevents JavaScript execution while still rendering the visual layout, styles, and images.

**SVG viewer + editor**
SVG files are shown as rendered images in the viewer panel. They can be opened in the editor to edit the raw XML, with a live SVG preview pane in split view.

**Syntax-highlighted code**
Code files are displayed in a styled block with Prism.js syntax highlighting. The language grammar is detected from the file extension and loaded on demand.

**Plain text**
Text files are displayed in a scrollable monospace block. No processing is applied.

**Images, video, audio, PDF**
Media files open in the viewer panel using native browser rendering (`<img>`, `<video>`, `<audio>`, `<iframe>`). Images are centred and scaled to fit.

**Hex viewer**
Binary files (when **Show all files** is enabled) are displayed as a paged hex dump. Each page shows 64 KB of data in three columns: byte offset, hex bytes, and ASCII representation. An index panel on the left lists all pages; click any page to jump to it. Files larger than 10 MB show a size warning before loading; click through to load anyway.

**File type badge**
The toolbar shows a coloured label indicating the detected file type.

**Markdown metadata strip**
Markdown files that begin with an HTML comment block containing structured metadata fields are parsed and displayed as a badge row above the rendered content.

| Field | Rendered as |
|-------|-------------|
| `ARTIFACT: A1 — Description` | Blue pill badge |
| Program type: `PSIRT`, `AppSec`, `CSIRT`, `OSS` | Colour-coded pill badge |
| Role text | Grey pill badge |
| `Last updated: YYYY-MM-DD` | Muted date text |
| `PRECEDENCE NOTE: ...` | Amber highlighted strip |

**Internal link navigation**
Relative links to other readable files in Markdown content are intercepted and navigate within the app. External links open in a new tab.

---

### Editing

**Entering edit mode**
Click **Edit** in the toolbar. The rendered view is replaced by a monospace textarea with line numbers. The toolbar switches to show **Save** and **Cancel**.

**Supported file types**
The editor is available for all text-based file types: Markdown, HTML, code files, plain text, and SVG. Image, video, audio, and PDF files cannot be edited in-app.

**Line numbers**
A gutter on the left side of the editor shows the line number for every row. Numbers scroll in sync with the editor.

**Write permission**
On the first **Edit** click in a session, the browser requests write permission for the folder. Granting it covers all files in that folder for the session. If denied, an amber message appears in the toolbar.

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
The **Save** button is active (blue, labelled `● Save`) when there are unsaved changes and dimmed when clean.

**Keyboard shortcut**
`Cmd+S` (macOS) or `Ctrl+S` (Windows/Linux) saves the current file while in edit mode.

**Save failure**
If the write fails, the button shows `⚠ Save failed` briefly. No edits are lost.

---

### Toolbar actions

| Button | Visible when | Action |
|--------|-------------|--------|
| **Wrap** | File open | Toggle line wrap for editor and code/text blocks |
| **Split** | File open, not HTML | Toggle split editor + preview view |
| **50/50** | Split view active | Reset split ratio to equal halves |
| **Hex** | File open, read mode | Toggle hex dump view for the current file |
| **Beautify** | File open, supported lang | Toggle a formatted view of the file (view only, file not changed) |
| **Reveal** | File open, read mode | Expand ancestors in the tree, scroll the file row into view, and flash it |
| **Reload** | File open, read mode | Re-read the file from disk and re-render |
| **Edit** | File open, editable type | Enter edit mode |
| **Cancel** | Edit mode | Exit edit mode (discard prompt if dirty) |
| **Save** | Edit mode | Write changes to disk |

---

### Split view

Split view shows the editor and a live preview side by side.

**Enabling**
Click **Split** in the toolbar. Split is not available for HTML files (the iframe preview is not synchronised).

**Resizing**
Drag the divider between panes. The editor can be sized between 20% and 80% of the total width.

**Resetting to 50/50**
Click the **50/50** button (dims when already centred) or double-click the divider.

**Live preview**
The preview re-renders 300ms after each keystroke. SVG files show the rendered SVG directly; Markdown shows rendered HTML; code shows syntax-highlighted text.

**Synchronized scrolling**
Scrolling either pane drives the other proportionally. Applies to Markdown, code, and text previews.

---

### Beautify (view-only format)

The **Beautify** button formats the current file's content in the reader without modifying the file on disk. Toggling it off restores the original display.

Supported languages: `json`, `xml`, `html`, `svg`, `javascript`, `jsx`, `typescript`, `tsx`, `css`, `scss`, `less`

Beautify is not available in edit mode. The **Edit** button is dimmed while Beautify is active.

---

### Hex viewer

Available for any file when **Show all files** is enabled in the sidebar.

- Click **Hex** in the toolbar to enter hex view for the current file, or select any binary file from the tree
- Files are shown in 64 KB pages with offset, hex byte, and ASCII columns
- The left panel lists all pages; click any to jump to it
- Files over 10 MB show a size warning; click through to proceed
- Click **Hex** again to return to the normal view

---

### Line wrap toggle

The **Wrap** button toggles line wrapping for the editor textarea and code/text blocks.

- **Wrap on (default):** long lines wrap within the pane
- **Wrap off:** long lines scroll horizontally

---

### Reveal in tree

The **Reveal** button in the toolbar scrolls the sidebar to the active file, expands all ancestor directories, and briefly flashes the file row to make it easy to locate.

---

### Activity log

The **Log** button in the header toggles a collapsible panel on the right edge of the screen. The panel records a timestamped history of actions including:

- Folders opened
- Files opened
- Files saved, created, and moved
- Tree changes detected by auto-refresh
- Files deleted or moved (detected by the watcher)
- Write permission denied
- Errors

Each entry shows the local time (`HH:MM:SS`) and a message. Entries are prepended (newest first). Clickable entries (file-related events) highlight and scroll the relevant file in the sidebar tree. Use **Clear** to empty the log or **Save** to download it as a `.txt` file.

---

### Drag and drop

**Open a folder from the OS**
Drag a folder from the Finder (macOS) or File Explorer (Windows) onto the browser window. A full-screen overlay confirms the drop target. The folder opens as a new workspace tab.

**Move files within the sidebar**
Drag any file or folder row in the sidebar tree onto another directory row. The dragged item is moved into the target directory on disk and the tree refreshes. Dropping a file onto another file moves it to that file's parent directory. A toast notification confirms the move.

---

### New file

Click **New file** at the bottom of the sidebar to create a new file in the current directory (the directory shown in the breadcrumb or last selected in the tree). A prompt asks for the filename. The file is created empty on disk, the tree refreshes, and the new file is opened automatically.

---

### Toast notifications

Brief notifications slide in from the top-right corner for operations such as move success, move errors, and permission issues. Notifications are colour-coded: green for success, amber for warnings, red for errors. They dismiss automatically after 5 seconds.

---

### Keyboard shortcuts

| Shortcut | Context | Action |
|----------|---------|--------|
| `Cmd+S` / `Ctrl+S` | Edit mode | Save current file |
| `Escape` | Edit mode | Exit edit mode (confirm if dirty) |
| `Tab` | Edit mode, cursor in textarea | Insert 2 spaces |

---

## Implementation notes

- **Single file.** All HTML, CSS, and JavaScript is contained in `index.html`. No companion files, no build step.
- **No framework.** Vanilla JS and CSS only.
- **Two external dependencies:**
  - [marked.js](https://github.com/markedjs/marked) — Markdown parsing, loaded from jsDelivr
  - [Prism.js](https://github.com/PrismJS/prism) — syntax highlighting with autoloader, loaded from jsDelivr
- **Fully offline after first load.** For permanent offline use, download both CDN scripts locally and update the `<script src>` tags to point to your local copies.
- **Multi-workspace architecture.** Each open folder is a self-contained workspace object with its own file map, directory map, tree, write permission, watch interval, and saved navigation state.
- **Auto-watch.** Each workspace runs an independent 10-second polling loop. Background workspaces silently re-scan; the sidebar only repaints when you switch to them.
- **HTML preview security.** HTML files are rendered in a sandboxed iframe (`sandbox="allow-same-origin"`). JavaScript in the rendered HTML does not execute.
- **Files read on demand.** The directory tree is walked at folder load time, but file contents are read only when a file is opened.
- **Prism language autoloader.** Language grammars are fetched from jsDelivr on first use per language and then cached by the browser.

---

## License

GNU Affero General Public License v3.0 (AGPL-3.0)

You are free to use, modify, and distribute this tool under the terms of the AGPL-3.0. If you modify the tool and offer it as a network service, you must make the modified source available under the same license.

Full license text: [LICENSE](../LICENSE) | https://www.gnu.org/licenses/agpl-3.0.html

---

## Author

Chris Holt
