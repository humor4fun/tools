/* tools/utils/debounce.js
   window.debounce(fn, delay) — returns a debounced version of fn.
*/
'use strict';
window.debounce = function debounce(fn, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
};
