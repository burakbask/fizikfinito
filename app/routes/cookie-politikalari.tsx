import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => [
  { title: "Çerez Politikaları – Fizikfinito" },
  {
    name: "description",
    content:
      "Fizikfinito’da kullandığımız çerezler ve amaçları hakkında detaylı bilgi edinin.",
  },
];

export default function CookiePolicies() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-4">Çerez Politikaları</h1>

      <p className="mb-6">
        Fizikfinito olarak kullanıcı deneyimini iyileştirmek, analiz yapmak ve temel
        işlevselliği sağlamak amacıyla çerezler kullanıyoruz. Aşağıda, sitemizde
        kullanılan çerezlerin adları, kategorileri, amaçları ve saklama süreleri
        hakkında detaylı bilgi bulabilirsiniz.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th className="text-left p-3 border-b">Çerez Adı</th>
              <th className="text-left p-3 border-b">Kategori</th>
              <th className="text-left p-3 border-b">Amaç</th>
              <th className="text-left p-3 border-b">Saklama Süresi</th>
              <th className="text-left p-3 border-b">Domain / Yol</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-3 border-b"><code>cookieConsent</code></td>
              <td className="p-3 border-b">Gerekli</td>
              <td className="p-3 border-b">Kullanıcının çerez tercihlerini saklar.</td>
              <td className="p-3 border-b">1 yıl</td>
              <td className="p-3 border-b">fizikfinito.com / <code>/</code></td>
            </tr>
            <tr className="bg-gray-50 dark:bg-gray-900">
              <td className="p-3 border-b"><code>__session</code></td>
              <td className="p-3 border-b">Gerekli</td>
              <td className="p-3 border-b">Oturum ve kimlik doğrulama bilgileri.</td>
              <td className="p-3 border-b">Oturum sonu</td>
              <td className="p-3 border-b">fizikfinito.com / <code>/</code></td>
            </tr>
            <tr>
              <td className="p-3 border-b"><code>_ga</code></td>
              <td className="p-3 border-b">Analitik</td>
              <td className="p-3 border-b">Google Analytics – kullanıcıları ayırt eder.</td>
              <td className="p-3 border-b">2 yıl</td>
              <td className="p-3 border-b">.fizikfinito.com / <code>/</code></td>
            </tr>
            <tr className="bg-gray-50 dark:bg-gray-900">
              <td className="p-3 border-b"><code>_gid</code></td>
              <td className="p-3 border-b">Analitik</td>
              <td className="p-3 border-b">Google Analytics – oturum içi kullanıcıları ayırt eder.</td>
              <td className="p-3 border-b">24 saat</td>
              <td className="p-3 border-b">.fizikfinito.com / <code>/</code></td>
            </tr>
            <tr>
              <td className="p-3 border-b"><code>_gat</code></td>
              <td className="p-3 border-b">Analitik</td>
              <td className="p-3 border-b">Google Analytics – istek hızını kontrol eder.</td>
              <td className="p-3 border-b">1 dakika</td>
              <td className="p-3 border-b">.fizikfinito.com / <code>/</code></td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="mt-8">
        Çerez tercihlerinizi dilediğiniz zaman tarayıcı ayarlarınızdan veya{" "}
        <Link to="/" className="text-blue-600 dark:text-blue-400 underline">
          ana sayfamızdan
        </Link>{" "}
        “Çerez Ayarları” bölümüne gelerek değiştirebilirsiniz.
      </p>
    </div>
  );
}
