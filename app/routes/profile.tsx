// app/routes/profile.tsx
import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { json, redirect }                     from "@remix-run/node";
import { useLoaderData, Form }                from "@remix-run/react";
import { authenticator }                      from "~/utils/auth.server";
import { Mail, User as UserIcon, Calendar }   from "lucide-react";

const API_URL = process.env.PUBLIC_DIRECTUS_API_URL!;
const TOKEN   = process.env.PUBLIC_DIRECTUS_API_TOKEN!;

type LoaderData = {
  user: {
    email:         string;
    firstName:     string;
    lastName:      string;
    dogum_tarihi: string;
    canEditDob:    boolean;
    avatarUrl?:    string;
  };
};

export const loader: LoaderFunction = async ({ request }) => {
  const sessionUser = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  // Email & name
  const email     =
    sessionUser.email ?? sessionUser.emails?.[0]?.value ?? "";
  const firstName =
    sessionUser.firstName ?? sessionUser.name?.givenName ?? "";
  const lastName  =
    sessionUser.lastName ?? sessionUser.name?.familyName ?? "";

  // Google profile photo (if any)
  const avatarUrl =
    (sessionUser.photos?.[0]?.value as string | undefined) ??
    (sessionUser._json?.picture as string | undefined);

  // Fetch Directus record
  const listRes = await fetch(
    `${API_URL}/items/kullanicilar?filter[email][_eq]=${encodeURIComponent(email)}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization:   `Bearer ${TOKEN}`,
      },
    }
  );
  if (!listRes.ok) {
    throw new Response("Directus’tan veri çekilemedi", { status: listRes.status });
  }
  const { data } = await listRes.json();
  const rawDob = data?.[0]?.dogum_tarihi ?? "";
  const dogum_tarihi = rawDob.includes("T") ? rawDob.split("T")[0] : rawDob;
  const canEditDob = dogum_tarihi === "";

  return json<LoaderData>({
    user: { email, firstName, lastName, dogum_tarihi, canEditDob, avatarUrl },
  });
};

export const action: ActionFunction = async ({ request }) => {
  const sessionUser = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  const email =
    sessionUser.email ?? sessionUser.emails?.[0]?.value ?? "";

  const formData      = await request.formData();
  const dogum_tarihi = formData.get("dogum_tarihi") as string | null;
  if (!dogum_tarihi) {
    return json({ error: "Lütfen doğum tarihi girin." }, { status: 400 });
  }

  // Check existing record
  const listRes = await fetch(
    `${API_URL}/items/kullanicilar?filter[email][_eq]=${encodeURIComponent(email)}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization:  `Bearer ${TOKEN}`,
      },
    }
  );
  const { data } = await listRes.json();

  // Prevent changes if already set
  if (data[0]?.dogum_tarihi) {
    return redirect("/profile");
  }

  if (data.length > 0) {
    const id = data[0].id;
    await fetch(`${API_URL}/items/kullanicilar/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization:  `Bearer ${TOKEN}`,
      },
      body: JSON.stringify({ dogum_tarihi }),
    });
  } else {
    await fetch(`${API_URL}/items/kullanicilar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:  `Bearer ${TOKEN}`,
      },
      body: JSON.stringify({ email, dogum_tarihi }),
    });
  }

  return redirect("/profile");
};

export default function ProfilePage() {
  const { user } = useLoaderData<LoaderData>();
  const initials = `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 p-6">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-8 flex flex-col items-center">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt="Profil Fotoğrafı"
              className="w-24 h-24 rounded-full object-cover shadow-lg"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-purple-400 to-indigo-400 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
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
            {user.canEditDob ? (
              <Form method="post" replace className="space-y-4">
                <label className="block text-gray-700 dark:text-gray-300">
                  <div className="flex items-center mb-1">
                    <Calendar className="mr-2" size={18} />
                    <span className="font-medium">Doğum Tarihi</span>
                  </div>
                  <input
                    type="date"
                    name="dogum_tarihi"
                    defaultValue={user.dogum_tarihi}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </label>

                <button
                  type="submit"
                  className="w-full py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-lg transition"
                >
                  Kaydet
                </button>
              </Form>
            ) : (
              <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-center">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Doğum tarihiniz: {user.dogum_tarihi}
                </span>
              </div>
            )}

            <Form method="post" action="/logout" className="mt-4">
              <button
                type="submit"
                className="w-full py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition"
              >
                Çıkış Yap
              </button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
