/* tools/utils/keyboard.js
   window.initKeyboardShortcuts(map)
   window.initTabIndent(el)
*/
'use strict';

/**
 * initKeyboardShortcuts(map)
 * map: array of { key, ctrl, meta, shift, alt, action }
 *   key: string (e.g. 's', 'Escape')
 *   ctrl/meta/shift/alt: boolean (default false; meta = Cmd on Mac)
 *   action: function(e) called when matched (e.preventDefault() is called)
 *
 * Example:
 *   initKeyboardShortcuts([
 *     { key: 's', meta: true, action: saveFile },
 *     { key: 'Escape', action: closePanel },
 *   ]);
 */
window.initKeyboardShortcuts = function initKeyboardShortcuts(map) {
  document.addEventListener('keydown', function(e) {
    for (const binding of map) {
      if (
        e.key === binding.key &&
        !!e.ctrlKey  === !!binding.ctrl &&
        !!e.metaKey  === !!binding.meta &&
        !!e.shiftKey === !!binding.shift &&
        !!e.altKey   === !!binding.alt
      ) {
        e.preventDefault();
        binding.action(e);
        return;
      }
    }
  });
};

/**
 * initTabIndent(el)
 * Makes Tab/Shift+Tab insert/remove 2-space indent in a textarea,
 * instead of moving focus.
 */
window.initTabIndent = function initTabIndent(el) {
  el.addEventListener('keydown', function(e) {
    if (e.key !== 'Tab') return;
    e.preventDefault();
    const start = el.selectionStart;
    const end   = el.selectionEnd;
    const val   = el.value;

    if (!e.shiftKey) {
      // Insert two spaces at cursor
      el.value = val.slice(0, start) + '  ' + val.slice(end);
      el.selectionStart = el.selectionEnd = start + 2;
    } else {
      // Remove up to two leading spaces from current line
      const lineStart = val.lastIndexOf('\n', start - 1) + 1;
      const lineText  = val.slice(lineStart);
      const spaces    = lineText.match(/^ {1,2}/);
      if (spaces) {
        const n = spaces[0].length;
        el.value = val.slice(0, lineStart) + val.slice(lineStart + n);
        el.selectionStart = el.selectionEnd = Math.max(lineStart, start - n);
      }
    }
    el.dispatchEvent(new Event('input'));
  });
};
