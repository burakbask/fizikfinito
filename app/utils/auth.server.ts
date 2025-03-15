import { GoogleStrategy } from "remix-auth-google";
import { Authenticator } from "remix-auth";
import { sessionStorage } from "~/utils/session.server";
import dotenv from "dotenv";

dotenv.config();

export let authenticator = new Authenticator(sessionStorage);

let googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: process.env.GOOGLE_CALLBACK_URL!,
  },
  async ({ accessToken, refreshToken, extraParams, profile }) => {
    // Kullanıcıyı veritabanınıza ekleyebilir veya mevcut kullanıcıyı alabilirsiniz.
    // Bu örnekte, profil bilgilerini geri döndürüyoruz.
    return profile;
  }
);

authenticator.use(googleStrategy);
