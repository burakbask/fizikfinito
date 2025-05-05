// File: /app/routes/kvkk.tsx
import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData, useActionData } from "@remix-run/react";
import { authenticator } from "~/utils/auth.server";
import { sessionStorage } from "~/utils/session.server";

const API_URL = process.env.PUBLIC_DIRECTUS_API_URL!;
const TOKEN   = process.env.PUBLIC_DIRECTUS_API_TOKEN!;
const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${TOKEN}`,
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/giris-yap",
  });
  if (user.termsAccepted) {
    return redirect("/profilim");
  }
  return json({ email: user.email });
};

export const action: ActionFunction = async ({ request }) => {
  const form    = await request.formData();
  const consent = form.get("consent");
  if (consent !== "on") {
    return json(
      { formError: "Devam edebilmek için kutuyu işaretlemelisiniz." },
      { status: 400 }
    );
  }

  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const res = await fetch(`${API_URL}/items/kullanicilar/${user.id}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ termsAccepted: true }),
  });
  if (!res.ok) {
    console.error(await res.text());
    throw new Error("Onay güncellemesi başarısız.");
  }

  // Session içindeki user’ı güncelle
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );
  session.set(authenticator.sessionKey, {
    ...user,
    termsAccepted: true,
  });

  return redirect("/profilim", {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  });
};

export default function Kvkk() {
  const { email }   = useLoaderData<{ email: string }>();
  const actionData  = useActionData<{ formError?: string }>();

  return (
    <>
      <style>{`
        /* Genel sıfırlama */
        body { margin: 0; font-family: 'Segoe UI', Tahoma, sans-serif; }
        /* Arka plan, üstten alta doğru mor-mavi gradyan */
        .kvkk-bg {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #6E56CF 0%, #8A63D1 60%, #5A4FAB 100%);
          padding: 2rem;
        }
        /* Kart stili */
        .kvkk-card {
          background: #0c111f;
          border-radius: 16px;
          box-shadow: 0 12px 32px rgba(0,0,0,0.4);
          max-width: 500px;
          width: 100%;
          padding: 2.5rem;
          color: #f1f1f5;
        }
        .kvkk-header {
          font-size: 1.75rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          text-align: center;
        }
        .kvkk-info {
          font-size: 1rem;
          color: #cfd2d9;
          line-height: 1.6;
          margin-bottom: 1.5rem;
          text-align: center;
        }
        .kvkk-error {
          font-size: 0.9rem;
          color: #ff6b6b;
          text-align: center;
          margin-bottom: 1rem;
        }
        .kvkk-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .kvkk-label {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          font-size: 0.95rem;
          color: #e1e3e8;
          cursor: pointer;
          user-select: none;
        }
        .kvkk-label input {
          margin-top: 4px;
          width: 18px;
          height: 18px;
          accent-color: #8A63D1;
        }
        .kvkk-button {
          align-self: center;
          width: 90%;
          max-width: 320px;
          padding: 0.75rem 1rem;
          font-size: 1rem;
          font-weight: 600;
          border: none;
          border-radius: 8px;
          background: #8A63D1;
          color: #fff;
          cursor: pointer;
          transition: background 0.2s ease, transform 0.1s ease;
        }
        .kvkk-button:hover {
          background: #6E56CF;
          transform: translateY(-2px);
        }
      `}</style>

      <div className="kvkk-bg">
        <div className="kvkk-card">
          <h1 className="kvkk-header">Son Bir Adım!</h1>
          <p className="kvkk-info">
            <strong>{email}</strong> hesabınla devam etmek için lütfen aşağıdaki metni
            okuyup onayla:
          </p>

          {actionData?.formError && (
            <div className="kvkk-error">{actionData.formError}</div>
          )}

          <Form method="post" className="kvkk-form">
            <label className="kvkk-label">
              <input type="checkbox" name="consent" />
              KVKK Açık Rıza Metni, Kullanıcı Sözleşmesi,<br/>
              KVKK Aydınlatma Metni ve Çerez Aydınlatma Metnini<br/>
              okudum ve kabul ediyorum.
            </label>
            <button type="submit" className="kvkk-button">
              Onayla ve Devam Et
            </button>
          </Form>
        </div>
      </div>
    </>
  );
}
