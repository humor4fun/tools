# join — PDF & File Joiner

A single HTML file for merging PDFs, images, and text files into a single PDF document. Drag and drop files to reorder them, configure delimiter options, and export the merged result — all in your browser.

No dependencies to install. No server. No build step. Open `index.html` in any modern browser.

---

## Getting started

1. Open `index.html` in a browser
2. Drag and drop files onto the drop zone, or click "Choose Files" in the sidebar
3. Drag file cards to reorder them as needed
4. Use checkboxes to include or exclude specific files from the merge
5. Click "Merge PDFs" to generate and download the combined document

---

## Supported file types

| Category | Extensions | Behavior |
|----------|------------|----------|
| PDF | `.pdf` | Merged directly, pages copied in order |
| Images | `.png`, `.jpg`, `.jpeg`, `.gif`, `.webp`, `.svg`, `.bmp`, `.ico` | Embedded as full-page images |
| Text | `.txt`, `.md`, `.json`, `.csv`, `.log`, `.xml`, `.yaml`, `.yml`, `.html`, `.css`, `.js`, `.ts`, `.py`, `.rb`, `.java`, `.c`, `.cpp`, `.h`, `.hpp`, `.sh`, `.bash`, `.zsh`, `.ps1`, `.bat`, `.sql`, `.ini`, `.conf`, `.cfg`, `.toml`, `.env`, `.gitignore`, `.dockerfile`, `.makefile`, `.r`, `.lua`, `.php`, `.go`, `.rs`, `.swift`, `.kt`, `.scala` | Embedded as text content with word-wrapping |
| Unknown | Any other extension | Shows warning badge; attempts to embed as UTF-8 text |

Unknown file types display a warning badge on the file card and are logged. If the file cannot be decoded as text (e.g., binary files), it is skipped during merge with an error logged.

---

## File organizer

The main content area displays all added files as draggable cards.

### Adding files

- **Drag and drop**: Drop files anywhere on the main area
- **Choose Files button**: Opens native file picker with multiple selection enabled
- New files are appended to the existing list (not replaced)

### Reordering files

- Drag any file card and drop it at the desired position
- A drop indicator line shows where the card will be placed
- Reorder events are logged to the activity log

### Including/excluding files

- Each file card has a checkbox in the top-left corner
- Checked files (default) are included in the merge
- Unchecked files are grayed out but remain visible
- Exclusion events are logged

### Removing files

- Click the × button on any card to remove it
- Removed files are deleted from the organizer only (not from disk)
- Removal events are logged

---

## File size warnings

| Size | Behavior |
|------|----------|
| > 25 MB | Warning logged to activity log |
| > 50 MB | Toast notification + log warning about slow processing |
| > 400 MB | File rejected entirely with error toast + log entry |

These limits protect against browser memory constraints during merge operations.

---

## Merge options

### Delimiter

Controls how content is separated in the output PDF:

| Option | Description |
|--------|-------------|
| New page (default) | Each file starts on a new page |
| New line | Text files are concatenated with newline separators; PDFs merge sequentially |
| Horizontal line | Draws a customizable line between each file's content |

### Horizontal line settings

When delimiter is set to "Horizontal line", additional configuration options appear:

| Setting | Default | Range | Description |
|---------|---------|-------|-------------|
| Height | 3 px | 1–10 px | Thickness of the line |
| Width | 80% | 10–100% | Width relative to page margins |
| Style | Solid | Solid / Dashed / Dotted | Line pattern |
| Color | #6e7a8a | Any hex color | Line color |
| Opacity | 85% | 10–100% | Line transparency |

### Output filename

- Text field to customize the downloaded filename
- Defaults to `joined.pdf`
- Must end in `.pdf` extension (auto-appended if missing)

---

## Tabs

The tool supports multiple workspaces via tabs in the header:

- Each tab maintains its own file list, settings, and log
- Click the **+** button to create a new tab
- Double-click a tab label to rename it
- Click the **×** on a tab to close it (minimum 1 tab)
- Tab state is persisted to localStorage

Tab labels display the output filename by default.

---

## Activity log

The activity log records all actions in the current tab:

- File additions, removals, include/exclude toggles
- Reorder operations
- Settings changes
- Merge progress and completion
- Warnings and errors

### Log panel

- Toggle visibility with the **Log** button in the header
- Log panel open/close state is global (persists across tabs)
- Each tab has its own log history

### Log persistence

- Logs are persisted to localStorage
- Maximum 50 entries per tab (older entries trimmed)
- Clear log: remove all entries for current tab
- Save log: download as timestamped `.txt` file

---

## Progress bar

During merge operations, a progress bar displays status:

### Progress phases

| Phase | Percentage | Description |
|-------|------------|-------------|
| Loading files | 0–80% | Files read and processed sequentially |
| Compressing | 80–100% | Final PDF assembly and compression |
| Complete | 100% | Download triggered automatically |

### Error handling

If merge fails:
- Progress bar turns red
- Error message displayed
- Retry button appears
- Error logged to activity log

Common errors: out of memory, corrupt PDF, binary decode failure

---

## Header actions

| Button | Description |
|--------|-------------|
| Log | Toggle activity log panel visibility |

---

## Sidebar sections

### Upload Files

- "Choose Files" button opens file picker
- Drop zone hint for drag-and-drop usage

### Files

- Displays count of added files
- Placeholder when empty

### Options

- Delimiter selection (radio buttons)
- Horizontal line settings (conditional visibility)
- Output filename field

### Actions

- **Merge PDFs**: Start merge operation (disabled if no files included)
- **Clear All**: Remove all files from the organizer

---

## Persistence

The following state is saved to localStorage and restored on next open:

| Key | Content |
|-----|---------|
| `join_tabs` | Tab state: files, delimiter, hrSettings, outputFilename, log |
| `join_sections_collapsed` | Sidebar section collapse state |
| `join_logOpen` | Activity log panel visibility (global) |

File Data objects are stored in memory only and cleared on page reload.

---

## Keyboard shortcuts

| Shortcut | Action |
|----------|--------|
| `Delete` / `Backspace` | Remove focused file card |
| `Space` | Toggle checkbox on focused card |
| `Cmd`+`Enter` / `Ctrl`+`Enter` | Trigger merge operation |

---

## Implementation notes

- **Single file.** All HTML, CSS, and JavaScript is in `index.html`. No companion files.
- **External dependency.** Loads [pdf-lib](https://pdf-lib.js.org/) (~250KB) from unpkg CDN. After initial load, all processing happens client-side with no server interaction.
- **Client-side processing.** All merge operations run in the browser. Files never leave your machine.
- **File type detection.** Extensions are matched against known lists; unknown types are treated as text with a warning.
- **Progress utility.** Uses shared `utils/progress.js` for determinate/indeterminate progress display with error states.
- **Per-tab logging.** Each tab has its own log array, persisted with a 50-entry limit to prevent localStorage bloat.

---

## License

GNU Affero General Public License v3.0 (AGPL-3.0)

You are free to use, modify, and distribute this tool under the terms of the AGPL-3.0. If you modify the tool and offer it as a network service, you must make the modified source available under the same license.

Full license text: [LICENSE](../LICENSE) | https://www.gnu.org/licenses/agpl-3.0.html

---

## Author

Chris Holt
