/* tools/utils/undo.js
   
   Flexible config undo/redo stack.
   
   Usage:
     const undo = new UndoStack(200)  // max 200 snapshots
     undo.push(snapshot)
     undo.undo() / redo()
*/
'use strict';
window.UndoStack = class UndoStack {
  /**
   * @param {number} maxSize  Maximum number of snapshots to retain (default 200)
   */
  constructor(maxSize = 200) {
    const DEFAULT_MAX_SIZE = 200;
    this._max  = maxSize || DEFAULT_MAX_SIZE;
    this._hist = [];   // snapshots (oldest → newest)
    this._cur  = -1;   // index of current snapshot
  }

  /** Push a snapshot. Discards any redo history above current position. */
  push(snapshot) {
    // Trim redo tail
    this._hist = this._hist.slice(0, this._cur + 1);
    this._hist.push(snapshot);
    // Enforce max size
    if (this._hist.length > this._max) {
      this._hist.shift();
    }
    this._cur = this._hist.length - 1;
  }

  /** Undo: returns the snapshot to restore, or null if nothing to undo. */
  undo() {
    if (this._cur <= 0) return null;
    this._cur--;
    return this._hist[this._cur];
  }

  /** Redo: returns the snapshot to restore, or null if nothing to redo. */
  redo() {
    if (this._cur >= this._hist.length - 1) return null;
    this._cur++;
    return this._hist[this._cur];
  }

  /** Replace the current snapshot without adding a new entry. */
  replaceCurrent(snapshot) {
    if (this._cur >= 0) this._hist[this._cur] = snapshot;
  }

  get canUndo() { return this._cur > 0; }
  get canRedo()  { return this._cur < this._hist.length - 1; }

  /** Full history array (read-only snapshot). */
  get history() { return this._hist.slice(); }

  /** Zero-based index of current position in history. */
  get cursor() { return this._cur; }

  /** Remove all history. */
  clear() { this._hist = []; this._cur = -1; }

  /** Number of snapshots stored. */
  get size() { return this._hist.length; }
};
