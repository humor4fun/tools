/* tools/utils/slider.js
   
   Flexible config range slider sync utility.
   
   Usage:
     window.wireSlider(id, valId, fmt, onChange)
   
   Keeps a range input and a display-value element in sync.
      id       — ID of the <input type="range">
      valId    — ID of the element showing the formatted value
      fmt      — function(value) => display string (e.g. v => `${v}px`)
      onChange — called after each change (optional)
   Initialises the display value immediately on call.
*/
'use strict';
(function () {
  const DEFAULT_CONFIG = {
    format: v => v,
    onChange: null
  };

  window.wireSlider = function wireSlider(id, valId, fmt, onChange) {
    const sl = document.getElementById(id);
    const vl = document.getElementById(valId);
    if (!sl || !vl) return;

    const config = {
      format: typeof fmt === 'function' ? fmt : (v => v),
      onChange: typeof onChange === 'function' ? onChange : null
    };

    function update() {
      vl.textContent = config.format(sl.value);
      if (config.onChange) config.onChange();
    }

    sl.addEventListener('input', update);
    update(); // set initial display
  };
})();
