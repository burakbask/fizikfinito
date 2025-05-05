// app/routes/profile.tsx
import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { json, redirect }                     from "@remix-run/node";
import { useLoaderData, Form }                from "@remix-run/react";
import { useState, useEffect }                from "react";
import { authenticator }                      from "~/utils/auth.server";
import { Mail, User as UserIcon }             from "lucide-react";
import Swal                                    from "sweetalert2";
import 'sweetalert2/dist/sweetalert2.min.css';

const API_URL = process.env.PUBLIC_DIRECTUS_API_URL!;
const TOKEN   = process.env.PUBLIC_DIRECTUS_API_TOKEN!;

type LoaderData = {
  user: {
    email:     string;
    firstName: string;
    lastName:  string;
    avatarUrl?: string;
    role:      string;
    sinif?:    string;
    alan?:     string;
    brans?:    string;
  };
  showPopup: boolean;
  locked:    boolean;
};

export const loader: LoaderFunction = async ({ request }) => {
  const sessionUser = await authenticator.isAuthenticated(request, {
    failureRedirect: "/giris-yap",
  });

  const email     = sessionUser.email ?? sessionUser.emails?.[0]?.value ?? "";
  const firstName = sessionUser.firstName ?? sessionUser.name?.givenName ?? "";
  const lastName  = sessionUser.lastName  ?? sessionUser.name?.familyName ?? "";
  const avatarUrl =
    (sessionUser.photos?.[0]?.value as string | undefined) ??
    (sessionUser._json?.picture  as string | undefined);

  const res = await fetch(
    `${API_URL}/items/kullanicilar?filter[email][_eq]=${encodeURIComponent(email)}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization:   `Bearer ${TOKEN}`,
      },
    }
  );
  if (!res.ok) {
    throw new Response("Directus’tan veri çekilemedi", { status: res.status });
  }
  const { data } = await res.json();
  const record   = data?.[0] ?? {};

  const url       = new URL(request.url);
  const showPopup = url.searchParams.get("saved") === "1";
  const locked    = Boolean(record.role);

  return json<LoaderData>({
    user: {
      email,
      firstName,
      lastName,
      avatarUrl,
      role:  record.role  ?? "",
      sinif: record.sinif ?? "",
      alan:  record.alan  ?? "",
      brans: record.brans ?? "",
    },
    showPopup,
    locked,
  });
};

export const action: ActionFunction = async ({ request }) => {
  const sessionUser = await authenticator.isAuthenticated(request, {
    failureRedirect: "/giris-yap",
  });
  const email = sessionUser.email ?? sessionUser.emails?.[0]?.value ?? "";

  const formData = await request.formData();
  const role     = formData.get("role")  as string | null;
  const sinif    = formData.get("sinif") as string | null;
  const alan     = formData.get("alan")  as string | null;
  const brans    = formData.get("brans") as string | null;

  if (!role) {
    return json({ error: "Lütfen profil tipinizi seçin." }, { status: 400 });
  }
  if (role === "Öğrenci" && !sinif) {
    return json({ error: "Lütfen sınıfınızı seçin." }, { status: 400 });
  }
  if (
    role === "Öğrenci" &&
    ["9","10","11","12"].includes(sinif!) &&
    !alan
  ) {
    return json({ error: "Lütfen alanınızı seçin." }, { status: 400 });
  }
  if (role === "Öğretmen" && !brans) {
    return json({ error: "Lütfen branşınızı girin." }, { status: 400 });
  }

  const listRes = await fetch(
    `${API_URL}/items/kullanicilar?filter[email][_eq]=${encodeURIComponent(email)}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization:   `Bearer ${TOKEN}`,
      },
    }
  );
  const { data } = await listRes.json();

  const payload: Record<string, any> = { role };
  if (role === "Öğrenci") {
    payload.sinif = sinif;
    payload.alan  = ["9","10","11","12"].includes(sinif!) ? alan : null;
    payload.brans = null;
  } else if (role === "Öğretmen") {
    payload.brans = brans;
    payload.sinif = null;
    payload.alan  = null;
  } else {
    payload.sinif = null;
    payload.alan  = null;
    payload.brans = null;
  }

  if (data.length > 0) {
    await fetch(`${API_URL}/items/kullanicilar/${data[0].id}`, {
      method:  "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization:   `Bearer ${TOKEN}`,
      },
      body: JSON.stringify(payload),
    });
  } else {
    await fetch(`${API_URL}/items/kullanicilar`, {
      method:  "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:   `Bearer ${TOKEN}`,
      },
      body: JSON.stringify({ email, ...payload }),
    });
  }

  return redirect("/profilim?saved=1");
};

