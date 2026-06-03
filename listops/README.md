# listops — List Sort, Clean & Transform

A single HTML file for sorting, cleaning, deduplicating, labelling, and reformatting text lists. Paste in any list, pick an operation from the sidebar, and the result appears instantly in the same textarea.

No dependencies to install. No server. No build step. Open `index.html` in any modern browser.

---

## Getting started

1. Open `index.html` in a browser
2. Paste or type a list into the main textarea
3. Choose an **input separator** that matches how your items are delimited (default: newline)
4. Click any operation in the sidebar — the list is transformed immediately in place
5. Optionally choose a different **output separator** before copying or saving

---

## Separators

Both input and output separators are configured independently using the pill selector at the top of the sidebar.

| Option | Description |
|--------|-------------|
| Newline | One item per line (default) |
| Blank line | Items separated by a blank line (paragraphs) |
| Comma | `a, b, c` — split on commas |
| Space | Split on whitespace |
| Tab | Split on tab characters |
| Custom… | Enter any string as a separator |

Changing the input separator reformats the textarea immediately. Changing the output separator takes effect on the next copy, save, or transform.

---

## Operations

### Sort

| Operation | Description |
|-----------|-------------|
| A → Z | Alphabetical ascending, Unicode-aware locale sort |
| Z → A | Alphabetical descending |
| Names (by last name) | Sorts `First Last` items by the last space-delimited word |
| Titles (ignore articles) | Sorts by the first significant word, skipping *A*, *An*, *The* |
| Email (by domain) | Sorts email addresses alphabetically by domain |
| URLs (by href text) | Extracts link text from `<a href>` HTML and sorts by it |
| Ignore first word | Sorts by everything after the first word in each item |
| Addresses | Sorts postal addresses by street number (blank-line-separated blocks) |
| Numeric | Sorts items numerically, treating each item as a number |
| Day of week | Sun → Sat, recognises full and abbreviated day names |
| Month | Jan → Dec, recognises full and abbreviated month names |
| Length | Shortest to longest item |
| Random | Shuffles the list randomly |
| Reverse list | Reverses the order of items without resorting |

### Rearrange

| Operation | Description |
|-----------|-------------|
| Mirror items | Appends each item reversed to the list (e.g. `abc` → `abc`, `cba`) |
| Reverse words | Reverses the word order within each item |
| Transpose | Pivots a delimited table — rows become columns, columns become rows |

### Case

| Operation | Description |
|-----------|-------------|
| lowercase | Converts every character to lowercase |
| UPPERCASE | Converts every character to uppercase |
| Title Case | Capitalises the first letter of every word |
| rAnDoM cAsE | Randomises case character by character |
| Capitalize first letter | Capitalises only the first character of each item |

### Clean

| Operation | Description |
|-----------|-------------|
| Remove duplicates | Removes duplicate lines (case-sensitive, preserves order) |
| Trim spaces | Strips leading and trailing spaces from each item |
| Remove extra whitespace | Collapses runs of whitespace to a single space within each item |
| Remove all line breaks | Joins all items into a single block with no separators |
| Remove line breaks, keep paragraphs | Joins within paragraphs; blank-line paragraph boundaries are preserved |
| Remove non-alphanumeric | Strips all characters except letters, digits, and spaces |

### Label

Labels are applied to a selection of lines or to all lines if nothing is selected.

**Auto-label (changing)** — prepends a counter or lettering sequence to each item.

| Label type | Example |
|------------|---------|
| Numbers | 1. 2. 3. |
| Letters (lower) | a. b. c. |
| Letters (upper) | A. B. C. |
| Roman (lower) | i. ii. iii. |
| Roman (upper) | I. II. III. |

Configure the separator character (`.` ` ` `:` etc.) and starting value before applying.

**Static label** — prepends the same fixed string to every item. Configure the label text and separator.

### Prune

Removes a fixed number of characters from the start or end of every item.

- **Prune from start** — enter a character count; that many characters are removed from the left of each item
- **Prune from end** — removes from the right

### Find & Replace

Replaces all occurrences of a literal string with another string across the entire textarea content. Case-sensitive.

---

## Selection-aware transforms

Most operations work on the entire textarea. For Label and Prune operations, if you have text selected before clicking **Apply**, the transform is applied only to the selected lines. If there is no selection, the transform applies to all items.

---

## Undo / Redo

Every operation pushes a step onto an undo stack (up to 100 steps). Use the **Undo** and **Redo** buttons at the bottom of the sidebar. Each step records a label describing the operation performed, displayed in the history dropdown.

The undo stack is scoped to the current session and is not persisted across page reloads.

---

## Header actions

| Button | Description |
|--------|-------------|
| Copy | Copies the current textarea content to the clipboard using the active output separator |
| Save | Saves the current content as a `.txt` file download |

---

## File operations (sidebar)

| Operation | Description |
|-----------|-------------|
| Load from file | Opens a file picker and reads a local text file into the textarea |
| Save to file | Downloads the current textarea content as `listops-export.txt` |
| Print | Opens the browser print dialog with the textarea content |

---

## Status bar

The status bar at the bottom of the screen shows a live count of items and characters in the current content.

- **Items** — number of non-empty items after splitting by the input separator
- **Chars** — total character count of the textarea content

---

## Persistence

The following preferences are saved to `localStorage` and restored on next open:

- Input separator and custom separator string
- Output separator and custom separator string
- Sidebar section collapse state

The textarea content is **not** persisted between sessions.

---

## Implementation notes

- **Single file.** All HTML, CSS, and JavaScript is in `index.html`. No companion files.
- **No dependencies.** Vanilla JS and CSS only — no libraries, no CDN requests, fully offline.
- **Locale-aware sorting.** Alphabetical sorts use `Intl.Collator` for correct Unicode ordering.
- **Undo architecture.** Each transform snapshots the full textarea value before applying. History is stored in memory only.

---

## License

GNU Affero General Public License v3.0 (AGPL-3.0)

You are free to use, modify, and distribute this tool under the terms of the AGPL-3.0. If you modify the tool and offer it as a network service, you must make the modified source available under the same license.

Full license text: [LICENSE](../LICENSE) | https://www.gnu.org/licenses/agpl-3.0.html

---

## Author

Chris Holt
