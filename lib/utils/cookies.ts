"use client";

const DEFAULT_EXPIRES_DAYS = 30;

function getRootDomain(): string {
  const hostname = window.location.hostname;
  const parts = hostname.split(".");
  return parts.length >= 2 ? `.${parts.slice(-2).join(".")}` : hostname;
}

export function setInCookies(key: string, value: string, days: number = DEFAULT_EXPIRES_DAYS): void {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  const domain = getRootDomain();
  const cookieKey = "mushroom_" + key;
  document.cookie = `${cookieKey}=${encodeURIComponent(value)}; expires=${expires}; path=/; domain=${domain}`;
}

export function getFromCookies(key: string): string | null {
  const cookieKey = "mushroom_" + key;
  const match = document.cookie.match(new RegExp(`(?:^|; )${cookieKey}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function removeCookie(key: string): void {
  const cookieKey = "mushroom_" + key;
  const domain = getRootDomain();
  document.cookie = `${cookieKey}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain}`;
}