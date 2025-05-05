import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { authenticator } from "~/utils/auth.server";
import { sessionStorage } from "~/utils/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  // 1) Authenticate WITHOUT successRedirect -> dönen `user` objesini alır
  const user = await authenticator.authenticate("google", request);
  
  // 2) Manuel olarak session'ı güncelle
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );
  // authenticator.sessionKey ile saklama anahtarı otomatik uyumlu olur
  session.set(authenticator.sessionKey, user);

  const headers = {
    "Set-Cookie": await sessionStorage.commitSession(session),
  };

  // 3) Şartları kabul edip etmediğine göre yönlendir
  if (!user.termsAccepted) {
    return redirect("/kvkk", { headers });
  }
  return redirect("/profilim", { headers });
};
