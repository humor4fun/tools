/* tools/utils/color.js
   
   Flexible config color picker sync utility.
   
   Usage:
     window.wireColorPair(picker, hexInput, onChange)
   
   Keeps a color <input type="color"> and a hex text input in sync.
   onChange is called whenever either changes (optional).
*/
'use strict';
(function () {
  const DEFAULT_CONFIG = {
    validateHex: true,
    onChange: null
  };

  window.wireColorPair = function wireColorPair(picker, hexInput, userOnChange) {
    const config = {
      validateHex: true,
      onChange: typeof userOnChange === 'function' ? userOnChange : null
    };

    picker.addEventListener('input', () => {
      hexInput.value = picker.value;
      if (config.onChange) config.onChange();
    });

    hexInput.addEventListener('input', () => {
      if (!config.validateHex || /^#[0-9a-fA-F]{6}$/.test(hexInput.value)) {
        picker.value = hexInput.value;
        if (config.onChange) config.onChange();
      }
    });
  };
})();
