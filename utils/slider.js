/* tools/utils/slider.js
   window.wireSlider(id, valId, fmt, onChange)
   Keeps a range input and a display-value element in sync.
     id       — ID of the <input type="range">
     valId    — ID of the element showing the formatted value
     fmt      — function(value) => display string (e.g. v => `${v}px`)
     onChange — called after each change (optional)
   Initialises the display value immediately on call.
*/
'use strict';
window.wireSlider = function wireSlider(id, valId, fmt, onChange) {
  const sl = document.getElementById(id);
  const vl = document.getElementById(valId);
  if (!sl || !vl) return;
  if (typeof fmt !== 'function') fmt = v => v;
  function update() {
    vl.textContent = fmt(sl.value);
    if (typeof onChange === 'function') onChange();
  }
  sl.addEventListener('input', update);
  update(); // set initial display
};
