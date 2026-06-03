# transcode — Text Encoding, Decoding & Hashing

A single HTML file for encoding, decoding, hashing, and transforming text. Operations are chained together — the output of one step feeds into the next — letting you compose multi-step transformations without leaving the page.

No dependencies to install. No server. No build step. Open `index.html` in any modern browser.

---

## Getting started

1. Open `index.html` in a browser
2. Paste or type text into the **Input** field
3. Drag or click an operation from the sidebar to assign it to the first slot
4. The result appears immediately in **Output #1**
5. Click **+ Add step** to chain additional operations

---

## Chain UI

transcode works as a chain of transformer steps rather than a single encode/decode toggle.

```
Input (editable)
    ↓
[ Slot 1: Base64 × ]       ← assign from sidebar
    ↓
Output #1 (readonly)
[ + Add step ]
    ↓
[ Slot 2: ROT13 × ]
    ↓
Output #2 (readonly)
[ + Add step ]
```

The **Chain summary bar** at the top of the chain area shows the current pipeline as pills:

```
Chain  Step 1  →  [Base64]  →  [ROT13]
```

### Assigning an operation

- **Click** an operation in the sidebar — it is assigned to the currently focused slot (highlighted with a blue border)
- **Drag** an operation from the sidebar and drop it onto any slot

The focused slot advances automatically to the next empty slot after each assignment.

### Clearing an operation

Click the **×** on the operation badge in the slot. The slot reverts to an empty drop zone and the output for that step and all downstream steps is cleared.

### Removing a step

Click the **trash icon** on the slot row to delete the entire step from the chain. The chain renumbers itself and re-runs. The minimum chain length is one step — the trash icon is disabled when only one step remains.

### Re-running

The chain re-runs automatically:

- 300 ms after you stop typing in the Input field
- Immediately when you assign or clear an operation

Async operations (SHA hashing) are awaited in sequence — each step waits for the previous result before running.

### Collapsing

When a new step is added, all previous output textareas shrink to 60 px to keep the chain readable as it grows. The most recently added output remains at full height. The entire chain area is scrollable.

### Maximum chain length

Up to 100 steps.

---

## Operations

All operations run in encode-only direction (input → output). The chain is designed for forward transformation pipelines.

### Encoding

| Operation | Description |
|-----------|-------------|
| Base64 | Encodes text to standard Base64 (`+` `/` `=` padding) |
| Base64 URL-safe | Encodes to Base64 with `-` `_` substitution and no padding |
| URL Percent-Encode | Encodes special characters using `%XX` percent-encoding (`encodeURIComponent`) |
| HTML Entities | Encodes `& < > " '` to their HTML entity equivalents |
| Unicode Escape (\u) | Encodes non-ASCII characters as `\uXXXX` or `\u{XXXXX}` escape sequences |

### Hashing

All hash operations are one-way and produce a hex digest. They cannot be reversed.

| Operation | Algorithm | Implementation |
|-----------|-----------|----------------|
| MD5 | MD5 | Pure JavaScript (no dependencies) |
| SHA-1 | SHA-1 | WebCrypto (`crypto.subtle`) |
| SHA-256 | SHA-256 | WebCrypto (`crypto.subtle`) |
| SHA-512 | SHA-512 | WebCrypto (`crypto.subtle`) |

### Number Bases

All base conversions operate on the UTF-8 byte representation of the input string.

| Operation | Description |
|-----------|-------------|
| Hex | Space-separated two-character hex bytes (`48 65 6c 6c 6f`) |
| Binary | Space-separated 8-bit binary groups (`01001000 01100101 …`) |
| Octal | Space-separated three-character octal bytes (`110 145 154 …`) |
| ASCII Ordinals | Space-separated decimal byte values (`72 101 108 …`) |

### Text Transforms

| Operation | Description |
|-----------|-------------|
| ROT13 | Rotates A–Z letters by 13 positions (symmetric) |
| ROT47 | Rotates printable ASCII characters by 47 positions (symmetric) |
| Reverse string | Reverses the character order of the entire input |
| Pretty JSON | Parses the input as JSON and re-formats it with 2-space indentation |
| Minify JSON | Parses the input as JSON and re-formats it with all whitespace removed |
| Morse Code | Converts text to International Morse Code (` / ` between words) |

---

## Header actions

| Button | Description |
|--------|-------------|
| Copy output | Copies the last non-empty output in the chain to the clipboard |
| Reset | Clears all steps and input, returning to a single empty slot |

Each individual output also has a small copy icon in its label bar.

---

## Sidebar

The sidebar lists all available operations in four collapsible sections. Each section header can be clicked to expand or collapse it. Section collapse state is saved to `localStorage`.

Operations are draggable — grab any operation row and drop it onto a chain slot.

---

## Persistence

The following state is saved to `localStorage` under the key `transcode_prefs` and restored on next open:

- Chain length and assigned operations
- Input textarea content
- Sidebar section collapse states

---

## Implementation notes

- **Single file.** All HTML, CSS, and JavaScript is in `index.html`. No companion files.
- **No external dependencies.** MD5 is implemented in pure JavaScript. SHA-1/256/512 use the browser's built-in WebCrypto API (`crypto.subtle`). Fully offline — no CDN requests.
- **Async chain.** The `runChain` function uses `async/await` to handle WebCrypto promises. Each step awaits the previous result before starting, so SHA operations in the middle of a chain work correctly.
- **Error isolation.** If a step throws (e.g. invalid JSON for Pretty JSON), the error is shown in that step's output and the chain stops at that step. Steps before the error are unaffected.

---

## License

GNU Affero General Public License v3.0 (AGPL-3.0)

You are free to use, modify, and distribute this tool under the terms of the AGPL-3.0. If you modify the tool and offer it as a network service, you must make the modified source available under the same license.

Full license text: [LICENSE](../LICENSE) | https://www.gnu.org/licenses/agpl-3.0.html

---

## Author

Chris Holt
