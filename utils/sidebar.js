/* tools/utils/sidebar.js
   window.initSidebarSections(storageKey, sectionIds[])
   - Wires click-to-toggle on each .sb-sec (via its .sb-hdr child)
   - Persists collapse state to localStorage under `${storageKey}_collapsed`
   - sectionIds: array of element IDs for .sb-sec elements to manage
     (pass [] or omit to manage ALL .sb-sec elements found at call time)
   Self-loads sidebar.css from the same directory.
*/
'use strict';
(function () {
  // Self-load CSS
  const src = document.currentScript && document.currentScript.src;
  if (src) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = src.replace(/\.js$/, '.css');
    document.head.appendChild(link);
  }

  window.initSidebarSections = function initSidebarSections(storageKey, sectionIds) {
    const collapseKey = storageKey + '_collapsed';

    // Load persisted state
    let collapsed = [];
    try { collapsed = JSON.parse(localStorage.getItem(collapseKey) || '[]'); } catch(e) {}

    function getSections() {
      if (sectionIds && sectionIds.length) {
        return sectionIds.map(id => document.getElementById(id)).filter(Boolean);
      }
      return Array.from(document.querySelectorAll('.sb-sec'));
    }

    function persist() {
      const ids = getSections()
        .filter(el => el.classList.contains('collapsed'))
        .map(el => el.id);
      try { localStorage.setItem(collapseKey, JSON.stringify(ids)); } catch(e) {}
    }

    function init() {
      const sections = getSections();

      // Restore collapse state
      sections.forEach(sec => {
        if (sec.id && collapsed.includes(sec.id)) {
          sec.classList.add('collapsed');
        }
      });

      // Wire click handlers on .sb-hdr children
      sections.forEach(sec => {
        const hdr = sec.querySelector('.sb-hdr');
        if (hdr && !hdr._sbWired) {
          hdr._sbWired = true;
          hdr.addEventListener('click', () => {
            sec.classList.toggle('collapsed');
            persist();
          });
        }
      });
    }

    // Run now or after DOM ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }

    // Return helper to re-apply to new sections (e.g. dynamically added)
    return { refresh: init, persist };
  };
})();
