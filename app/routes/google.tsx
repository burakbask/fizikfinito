// app/routes/google.tsx
import React from "react";
import type { LoaderFunction } from "@remix-run/node";
import { authenticator } from "~/utils/auth.server";

export let loader: LoaderFunction = async ({ request }) =>
  authenticator.authenticate("google", request, {
    successRedirect: "/profile",
    failureRedirect: "/login?error=oauth",
  });

export function ErrorBoundary({ error }: { error: Error }) {
  return <pre style={{ color: "red" }}>OAuth Hatası: {error.message}</pre>;
}

export default function GooglePage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold mb-6">Google ile Giriş Yapılıyor...</h1>
      <p className="text-gray-500">Lütfen bekleyin...</p>
    </div>
  );
}



