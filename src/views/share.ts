import { h } from "../dom";

/** The public site, so copied links work for whoever receives them. */
export const SITE_URL = "https://dillon-barry.github.io/Agentica/";

export const shareUrl = (path: string) => `${SITE_URL}#/${path}`;

async function copy(text: string): Promise<boolean> {
  try {
    // Some browsers leave the promise pending (a permission prompt that never
    // shows); give up after a second and use the fallback.
    await Promise.race([
      navigator.clipboard.writeText(text),
      new Promise((_, reject) => window.setTimeout(() => reject(new Error("clipboard timeout")), 1000)),
    ]);
    return true;
  } catch {
    // Older browsers, or clipboard blocked: fall back to a hidden text box.
    const area = h("textarea", { class: "sr-only", readonly: true });
    area.value = text;
    document.body.append(area);
    area.select();
    const ok = document.execCommand("copy");
    area.remove();
    return ok;
  }
}

/** Button that copies a link to `path` and says so. */
export function copyLinkButton(path: string, label = "COPY LINK", cls = "btn btn-small btn-ghost"): HTMLButtonElement {
  const b = h(
    "button",
    {
      class: cls,
      type: "button",
      title: `Copy a link: ${shareUrl(path)}`,
      onclick: async () => {
        const ok = await copy(shareUrl(path));
        b.textContent = ok ? "COPIED ✔" : "COPY FAILED";
        window.setTimeout(() => (b.textContent = label), 1600);
      },
    },
    label,
  );
  return b;
}
