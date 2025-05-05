// app/routes/click.ts
import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { recordClick } from "~/utils/trackClick.server";
import { visitorCookie } from "~/utils/cookies";
import { v4 as uuidv4 } from "uuid";

export const action: ActionFunction = async ({ request }) => {
  // 1. Visitor cookie’sini oku veya oluştur
  const cookieHeader = request.headers.get("Cookie") || "";
  let visitorId = await visitorCookie.parse(cookieHeader);
  if (!visitorId) {
    visitorId = uuidv4();
  }

  // 2. Gelen body’den linkId al
  const { link } = await request.json();

  // 3. Kaydı Directus’a ilet
  try {
    await recordClick(null, link, visitorId);
  } catch (err) {
    console.error("[ClickAPI] recordClick error:", err);
    return json({ ok: false, error: "Recording failed" }, { status: 500 });
  }

  // 4. Eğer yeni visitorId oluşturduysak, Set-Cookie ekle
  const headers: Record<string,string> = {};
  if (!cookieHeader.includes(`visitorId=${visitorId}`)) {
    headers["Set-Cookie"] = await visitorCookie.serialize(visitorId);
  }

  // 5. Başarıyla tamamla
  return json({ ok: true }, { headers });
};
