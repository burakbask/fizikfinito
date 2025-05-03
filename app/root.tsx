import React, { useState, useEffect } from "react";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  Link,
  useLoaderData,
} from "@remix-run/react";
import type { LinksFunction, LoaderArgs } from "@remix-run/node";
import { authenticator } from "~/utils/auth.server";
import { parse } from "cookie";
import CookieConsent from "./components/CookieConsent";
import "./tailwind.css";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  { rel: "icon", type: "image/png", href: "https://cdn.zeduva.com/2024/12/fizikfinitologo.png" },
];

export const loader = async ({ request }: LoaderArgs) => {
  const user = await authenticator.isAuthenticated(request);
  const cookieHeader = request.headers.get("Cookie") || "";
  const cookies = parse(cookieHeader);
  const consent = cookies.cookieConsent;
  return { user, consent };
};

export default function Root() {
  const { user, consent } = useLoaderData<typeof loader>();
  const [mounted, setMounted] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("darkMode");
    if (stored === "false") {
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("darkMode", darkMode.toString());
      if (darkMode) document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");
    }
  }, [darkMode, mounted]);

  return (
    <html lang="en">
      <head>
        {consent === "accepted" && (
          <script async src="https://www.googletagmanager.com/gtag/js?id=UA-XXXXX-X" />
        )}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var darkMode = localStorage.getItem("darkMode");
                  if (darkMode === null || darkMode === "true") {
                    document.documentElement.classList.add("dark");
                  } else {
                    document.documentElement.classList.remove("dark");
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Fizikfinito - Fizik eğitim videoları, kitaplar ve daha fazlası ile fiziği eğlenceli hale getiriyoruz."
        />
        <meta
          name="keywords"
          content="Fizikfinito, fizik, eğitim, kitap, TYT, AYT"
        />
        <meta name="author" content="Fizikfinito" />
        <Meta />
        <Links />
      </head>
      <body className="flex flex-col min-h-screen bg-white dark:bg-gray-900 dark:text-white">
        <header>
          <nav className="bg-white dark:bg-gray-800 p-4 shadow-md">
            <div className="container mx-auto flex items-center justify-between flex-wrap">
              {/* Logo */}
              <Link to="/" prefetch="render" className="flex items-center mb-2 sm:mb-0">
                <img
                  src="https://cdn.zeduva.com/2024/12/fizikfinitologo.png"
                  alt="Fizikfinito Logo"
                  className="h-10 w-10 rounded-full"
                />
                <span className="text-gray-900 dark:text-white text-2xl font-bold ml-4">
                  Fizikfinito
                </span>
              </Link>

              {/* Ana Sayfa ve Öneri Linkleri */}
              <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-2 sm:mb-0">
                <Link
                  to="/"
                  prefetch="render"
                  className="px-3 sm:px-4 py-2 bg-blue-100 dark:bg-gray-700 text-gray-900 dark:text-white font-bold rounded-lg hover:bg-blue-200 dark:hover:bg-gray-600 transition text-sm sm:text-base"
                >
                  Ana Sayfa
                </Link>
                <Link
                  to="/oneri"
                  prefetch="intent"
                  className="px-3 sm:px-4 py-2 bg-blue-100 dark:bg-gray-700 text-gray-900 dark:text-white font-bold rounded-lg hover:bg-blue-200 dark:hover:bg-gray-600 transition text-sm sm:text-base"
                >
                  Öneriniz mi var?
                </Link>
              </div>

              {/* Giriş (Google) ve Dark Mode */}
              <div className="flex items-center space-x-2 mb-2 sm:mb-0">
                {user ? (
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-green-100 dark:bg-green-700 text-gray-900 dark:text-white font-medium rounded-lg hover:bg-green-200 dark:hover:bg-green-600 transition text-sm sm:text-base"
                  >
                    {user.image && (
                      <img
                        src={user.image}
                        alt={user.name || "Hesabım"}
                        className="h-6 w-6 rounded-full"
                      />
                    )}
                    <span>{user.name || "Hesabım"}</span>
                  </Link>
                ) : (
                  <Link
                    to="/google"
                    prefetch="intent"
                    className="px-3 sm:px-4 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition text-sm sm:text-base"
                  >
                    Google ile Giriş Yap
                  </Link>
                )}

                {mounted && (
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="focus:outline-none"
                  >
                    {darkMode ? (
                      <img
                        src="/light-mode.png"
                        alt="Light Mode"
                        className="h-6 w-6"
                      />
                    ) : (
                      <img
                        src="/dark-mode.png"
                        alt="Dark Mode"
                        className="h-6 w-6"
                      />
                    )}
                  </button>
                )}
              </div>
            </div>
          </nav>
        </header>

        <div className="flex flex-1">
          <aside className="md:fixed left-0 top-1/2 transform -translate-y-1/2 bg-transparent p-6 hidden md:block">
            <ul className="space-y-4">
              <li>
                <a
                  href="https://instagram.com/fizikfinito"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition duration-300 ease-in-out"
                >
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png"
                    alt="Instagram"
                    className="h-8 w-8"
                  />
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com/fizikfinito"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition duration-300 ease-in-out"
                >
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/5968/5968830.png"
                    alt="Twitter"
                    className="h-8 w-8"
                  />
                </a>
              </li>
              <li>
                <a
                  href="https://tiktok.com/@fizikfinito"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition duration-300 ease-in-out"
                >
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/2504/2504942.png"
                    alt="TikTok"
                    className="h-8 w-8"
                  />
                </a>
              </li>
            </ul>
          </aside>
          <main className="p-2 md:p-8 flex-1 w-full max-w-7xl mx-auto">
            <Outlet />
          </main>
        </div>

        <footer className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-6 text-center mt-auto w-full">
          <p>BETA versiyon ©2024 Fizikfinito - Tüm Hakları Saklıdır.</p>
        </footer>

        <CookieConsent />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
