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
  async ({ profile }) => {
    // 1. extract email
    const email = profile.emails?.[0]?.value;
    if (!email) {
      throw new Error("Google profile did not contain an email.");
    }

    // your Directus REST endpoint & token
    const API_URL = process.env.PUBLIC_DIRECTUS_API_URL!;
    const TOKEN   = process.env.PUBLIC_DIRECTUS_API_TOKEN!;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    };

    // 2. check for existing user
    const listRes = await fetch(
      `${API_URL}/items/kullanicilar?filter[email][_eq]=${encodeURIComponent(email)}`,
      { headers }
    );
    if (!listRes.ok) {
      console.error(await listRes.text());
      throw new Error("Failed to query Directus");
    }
    const { data } = await listRes.json();

    if (Array.isArray(data) && data.length > 0) {
      // 3a. existing → update
      const id = data[0].id;
      const patchRes = await fetch(`${API_URL}/items/kullanicilar/${id}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ email }),
      });
      if (!patchRes.ok) {
        console.error(await patchRes.text());
        throw new Error("Failed to update Directus record");
      }
    } else {
      // 3b. not found → create
      const postRes = await fetch(`${API_URL}/items/kullanicilar`, {
        method: "POST",
        headers,
        body: JSON.stringify({ email }),
      });
      if (!postRes.ok) {
        console.error(await postRes.text());
        throw new Error("Failed to create Directus record");
      }
    }

    // 4. finish auth
    return profile;
  }
);

authenticator.use(googleStrategy);
