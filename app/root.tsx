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
            <div className="container mx-auto flex items-center justify-between">
              <Link to="/" className="flex items-center">
                <img
                  src="https://cdn.zeduva.com/2024/12/fizikfinitologo.png"
                  alt="Fizikfinito Logo"
                  className="h-10 w-10 rounded-full"
                />
                <span className="text-gray-900 text-2xl font-bold ml-4">Fizikfinito</span>
              </Link>
              <button className="md:hidden text-gray-900 focus:outline-none transition-transform duration-500 ease-in-out" onClick={() => {
                const menu = document.getElementById('mobile-menu');
                const overlay = document.getElementById('menu-overlay');
                if (menu.classList.contains('-translate-x-full')) {
                  menu.classList.remove('-translate-x-full');
                  overlay.classList.remove('hidden');
                } else {
                  menu.classList.add('-translate-x-full');
                  overlay.classList.add('hidden');
                }
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </button>
              <ul id="mobile-menu" className="transform transition-transform duration-500 ease-in-out -translate-x-full fixed inset-0 bg-white p-8 z-50 space-y-4 text-lg font-medium md:hidden">
                <li>
                  <Link to="/" className="text-gray-700 hover:text-blue-600 transition duration-300 ease-in-out" onClick={() => {
                    document.getElementById('mobile-menu').classList.add('-translate-x-full');
                    document.getElementById('menu-overlay').classList.add('hidden');
                  }}>
                    Ana Sayfa
                  </Link>
                </li>
                <li>
                  <Link to="/takvim" className="text-gray-700 hover:text-blue-600 transition duration-300 ease-in-out" onClick={() => {
                    document.getElementById('mobile-menu').classList.add('-translate-x-full');
                    document.getElementById('menu-overlay').classList.add('hidden');
                  }}>
                    Takvim
                  </Link>
                </li>
                <li>
                  <Link to="/kitaplarimiz" className="text-gray-700 hover:text-blue-600 transition duration-300 ease-in-out" onClick={() => {
                    document.getElementById('mobile-menu').classList.add('-translate-x-full');
                    document.getElementById('menu-overlay').classList.add('hidden');
                  }}>
                    Tüm Kitaplarımız
                  </Link>
                </li>
                <li>
                  <Link to="/yks-sayaci" className="text-gray-700 hover:text-blue-600 transition duration-300 ease-in-out" onClick={() => {
                    document.getElementById('mobile-menu').classList.add('-translate-x-full');
                    document.getElementById('menu-overlay').classList.add('hidden');
                  }}>
                    Tüm Kitaplarımız
                  </Link>
                </li>
                <li>
                  <button className="text-gray-900 focus:outline-none" onClick={() => {
                    const menu = document.getElementById('mobile-menu');
                    const overlay = document.getElementById('menu-overlay');
                    menu.classList.add('-translate-x-full');
                    overlay.classList.add('hidden');
                  }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </li>
              </ul>
              <ul className="hidden md:flex space-x-8 text-lg font-medium">
                <li>
                  <Link to="/" className="text-gray-700 hover:text-blue-600 transition duration-300 ease-in-out">
                    Ana Sayfa
                  </Link>
                </li>
                <li>
                  <Link to="/takvim" className="text-gray-700 hover:text-blue-600 transition duration-300 ease-in-out">
                    Takvim
                  </Link>
                </li>
                <li>
                  <Link to="/kitaplarimiz" className="text-gray-700 hover:text-blue-600 transition duration-300 ease-in-out">
                    Tüm Kitaplarımız
                  </Link>
                </li>
                <li>
                  <Link to="/yks-sayaci" className="text-gray-700 hover:text-blue-600 transition duration-300 ease-in-out">
                    YKS Sayacı
                  </Link>
                </li>
              </ul>
              <div className="flex items-center space-x-4">
                {user ? (
                  <Link to="/profile" className="text-gray-900 text-lg font-semibold hover:text-blue-600 transition duration-300 ease-in-out">
                    <span className='whitespace-nowrap text-sm'>Hoşgeldin, {user.displayName.split(' ')[0]}</span>
                  </Link>
                ) : (
                  <Link
                    to="/google"
                    className="flex items-center bg-blue-600 text-white px-2 py-1 rounded-lg font-bold text-sm transition duration-300 ease-in-out hover:bg-blue-700"
                  >
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/2504/2504914.png"
                      alt="Google ile Giriş Yap"
                      className="h-4 w-4 mr-1"
                    />
                    Giriş Yap
                  </Link>
                )}
              </div>
            </div>
          </nav>
          <div id="menu-overlay" className="fixed inset-0 bg-black bg-opacity-50 hidden z-40 md:hidden" onClick={() => {
            const menu = document.getElementById('mobile-menu');
            const overlay = document.getElementById('menu-overlay');
            menu.classList.add('-translate-x-full');
            overlay.classList.add('hidden');
          }}></div>
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
