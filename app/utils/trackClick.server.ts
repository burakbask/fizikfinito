// src/utils/trackClick.server.ts
import { addItem } from "./directusClient";

/**
 * Directus'taki `link_clicks` koleksiyonuna bir tıklama kaydı ekler.
 * @param userId - Giriş yapmış kullanıcı ID'si, yoksa null
 * @param linkId - Tıklanan linkin ID veya URL'si
 * @param visitorId - Anonim ziyaretçi kimliği (UUID)
 */
export async function recordClick(
  userId: string | number | null,
  linkId: string,
  visitorId?: string
): Promise<void> {
  const payload: Record<string, any> = {
    link: linkId,
    clicked_at: new Date().toISOString(),
  };

  if (userId) {
    payload.user = userId;
  } else if (visitorId) {
    payload.visitor_id = visitorId;
  }

  // Directus REST API üzerinden yeni kayıt oluştur
  const result = await addItem("link_clicks", payload);
  if (!result) {
    throw new Error("Click tracking failed: Directus addItem returned null");
  }
}