export const BASE_URL: string = import.meta.env.BASE_URL || '/';

export function getUrl(path: string = ''): string {
  if (!path || path === '/') {
    return BASE_URL;
  }
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('mailto:') || path.startsWith('#')) {
    return path;
  }
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const baseWithSlash = BASE_URL.endsWith('/') ? BASE_URL : `${BASE_URL}/`;
  return `${baseWithSlash}${cleanPath}`;
}
