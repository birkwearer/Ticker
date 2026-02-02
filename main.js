// Please use event listeners to run functions.
document.addEventListener('onLoad', function (obj) {
  // obj will be empty for chat widget
  // this will fire only once when the widget loads
});

document.addEventListener('onEventReceived', function (obj) {
  // obj will contain information about the event
});

// Auto-scroll newest message to be the left-most visible item
(function () {
  const log = document.getElementById('log');
  if (!log) return;

  // small z-index counter so newest animations sit on top of earlier ones
  let zCounter = 1000;

  // Scroll the container so `node` becomes the left-most visible element.
  // Uses smooth scroll when available.
  function scrollNodeToLeft(node, smooth = true) {
    if (!node) return;
    // Compute the x position of the node relative to the scroll container
    // offsetLeft is relative to offsetParent; for a simple #log it's fine.
    const nodeLeft = node.offsetLeft;

    // If container has left padding, offsetLeft already includes it.
    const left = Math.max(0, nodeLeft);

    try {
      log.scrollTo({ left, behavior: smooth ? 'smooth' : 'auto' });
    } catch (e) {
      // fallback
      log.scrollLeft = left;
    }
  }

  // Observe added child nodes and scroll the newest one to the left.
  const mo = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.type !== 'childList' || !m.addedNodes.length) continue;

      m.addedNodes.forEach((node) => {
        if (!(node instanceof HTMLElement)) return;

        // push this node above earlier ones to avoid overlap during animation
        zCounter += 1;
        node.style.zIndex = String(zCounter);

        // small delay to ensure layout and animation kickoff complete before scrolling
        // 20ms is enough in practice; increase slightly if you see visual jitter
        setTimeout(() => scrollNodeToLeft(node, /*smooth=*/true), 20);
      });
    }
  });

  mo.observe(log, { childList: true });

  // expose a manual helper if you need it elsewhere
  window.__chatLogHelpers = window.__chatLogHelpers || {};
  window.__chatLogHelpers.scrollNewestToLeft = function (instant = false) {
    const last = log.lastElementChild;
    if (!last) return;
    scrollNodeToLeft(last, !instant);
  };
})();