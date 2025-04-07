// app/routes/mesaj.jsx
import { json } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";

export const action = async ({ request }) => {
  const formData = await request.formData();
  const userMessage = formData.get("message");

  // Mesajın doğruluğunu kontrol edebilir, temizleyebilirsiniz (validation)
  if (!userMessage || userMessage.trim() === "") {
    return json({ error: "Mesaj boş olamaz." }, { status: 400 });
  }

  try {
    // Directus API'ye mesaj gönderimi
    const response = await fetch("https://YOUR_DIRECTUS_INSTANCE_URL/items/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Gerekliyse Authorization header ekleyin
        "Authorization": "Bearer YOUR_API_TOKEN"
      },
      body: JSON.stringify({ message: userMessage }),
    });

    if (!response.ok) {
      throw new Error("Directus API isteği başarısız oldu.");
    }

    // İşlem başarılı ise kullanıcıya geri dönüş
    return json({ success: true });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
};

export default function MesajSayfasi() {
  const actionData = useActionData();

  return (
    <div>
      <h1>Mesaj Gönder</h1>
      <Form method="post">
        <textarea name="message" placeholder="Mesajınızı buraya yazın" rows="5" cols="40" />
        <br />
        <button type="submit">Gönder</button>
      </Form>
      {actionData?.success && (
        <p>Başarıyla gönderdiniz.</p>
      )}
      {actionData?.error && (
        <p style={{ color: "red" }}>{actionData.error}</p>
      )}
    </div>
  );
}
