// app/utils/session.server.ts
import { createCookieSessionStorage } from "@remix-run/node";

if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET env değişkeni tanımlı olmalı");
}

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    secure: process.env.NODE_ENV === "production",
    secrets: [process.env.SESSION_SECRET],
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    // istekler arası sızıntıyı önlemek için httpOnly
  },
});

export const { getSession, commitSession, destroySession } = sessionStorage;
