// app/routes/google/callback.tsx
import React from "react";
import type { LoaderFunction } from "@remix-run/node";
import { authenticator } from "~/utils/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  console.log("[callback] loader start");
  // Eğer bir hata varsa burada fırlayıp ErrorBoundary’e gider
  return authenticator.authenticate("google", request, {
    successRedirect: "/profile",
    failureRedirect: "/login?error=oauth",
    throwOnError: true,            // Hata varsa exception at
  });
};

export default function GoogleCallbackPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold mb-4">
        Google kimlik doğrulamanız işleniyor...
      </h1>
      <p className="text-gray-500">Lütfen bekleyin...</p>
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <div className="p-4 bg-red-100 text-red-800">
      <h2 className="font-bold">Callback Hatası</h2>
      <pre>{error.message}</pre>
    </div>
  );
}
