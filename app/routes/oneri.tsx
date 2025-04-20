// app/routes/oneri.tsx
import type { ActionFunction, MetaFunction, LinksFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import React, { useEffect, useState } from "react";
import { Form, useActionData } from "@remix-run/react";
import { Atom, User, Mail, MessageCircle, X } from "lucide-react";
import { addItem } from "~/utils/directusClient";

// Sayfa meta bilgileri
export const meta: MetaFunction = () => [
  { title: "Öneri & Geri Bildirim" },
  { name: "description", content: "Platformumuzu geliştirmek için önerilerinizi paylaşın." },
];

// SEO için canonical link
export const links: LinksFunction = () => [
  { rel: "canonical", href: "https://www.fizikfinito.com/oneri" },
];

// Action: Form gönderildiğinde yeni öneri oluşturup Directus'a kaydet
export const action: ActionFunction = async ({ request }) => {
  try {
    const form = await request.formData();
    const name = form.get("name");
    const email = form.get("email");
    const role = form.get("role");
    const message = form.get("message");

    if (typeof role !== "string" || !role) {
      return json({ error: "Lütfen bir rol seçin." }, { status: 400 });
    }
    if (typeof message !== "string" || !message.trim()) {
      return json({ error: "Mesajınız boş olamaz." }, { status: 400 });
    }

    const payload: Record<string, any> = { rol: role, mesaj: message.trim() };
    if (typeof name === "string" && name.trim()) payload.isim = name.trim();
    if (typeof email === "string" && email.trim()) payload.email = email.trim();

    await addItem("oneri", payload);
    return json({ success: true });
  } catch (error) {
    return json({ error: (error as Error).message }, { status: 500 });
  }
};

// React bileşeni: Güzel bir modal popup ve spam önleme
export default function MesajSayfasi() {
  const actionData = useActionData();
  const [showModal, setShowModal] = useState(false);

  // Modal açma on success
  useEffect(() => {
    if (actionData?.success) {
      setShowModal(true);
    }
  }, [actionData]);

  // Gönderim öncesi kontrol: günlük 5 gönderim
  const handleSubmit = (e: React.FormEvent) => {
    const today = new Date().toISOString().slice(0, 10);
    const stored = JSON.parse(localStorage.getItem("oneriCount") || "{}");
    let { date, count } = stored || {};
    if (date !== today) {
      date = today;
      count = 0;
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

  const closeModal = () => {
    setShowModal(false);
    window.location.reload();
  };

  const roles = [
    { value: 'ogrenci', label: 'Öğrenci' },
    { value: 'ogretmen', label: 'Öğretmen' },
    { value: 'ebeveyn', label: 'Ebeveyn' },
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-100 to-blue-100 flex items-start justify-center h-screen pt-16 px-4">
      {/* Arka plan dekoratif şekiller */}
      <div className="absolute -top-16 -left-16 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute -bottom-16 -right-16 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 lg:p-12">
        <div className="flex justify-center">
          <div className="p-3 bg-indigo-100 rounded-full animate-pulse">
            <Atom className="h-8 w-8 text-indigo-600" />
          </div>
        </div>
        <h1 className="mt-4 text-center text-3xl font-extrabold text-gray-900">Öneri & Geri Bildirim</h1>
        <p className="mt-2 text-center text-gray-600">Fikirlerinizi paylaşarak bize ilham verin!</p>

        <Form method="post" onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Rol seçim butonları */}
          <fieldset className="space-y-2">
            <legend className="text-sm font-medium text-gray-700">Rolünüz <span className="text-red-500">*</span></legend>
            <div className="flex space-x-4 justify-center mt-2">
              {roles.map(({ value, label }) => (
                <label key={value} className="cursor-pointer relative">
                  <input
                    type="radio"
                    name="role"
                    value={value}
                    defaultChecked={value === 'ogrenci'}
                    className="sr-only peer"
                    required
                  />
                  <span className="inline-block px-5 py-2 rounded-full border-2 border-indigo-300 text-indigo-600 font-medium peer-checked:bg-indigo-600 peer-checked:text-white transition">
                    {label}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          {/* İsim ve E-posta */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <label htmlFor="name" className="sr-only">Adınız</label>
              <User className="absolute left-3 top-3 h-5 w-5 text-indigo-400" />
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Adınız (isteğe bağlı)"
                className="pl-10 w-full p-3 border-2 border-indigo-300 bg-indigo-50 text-gray-900 rounded-2xl shadow-inner focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
            <div className="relative">
              <label htmlFor="email" className="sr-only">Mailiniz</label>
              <Mail className="absolute left-3 top-3 h-5 w-5 text-indigo-400" />
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Email (isteğe bağlı)"
                className="pl-10 w-full p-3 border-2 border-indigo-300 bg-indigo-50 text-gray-900 rounded-2xl shadow-inner focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
          </div>

          {/* Mesaj alanı */}
          <div className="relative">
            <label htmlFor="message" className="sr-only">Mesajınız</label>
            <MessageCircle className="absolute left-3 top-3 h-5 w-5 text-indigo-400" />
            <textarea
              name="message"
              id="message"
              rows={4}
              placeholder="Mesajınızı buraya yazın..."
              className="pl-10 pt-3 w-full p-3	border-2 border-indigo-300 bg-indigo-50 text-gray-900 rounded-2xl shadow-inner focus:outline-none focus:border-indigo-500 transition resize-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center items-center space-x-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-2xl shadow-lg transform hover:scale-105 transition"
          >
            <Atom className="h-5 w-5 animate-bounce" />
            <span>Gönder ve Destek Ol</span>
          </button>
        </Form>

        {actionData?.error && <p className="mt-4 text-center text-red-600">{actionData.error}</p>}
      </div>

      {/* Modal Popup */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl p-8 max-w-xs text-center relative">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              <X className="h-5 w-5" />
            </button>
            <Atom className="mx-auto h-10 w-10 text-indigo-600 animate-pulse" />
            <h2 className="mt-4 text-xl font-bold text-gray-900">Teşekkürler!</h2>
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