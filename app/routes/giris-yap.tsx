// app/routes/login.tsx
import { Link } from "@remix-run/react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold mb-6">Giriş Yap</h1>
      <Link
        to="/google"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Google ile Giriş Yap
      </Link>
    </div>
  );
}
