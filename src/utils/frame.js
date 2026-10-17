/**
 * Schedules a callback on the next frame, with a timer fallback.
 *
 * requestAnimationFrame is the right choice for scroll-linked work — it
 * batches callbacks with paint. But it is suspended outright in a hidden or
 * frozen tab, so anything that *depends* on it to become visible can be left
 * stuck. We therefore race rAF against a short timeout: in normal use rAF wins
 * and the timeout is cleared, and if the tab is frozen the timeout still runs.
 *
 * @param {() => void} fn
 * @param {number} fallbackMs delay for the fallback path
 * @returns {() => void} cancel
 */
export function nextFrame(fn, fallbackMs = 120) {
  let done = false;
  let timer = 0;
  let raf = 0;

  const run = () => {
    if (done) return;
    done = true;
    if (timer) clearTimeout(timer);
    if (raf) cancelAnimationFrame(raf);
    fn();
  };

  timer = setTimeout(run, fallbackMs);
  raf = typeof requestAnimationFrame === 'function' ? requestAnimationFrame(run) : 0;

  return () => {
    done = true;
    if (timer) clearTimeout(timer);
    if (raf) cancelAnimationFrame(raf);
  };
}
