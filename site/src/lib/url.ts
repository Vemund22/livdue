// Prefixar interna länkar med Astros base så sajten funkar både på
// livdue.com (rot) och på staging under en undersökväg (GitHub Pages)
const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export function u(path: string): string {
  return base + path;
}
