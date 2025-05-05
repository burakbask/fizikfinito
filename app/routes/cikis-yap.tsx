// app/routes/cikis-yap.tsx
import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { destroySession, getSession } from "~/utils/session.server";

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  return redirect("/giris-yap", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
};
