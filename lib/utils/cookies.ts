export function setInCookies(key: string, value: string, days = 30) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  const isSecure = typeof window !== "undefined" && window.location.protocol === "https:";
  const secureFlag = isSecure ? "; Secure; SameSite=Lax" : "; SameSite=Lax";
  document.cookie = `${key}=${encodeURIComponent(value)}; expires=${expires}; path=/${secureFlag}`;
}

export function getFromCookies(key: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${key}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function removeCookie(key: string) {
  document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
}
