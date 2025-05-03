// File: /app/routes/oneri.tsx
import type {
  LoaderFunction,
  ActionFunction,
  MetaFunction,
  LinksFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData, useActionData } from "@remix-run/react";
import React, { useState, useEffect } from "react";
import {
  Atom,
  User as IconUser,
  Mail as IconMail,
  MessageCircle,
  X,
} from "lucide-react";
import { authenticator } from "~/utils/auth.server";
import { addItem } from "~/utils/directusClient";

// --- Directus ayarları ---
const API_URL = process.env.PUBLIC_DIRECTUS_API_URL!;
const TOKEN   = process.env.PUBLIC_DIRECTUS_API_TOKEN!;
const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${TOKEN}`,
};

// --- Meta & Canonical ---
export const meta: MetaFunction = () => [
  { title: "Öneri & Geri Bildirim" },
  {
    name: "description",
    content: "Platformumuzu geliştirmek için önerilerinizi paylaşın.",
  },
];
export const links: LinksFunction = () => [
  { rel: "canonical", href: "https://www.fizikfinito.com/oneri" },
];

// --- Loader: kullanıcıyı çekiyoruz ---
export const loader: LoaderFunction = async ({ request }) => {
  const sessionUser = await authenticator.isAuthenticated(request);
  if (!sessionUser) {
    return json({ user: null });
  }

  const res = await fetch(
    `${API_URL}/items/kullanicilar/${sessionUser.id}?fields=isim,email,role`,
    { headers }
  );
  if (!res.ok) {
    console.error("Kullanıcı çekme hatası:", await res.text());
    return json({ user: null });
  }

  const { data } = await res.json();
  return json({
    user: {
      isim:  data.isim  || "",
      email: data.email || "",
      role:  data.role  || "",  // "Öğrenci" | "Öğretmen" | "Ebeveyn"
    },
  });
};

// --- Action: öneriyi kaydet + (opsiyonel) kullanıcı rolünü güncelle ---
export const action: ActionFunction = async ({ request }) => {
  const form    = await request.formData();
  const name    = form.get("name");
  const email   = form.get("email");
  const role    = form.get("role");
  const message = form.get("message");

  const allowed = ["Öğrenci", "Öğretmen", "Ebeveyn"];
  if (typeof role !== "string" || !allowed.includes(role)) {
    return json({ error: "Lütfen Öğrenci, Öğretmen veya Ebeveyn seçin." }, { status: 400 });
  }
  if (typeof message !== "string" || !message.trim()) {
    return json({ error: "Mesajınız boş olamaz." }, { status: 400 });
  }

  // 1) Öneriyi kaydet
  const payload: Record<string, any> = {
    role,            // "Öğrenci"/"Öğretmen"/"Ebeveyn"
    mesaj: message.trim(),
  };
  if (typeof name  === "string" && name.trim())  payload.isim  = name.trim();
  if (typeof email === "string" && email.trim()) payload.email = email.trim();

  try {
    await addItem("oneri", payload);
  } catch (error) {
    return json({ error: (error as Error).message }, { status: 500 });
  }

  // 2) Eğer giriş yapılmışsa, kullanıcının kendi kaydındaki rolünü güncelle
  const sessionUser = await authenticator.isAuthenticated(request);
  if (sessionUser) {
    try {
      const patchRes = await fetch(
        `${API_URL}/items/kullanicilar/${sessionUser.id}`,
        {
          method: "PATCH",
          headers,
          body: JSON.stringify({ role }),
        }
      );
      if (!patchRes.ok) {
        console.error("Rol güncelleme hatası:", await patchRes.text());
      }
    } catch (err) {
      console.error("Rol güncelleme isteği hata:", err);
    }
  }

  return json({ success: true });
};

// --- React component ---
export default function MesajSayfasi() {
  const { user }   = useLoaderData<{
    user: { isim: string; email: string; role: string } | null;
  }>();
  const actionData = useActionData<{ success?: boolean; error?: string }>();
  const [showModal, setShowModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>(user?.role || "");

  // Loader'dan gelen role'u state'e aktar
  useEffect(() => {
    if (user?.role) setSelectedRole(user.role);
  }, [user]);

  // Başarılı gönderimde modal aç
  useEffect(() => {
    if (actionData?.success) setShowModal(true);
  }, [actionData]);

  // Scrollbar gizleme
  useEffect(() => {
    const style = document.createElement("style");
    style.id = "hide-scrollbar";
    style.innerHTML = `
      .no-scrollbar::-webkit-scrollbar { display: none; }
      .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    `;
    document.head.appendChild(style);
    return () => document.getElementById("hide-scrollbar")?.remove();
  }, []);

  // 5 mesaj limiti
  const handleSubmit = (e: React.FormEvent) => {
    const today  = new Date().toISOString().slice(0, 10);
    const stored = JSON.parse(localStorage.getItem("oneriCount") || "{}");
    let { date, count } = stored || {};
    if (date !== today) {
      date = today; count = 0;
    }
    if ((count || 0) >= 5) {
      e.preventDefault();
      alert("Bugün en fazla 5 kez mesaj gönderebilirsiniz.");
      return;
    }
    localStorage.setItem(
      "oneriCount",
      JSON.stringify({ date, count: (count || 0) + 1 })
    );
  };

  // Modal kapatma
  const closeModal = () => {
    setShowModal(false);
    window.location.reload();
  };

  const roles = [
    { value: "Öğrenci",  label: "Öğrenci" },
    { value: "Öğretmen", label: "Öğretmen" },
    { value: "Ebeveyn",  label: "Ebeveyn" },
  ];

  return (
    <div className="relative overflow-auto no-scrollbar bg-gradient-to-br from-indigo-100 to-blue-100 flex items-start justify-center min-h-screen pt-16 px-4">
      {/* Arka plan blob’ları */}
      <div className="absolute -top-16 -left-16 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
      <div className="absolute -bottom-16 -right-16 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />

      <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 lg:p-12">
        <div className="flex justify-center">
          <div className="p-3 bg-indigo-100 rounded-full animate-pulse">
            <Atom className="h-8 w-8 text-indigo-600" />
          </div>
        </div>
        <h1 className="mt-4 text-center text-3xl font-extrabold text-gray-900">
          Öneri & Geri Bildirim
        </h1>
        <p className="mt-2 text-center text-gray-600">
          Fikirlerinizi paylaşarak bize ilham verin!
        </p>

        <Form method="post" onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Rol seçimi */}
          <fieldset className="space-y-2">
            <legend className="text-sm font-medium text-gray-700">
              Sizi en iyi hangisi tanımlıyor?
            </legend>
            <div className="flex flex-wrap gap-2 justify-center mt-2">
              {roles.map(({ value, label }) => (
                <label key={value} className="cursor-pointer relative">
                  <input
                    type="radio"
                    name="role"
                    value={value}
                    className="sr-only peer"
                    required
                    checked={selectedRole === value}
                    onChange={() => setSelectedRole(value)}
                  />
                  <span className="inline-block px-3 py-1 sm:px-5 sm:py-2 text-sm sm:text-base rounded-full border-2 border-indigo-300 text-indigo-600 font-medium peer-checked:bg-indigo-600 peer-checked:text-white transition">
                    {label}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          {/* İsim & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <label htmlFor="name" className="sr-only">İsim</label>
              <IconUser className="absolute left-3 top-3 h-5 w-5 text-indigo-400" />
              <input
                type="text"
                name="name"
                id="name"
                placeholder="İsminiz (İsteğe bağlı)"
                defaultValue={user?.isim || ""}
                className="pl-10 w-full p-3 border-2 border-indigo-300 bg-indigo-50 text-gray-900 rounded-2xl shadow-inner focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
            <div className="relative">
              <label htmlFor="email" className="sr-only">Mailiniz</label>
              <IconMail className="absolute left-3 top-3 h-5 w-5 text-indigo-400" />
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Email (İsteğe bağlı"
                defaultValue={user?.email || ""}
                className="pl-10 w-full p-3 border-2 border-indigo-300 bg-indigo-50 text-gray-900 rounded-2xl shadow-inner focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
          </div>

          {/* Mesaj */}
          <div className="relative">
            <label htmlFor="message" className="sr-only">Mesajınız</label>
            <MessageCircle className="absolute left-3 top-3 h-5 w-5 text-indigo-400" />
            <textarea
              name="message"
              id="message"
              rows={4}
              placeholder="Mesajınızı buraya yazın..."
              className="pl-10 pt-3 w-full p-3 border-2 border-indigo-300 bg-indigo-50 text-gray-900 rounded-2xl shadow-inner focus:outline-none focus:border-indigo-500 transition resize-none"
              required
            />
          </div>

          {/* Gönder */}
          <button
            type="submit"
            className="w-full flex justify-center items-center space-x-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-2xl shadow-lg transform hover:scale-105 transition"
          >
            <Atom className="h-5 w-5 animate-bounce" />
            <span>Gönder ve Destek Ol</span>
          </button>
        </Form>

        {actionData?.error && (
          <p className="mt-4 text-center text-red-600">{actionData.error}</p>
        )}
      </div>

      {/* Başarı modalı */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-auto no-scrollbar">
          <div className="bg-white rounded-xl shadow-xl p-8 max-w-xs w-full max-h-full overflow-y-auto text-center relative">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              <X className="h-5 w-5" />
            </button>
            <Atom className="mx-auto h-10 w-10 text-indigo-600 animate-pulse" />
            <h2 className="mt-4 text-xl font-bold text-gray-900">
              Çok Teşekkürler!
            </h2>
            <p className="mt-2 text-gray-700">Geri bildiriminiz alındı.</p>
            <button
              onClick={closeModal}
              className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
            >
              Kapat
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
