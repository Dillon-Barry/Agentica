export const href = (path: string): string => `#/${path}`;

export function go(path: string): void {
  location.hash = href(path);
}
