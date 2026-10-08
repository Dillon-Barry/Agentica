export const reducedMotion = (): boolean =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export interface Typing {
  /** True while characters are still being revealed. */
  active(): boolean;
  /** Reveal everything immediately. */
  finish(): void;
  cancel(): void;
}

/**
 * Renders `html` into `el`, then reveals its text a few characters at a time,
 * keeping markup (bold, code) intact.
 */
export function typewrite(el: HTMLElement, html: string, onDone?: () => void): Typing {
  el.innerHTML = html;

  const nodes: { node: Text; full: string }[] = [];
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const node = n as Text;
    nodes.push({ node, full: node.data });
    node.data = "";
  }

  let ni = 0;
  let ci = 0;
  let timer: number | undefined;

  const done = () => {
    if (timer !== undefined) window.clearInterval(timer);
    timer = undefined;
    onDone?.();
  };

  const finish = () => {
    if (timer === undefined) return;
    for (const { node, full } of nodes) node.data = full;
    done();
  };

  const step = () => {
    let budget = 2;
    while (budget > 0 && ni < nodes.length) {
      const { node, full } = nodes[ni];
      const take = Math.min(budget, full.length - ci);
      ci += take;
      budget -= take;
      node.data = full.slice(0, ci);
      if (ci >= full.length) {
        ni++;
        ci = 0;
      }
    }
    if (ni >= nodes.length) done();
  };

  timer = window.setInterval(step, 16);
  if (reducedMotion()) finish();

  return {
    active: () => timer !== undefined,
    finish,
    cancel: () => {
      if (timer !== undefined) window.clearInterval(timer);
      timer = undefined;
    },
  };
}
