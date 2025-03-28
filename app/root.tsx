//root.tsx
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  Link,
  useLoaderData
} from "@remix-run/react";
import type { LinksFunction, LoaderArgs } from "@remix-run/node";
import { authenticator } from "~/utils/auth.server"; // aaaGoogle OAuth için ekleme

import "./tailwind.css";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  {
    rel: "icon",
    type: "image/png",
    href: "https://cdn.zeduva.com/2024/12/fizikfinitologo.png",
  },
];

export const loader = async ({ request }: LoaderArgs) => {
  let user = await authenticator.isAuthenticated(request);
  return { user };
};

export default function Root() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Fizikfinito - Fizik eğitim videoları, kitaplar ve daha fazlası ile fiziği eğlenceli hale getiriyoruz. Fizik derslerini keşfedin ve öğrenmenin keyfini çıkarın." />
        <meta name="keywords" content="Fizikfinito, fizik, fizik eğitimi, fizik kitapları, TYT, AYT, lise fiziği, üniversite sınavı, bilim, fizik dersleri" />
        <meta name="author" content="Fizikfinito" />
        <Meta />
        <Links />
      </head>
      <body className="flex flex-col min-h-screen bg-gray-100">
        <header>
          <nav className="bg-white p-4 shadow-md">
            <div className="container mx-auto flex items-center justify-center">
              <Link to="/" className="flex items-center">
                <img
                  src="https://cdn.zeduva.com/2024/12/fizikfinitologo.png"
                  alt="Fizikfinito Logo"
                  className="h-10 w-10 rounded-full"
                />
                <span className="text-gray-900 text-2xl font-bold ml-4">Fizikfinito</span>
              </Link>
            </div>
          </nav>
        </header>
        <div className="flex flex-1">
          <aside className="md:fixed left-0 top-1/2 transform -translate-y-1/2 bg-transparent p-6 hidden md:block">
            <div className="flex flex-col items-center">
              <ul className="space-y-4">
                <li>
                  <a href="https://instagram.com/fizikfinito" target="_blank" rel="noopener noreferrer" className="transition duration-300 ease-in-out">
                    <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" alt="Instagram Fizikfinito" className="h-8 w-8" />
                  </a>
                </li>
                <li>
                  <a href="https://twitter.com/fizikfinito" target="_blank" rel="noopener noreferrer" className="transition duration-300 ease-in-out">
                    <img src="https://cdn-icons-png.flaticon.com/512/5968/5968830.png" alt="Twitter Fizikfinito" className="h-8 w-8" />
                  </a>
                </li>
                <li>
                  <a href="https://tiktok.com/@fizikfinito" target="_blank" rel="noopener noreferrer" className="transition duration-300 ease-in-out">
                    <img src="https://cdn-icons-png.flaticon.com/512/2504/2504942.png" alt="TikTok Fizikfinito" className="h-8 w-8" />
                  </a>
                </li>
              </ul>
            </div>
          </aside>
          <main className="p-2 md:p-8 flex-1 w-full max-w-7xl mx-auto">

            <Outlet />
          </main>
        </div>
        <footer className="bg-gray-900 text-white p-6 text-center mt-auto w-full">
          <p>BETA versiyon &copy;2024 Fizikfinito - Tüm Hakları Saklıdır. Görüş ve tavsiyeleriniz için: fizikfinito@zeduva.com</p>
        </footer>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