export default function ProfilePage() {
  const { user, showPopup, locked } = useLoaderData<LoaderData>();
  const initials = `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase();

  const [role, setRole]   = useState(user.role);
  const [sinif, setSinif] = useState(user.sinif);
  const [alan, setAlan]   = useState(user.alan);
  const [brans, setBrans] = useState(user.brans);

  useEffect(() => {
    if (showPopup) {
      Swal.fire({
        icon:             "success",
        title:            "Başarılı!",
        text:             "Bilgileriniz başarıyla eklendi.",
        timer:            2000,
        showConfirmButton:false,
      });
    }
  }, [showPopup]);

  const classOptions = [
    { value: "9",  label: "9. Sınıf" },
    { value: "10", label: "10. Sınıf" },
    { value: "11", label: "11. Sınıf" },
    { value: "12", label: "12. Sınıf" },
    { value: "mezun", label: "Mezun" },
    { value: "universite", label: "Üniversite Öğrencisi" },
    ...Array.from({ length: 8 }, (_, i) => ({
      value: String(i + 1),
      label: `${i + 1}. Sınıf`,
    })),
  ];

  return (
    <div className="min-h-screen flex items-center justify-center
                    bg-gradient-to-br from-indigo-500 to-purple-600 p-6">
      <div className="w-full max-w-md bg-white dark:bg-gray-900
                      rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-8 flex flex-col items-center">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt="Profil Fotoğrafı"
              className="w-24 h-24 rounded-full object-cover shadow-lg"
            />
          ) : (
            <div className="w-24 h-24 rounded-full
                            bg-gradient-to-tr from-purple-400 to-indigo-400
                            flex items-center justify-center text-3xl
                            font-bold text-white shadow-lg">
              {initials || <UserIcon size={32} />}
            </div>
          )}

          <h2 className="mt-4 text-2xl font-semibold text-gray-800 dark:text-gray-100">
            {user.firstName} {user.lastName}
          </h2>

          <div className="mt-2 flex items-center text-gray-700 dark:text-gray-300">
            <Mail className="mr-2" size={20} />
            <span className="font-medium">{user.email}</span>
          </div>

          <div className="mt-6 w-full">
            <Form method="post" replace className="space-y-4">
              {/* Profil Tipi */}
              <label className="block text-gray-700 dark:text-gray-300">
                <span className="font-medium">Profil Tipi</span>
                <select
                  name="role"
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  disabled={locked}
                  className="mt-1 block w-full px-4 py-2
                             border border-gray-300 dark:border-gray-700
                             rounded-lg bg-gray-50 dark:bg-gray-800
                             focus:outline-none focus:ring-2 focus:ring-indigo-400
                             disabled:appearance-none"
                >
                  <option value="">Seçiniz...</option>
                  <option>Öğrenci</option>
                  <option>Öğretmen</option>
                  <option>Ebeveyn</option>
                </select>
              </label>

              {/* Öğrenci ise Sınıf */}
              {role === "Öğrenci" && (
                <label className="block text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Sınıf</span>
                  <select
                    name="sinif"
                    value={sinif}
                    onChange={e => setSinif(e.target.value)}
                    disabled={locked}
                    className="mt-1 block w-full px-4 py-2
                               border border-gray-300 dark:border-gray-700
                               rounded-lg bg-gray-50 dark:bg-gray-800
                               focus:outline-none focus:ring-2 focus:ring-indigo-400
                               disabled:appearance-none"
                  >
                    <option value="">Seçiniz...</option>
                    {classOptions.map(c => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </label>
              )}

              {/* 9–12 ise Alan */}
              {(role === "Öğrenci" && ["9","10","11","12"].includes(sinif!)) && (
                <label className="block text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Alan</span>
                  <select
                    name="alan"
                    value={alan}
                    onChange={e => setAlan(e.target.value)}
                    disabled={locked}
                    className="mt-1 block w-full px-4 py-2
                               border border-gray-300 dark:border-gray-700
                               rounded-lg bg-gray-50 dark:bg-gray-800
                               focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  >
                    <option value="">Seçiniz...</option>
                    <option>Sayısal</option>
                    <option>Sözel</option>
                    <option>Eşit Ağırlık</option>
                  </select>
                </label>
              )}

              {/* Öğretmen ise Branş */}
              {role === "Öğretmen" && (
                <label className="block text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Branş</span>
                  <input
                    type="text"
                    name="brans"
                    value={brans}
                    onChange={e => setBrans(e.target.value)}
                    disabled={locked}
                    placeholder="Branşınızı girin"
                    className="mt-1 block w-full px-4 py-2
                               border border-gray-300 dark:border-gray-700
                               rounded-lg bg-gray-50 dark:bg-gray-800
                               focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </label>
              )}

              {!locked && (
                <button
                  type="submit"
                  className="w-full py-2 bg-indigo-500 hover:bg-indigo-600
                             text-white font-semibold rounded-lg transition"
                >
                  Kaydet
                </button>
              )}
            </Form>
          </div>

          <Form method="post" action="/cikis-yap" className="mt-4 w-full">
            <button
              type="submit"
              className="w-full py-2 bg-red-500 hover:bg-red-600
                         text-white font-semibold rounded-lg transition"
            >
              Çıkış Yap
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
}
