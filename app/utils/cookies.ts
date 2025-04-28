// app/utils/cookies.ts
import { parse } from "cookie";

export function getCookieConsent(cookieHeader: string) {
  const cookies = parse(cookieHeader);
  return cookies.cookieConsent; // "accepted" | "declined" | undefined
}
