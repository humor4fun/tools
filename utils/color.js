/* tools/utils/color.js
   window.wireColorPair(picker, hexInput, onChange)
   Keeps a color <input type="color"> and a hex text input in sync.
   onChange is called whenever either changes (optional).
*/
'use strict';
window.wireColorPair = function wireColorPair(picker, hexInput, onChange) {
  picker.addEventListener('input', () => {
    hexInput.value = picker.value;
    if (typeof onChange === 'function') onChange();
  });
  hexInput.addEventListener('input', () => {
    if (/^#[0-9a-fA-F]{6}$/.test(hexInput.value)) {
      picker.value = hexInput.value;
      if (typeof onChange === 'function') onChange();
    }
  });
};
