// File: app/utils/auth.server.ts

import { GoogleStrategy } from "remix-auth-google";
import { Authenticator } from "remix-auth";
import { sessionStorage } from "~/utils/session.server";
import dotenv from "dotenv";

dotenv.config();

// → User tipini genişlettik: artık firstName/lastName, photos ve _json var.
export type User = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  termsAccepted: boolean;
  photos?: { value?: string }[];
  _json?: { picture?: string };
};

export let authenticator = new Authenticator<User>(sessionStorage);

const googleStrategy = new GoogleStrategy<User>(
  {
    clientID:     process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL:  process.env.GOOGLE_CALLBACK_URL!,
  },
  async ({ profile }) => {
    // 1) E-posta
    const email = profile.emails?.[0]?.value;
    if (!email) throw new Error("Google profili e-posta içermiyor.");

    // 2) İsim / Soyisim (string olarak alıyoruz)
    const firstName = profile.name?.givenName  ?? "";
    const lastName  = profile.name?.familyName ?? "";

    // Directus API ayarları
    const API_URL = process.env.PUBLIC_DIRECTUS_API_URL!;
    const TOKEN   = process.env.PUBLIC_DIRECTUS_API_TOKEN!;
    const headers = {
      "Content-Type":  "application/json",
      Authorization:    `Bearer ${TOKEN}`,
    };

    // 3) Directus’ta var mı diye kontrol et
    const listRes = await fetch(
      `${API_URL}/items/kullanicilar?filter[email][_eq]=${encodeURIComponent(email)}&fields=id,email,termsAccepted`,
      { headers }
    );
    if (!listRes.ok) {
      console.error(await listRes.text());
      throw new Error("Directus sorgusu başarısız.");
    }
    const { data } = await listRes.json();

    let user: User;
    if (Array.isArray(data) && data.length > 0) {
      // 4a) Zaten varsa, session’a doğrudan yerleştiriyoruz
      const rec = data[0];
      user = {
        id:             rec.id,
        email:          rec.email,
        firstName,
        lastName,
        termsAccepted:  rec.termsAccepted ?? false,
        photos:         profile.photos,
        _json:          profile._json as any,
      };
    } else {
      // 4b) Yoksa ilk kaydı oluştur
      const postRes = await fetch(`${API_URL}/items/kullanicilar`, {
        method:  "POST",
        headers,
        body:    JSON.stringify({
          email,
          // Directus tablosunda isim/soyisim alanlarınız varsa,
          // burada property adlarını ona göre uyarlayın:
          isim:            firstName,
          soyisim:         lastName,
          termsAccepted:   false,
        }),
      });
      if (!postRes.ok) {
        console.error(await postRes.text());
        throw new Error("Kullanıcı oluşturma başarısız.");
      }
      const { data: newRec } = await postRes.json();
      user = {
        id:             newRec.id,
        email:          newRec.email,
        firstName,
        lastName,
        termsAccepted:  newRec.termsAccepted ?? false,
        photos:         profile.photos,
        _json:          profile._json as any,
      };
    }

    return user;
  }
);

authenticator.use(googleStrategy);
