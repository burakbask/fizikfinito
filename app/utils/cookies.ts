// src/utils/cookies.ts
import { createCookie } from "@remix-run/node";
import { parse } from "cookie";

// Mevcut fonksiyon
export function getCookieConsent(cookieHeader: string) {
  const cookies = parse(cookieHeader);
  return cookies.cookieConsent; // "accepted" | "declined" | undefined
}

// Yeni: visitorId için cookie tanımı
export const visitorCookie = createCookie("visitorId", {
  maxAge: 60 * 60 * 24 * 365, // 1 yıl
  httpOnly: true,
  sameSite: "lax",
  path: "/",
});

// İstersen helper da ekleyebilirsin:
export async function getVisitorId(request: Request) {
  const header = request.headers.get("Cookie") || "";
  let id = await visitorCookie.parse(header);
  return id;
}
