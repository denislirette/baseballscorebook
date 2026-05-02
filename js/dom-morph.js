// Minimal DOM morpher: walks an old subtree against a freshly-rendered new
// subtree and only mutates what actually differs. Updating one digit in a
// large table touches one text node — no element is removed and re-inserted,
// so the browser doesn't repaint the whole subtree and the user doesn't see
// a flash on auto-refresh.
//
// Pairing strategy is index-based — fine here because the scorecard renderer
// produces a stable DOM shape between ticks (same tables, same rows in the
// same order). When the shape genuinely changes (new pitch cell appended,
// inning row added) the extra children are added or removed at the tail.

const ELEMENT = 1;
const TEXT = 3;

/** Replace the children of `oldParent` with the structure of `newParent`,
 *  reusing existing nodes wherever possible. */
export function morphChildren(oldParent, newParent) {
  const oldKids = oldParent.childNodes;
  const newKids = newParent.childNodes;
  const max = Math.max(oldKids.length, newKids.length);

  for (let i = 0; i < max; i++) {
    const o = oldKids[i];
    const n = newKids[i];

    if (!o && n) {
      oldParent.appendChild(n.cloneNode(true));
      continue;
    }
    if (o && !n) {
      // Remove from the tail; index keeps lining up because we never
      // re-index — once we hit the first missing pair every subsequent
      // index is also extra.
      while (oldParent.childNodes.length > newKids.length) {
        oldParent.removeChild(oldParent.lastChild);
      }
      break;
    }
    morphNode(o, n);
  }
}

/** Morph `oldNode` to look like `newNode`. Replaces wholesale only when
 *  the node types or tag names diverge. */
export function morphNode(oldNode, newNode) {
  if (oldNode.nodeType !== newNode.nodeType) {
    oldNode.replaceWith(newNode.cloneNode(true));
    return;
  }

  if (oldNode.nodeType === TEXT) {
    if (oldNode.nodeValue !== newNode.nodeValue) {
      oldNode.nodeValue = newNode.nodeValue;
    }
    return;
  }

  if (oldNode.nodeType !== ELEMENT) return;

  if (oldNode.nodeName !== newNode.nodeName) {
    oldNode.replaceWith(newNode.cloneNode(true));
    return;
  }

  // <input>, <textarea>, <select> have user-edited state we shouldn't
  // clobber on re-render. Skip — none of the scorecard outputs use them
  // today, but it's cheap insurance.
  if (oldNode.nodeName === 'INPUT' || oldNode.nodeName === 'TEXTAREA' || oldNode.nodeName === 'SELECT') {
    syncAttrs(oldNode, newNode);
    return;
  }

  // <details> open state is per-user; preserve it.
  if (oldNode.nodeName === 'DETAILS') {
    const wasOpen = oldNode.open;
    syncAttrs(oldNode, newNode);
    oldNode.open = wasOpen;
    morphChildren(oldNode, newNode);
    return;
  }

  syncAttrs(oldNode, newNode);
  morphChildren(oldNode, newNode);
}

function syncAttrs(oldEl, newEl) {
  const oldAttrs = oldEl.attributes;
  const newAttrs = newEl.attributes;

  // Add/update attributes from new
  for (let i = 0; i < newAttrs.length; i++) {
    const a = newAttrs[i];
    if (oldEl.getAttribute(a.name) !== a.value) {
      oldEl.setAttribute(a.name, a.value);
    }
  }

  // Remove attributes that are gone
  for (let i = oldAttrs.length - 1; i >= 0; i--) {
    const a = oldAttrs[i];
    if (!newEl.hasAttribute(a.name)) {
      oldEl.removeAttribute(a.name);
    }
  }
}
