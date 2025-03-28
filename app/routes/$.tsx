// app/routes/$.tsx
import type { LoaderFunction, MetaFunction, LinksFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import React, { useState, useEffect } from "react";
import { useLoaderData, useNavigate, useLocation } from "@remix-run/react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { getCollectionItems } from "~/utils/directusClient";

// Kategoriler koleksiyonundan gelen obje tipi
type Kategoriler = { 
  kategoriler: string; 
};

// Alt_Kategoriler koleksiyonundan gelen obje tipi
type Alt_Kategoriler = { 
  altkategoriler: string;
  kategori: string; 
};

// Konular koleksiyonundan gelen obje tipi
type Konular = { 
  konu_adi: string;
  altkategori_adi: string;
};

// Deneyler koleksiyonundan gelen obje tipi (yeni model)
type Deneyler = {
  deney_adi: string;
  deney_yazisi: string;
  materiyel_yazisi: string;
  video_url: string;
  konu_adi: string; // Hangi konuya ait olduğunu belirtir
  // kavram_yazisi: string; // Kaldırdık
};

type LoaderData = {
  kategoriler: Kategoriler[];
  altKategoriler: Alt_Kategoriler[];
  konular: Konular[];
  deneyler: Deneyler[];
};

export const loader: LoaderFunction = async () => {
  const kategorilerRes = await getCollectionItems("Kategoriler");
  const altKategorilerRes = await getCollectionItems("Alt_Kategoriler");
  const konularRes = await getCollectionItems("Konular");
  const deneylerRes = await getCollectionItems("Deneyler");

  const kategoriler = kategorilerRes.data || kategorilerRes;
  const altKategoriler = altKategorilerRes.data || altKategorilerRes;
  const konular = konularRes.data || konularRes;
  const deneyler = deneylerRes.data || deneylerRes;

  return json<LoaderData>({ kategoriler, altKategoriler, konular, deneyler });
};

export const meta: MetaFunction = () => {
  return [
    { title: "Deneyler & Kavramlar - Eğitim Platformu" },
    { name: "description", content: "Ortaokul ve lise öğrencilerine yönelik interaktif eğitim platformu: deneyler, kavramlar ve malzemelerle dolu içerikler." },
    { name: "keywords", content: "deneyler, kavramlar, malzemeler, eğitim, interaktif, ortaokul, lise, bilim, eğitim platformu" },
    { property: "og:title", content: "Deneyler & Kavramlar - Eğitim Platformu" },
    { property: "og:description", content: "Ortaokul ve lise öğrencilerine yönelik interaktif eğitim platformu: deneyler, kavramlar ve malzemelerle dolu içerikler." },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://www.fizikfinito.com" },
    { property: "og:image", content: "https://www.fizikfinito.com/images/og-image.jpg" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Deneyler & Kavramlar - Eğitim Platformu" },
    { name: "twitter:description", content: "Ortaokul ve lise öğrencilerine yönelik interaktif eğitim platformu: deneyler, kavramlar ve malzemelerle dolu içerikler." },
    { name: "twitter:image", content: "https://www.fizikfinito.com/images/twitter-image.jpg" },
  ];
};

export const links: LinksFunction = () => {
  return [
    { rel: "canonical", href: "https://www.fizikfinito.com" },
  ];
};

// İçerik tipi artık sadece "experiment" veya "materials"
type ContentType = "experiment" | "materials";

export default function ExperimentPage() {
  const { kategoriler, altKategoriler, konular, deneyler } = useLoaderData<LoaderData>();
  const navigate = useNavigate();
  const location = useLocation();

  // URL yolunu parçalayarak segmentleri elde edelim.
  // Beklenen sıralama: /[kategori]/[altKategori]/[konu]/[deney]
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const initialCategory = pathSegments[0]
    ? decodeURIComponent(pathSegments[0])
    : kategoriler.length > 0
    ? kategoriler[0].kategoriler
    : "";
  const initialAltKategoriSegment = pathSegments[1] ? decodeURIComponent(pathSegments[1]) : null;
  const initialKonu = pathSegments[2] ? decodeURIComponent(pathSegments[2]) : null;
  const initialDeney = pathSegments[3] ? decodeURIComponent(pathSegments[3]) : null;

  // Seçili kategori: URL’den gelen kategori varsa onu, yoksa ilk kategori.
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(initialCategory);

  // Seçili alt kategori: URL’deki segment ile eşleşen alt kategoriyi ara.
  const filteredAltKategoriler = altKategoriler.filter(
    (alt) => alt.kategori === selectedCategoryId
  );
  const defaultAltKategori = initialAltKategoriSegment
    ? altKategoriler.find(
        (ak) => ak.altkategoriler === initialAltKategoriSegment && ak.kategori === selectedCategoryId
      )
    : null;

  const [selectedAltKategori, setSelectedAltKategori] = useState<Alt_Kategoriler | null>(
    defaultAltKategori || (filteredAltKategoriler.length > 0 ? filteredAltKategoriler[0] : null)
  );

  // Seçili deney: URL’de konu ve deney varsa, deneyler arasından bul.
  let initialExperiment: Deneyler | null = null;
  if (initialKonu && initialDeney) {
    initialExperiment =
      deneyler.find(
        (exp) => exp.konu_adi === initialKonu && exp.deney_adi === initialDeney
      ) || null;
  }
  const [selectedExperiment, setSelectedExperiment] = useState<Deneyler | null>(initialExperiment);

  // İçerik tipi: "experiment" veya "materials" (kavram sekmesi kaldırıldı)
  const [contentType, setContentType] = useState<ContentType>("experiment");
  const [categoryOpen, setCategoryOpen] = useState(true);
  const [readMore, setReadMore] = useState(false);

  // Kategori değiştiğinde sadece eğer mevcut alt kategori bu kategoriye ait değilse sıfırla.
  useEffect(() => {
    const relatedAltKategoriler = altKategoriler.filter(
      (alt) => alt.kategori === selectedCategoryId
    );
    if (
      !selectedAltKategori ||
      !relatedAltKategoriler.some(
        (alt) => alt.altkategoriler === selectedAltKategori.altkategoriler
      )
    ) {
      setSelectedAltKategori(relatedAltKategoriler[0] || null);
      setSelectedExperiment(null);
    }
  }, [selectedCategoryId, altKategoriler, selectedAltKategori]);

  // URL’i güncelleyelim (geçerli state’lere göre) ama gereksiz navigasyonu önleyelim.
  useEffect(() => {
    let newPath = "/";
    if (selectedCategoryId) {
      newPath += `${encodeURIComponent(selectedCategoryId)}`;
    }
    if (selectedAltKategori) {
      newPath += `/${encodeURIComponent(selectedAltKategori.altkategoriler)}`;
    }
    if (selectedExperiment) {
      newPath += `/${encodeURIComponent(selectedExperiment.konu_adi)}`;
      newPath += `/${encodeURIComponent(selectedExperiment.deney_adi)}`;
    }
    if (newPath !== location.pathname) {
      navigate(newPath, { replace: true });
    }
  }, [selectedCategoryId, selectedAltKategori, selectedExperiment, navigate, location.pathname]);

  // İçeriğe ait metinleri seçelim.
  useEffect(() => {
    setReadMore(false);
  }, [contentType]);

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    // Otomatik kaydırma kaldırıldı, setTimeout + scrollIntoView yok.
    setCategoryOpen(!categoryOpen);
  };

  // İçerik metinlerini seçelim
  let fullText = "";
  if (selectedExperiment) {
    if (contentType === "experiment") {
      fullText = selectedExperiment.deney_yazisi;
    } else if (contentType === "materials") {
      fullText = selectedExperiment.materiyel_yazisi;
    }
    // Kavramla ilgili kısım silindi
    if (fullText.trim() === "?") {
      fullText = "Çok yakında eklenecektir. Lütfen beklemede kalın";
    }
  }
  const displayText =
    fullText.length > 250 && !readMore ? fullText.slice(0, 250) + "..." : fullText;

  // Video URL'sini embed için dönüştürelim.
  const embedVideoUrl =
    selectedExperiment?.video_url && selectedExperiment.video_url.trim() !== "?"
      ? selectedExperiment.video_url.replace("/shorts/", "/embed/")
      : null;

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Deneyler & Kavramlar - Eğitim Platformu",
            description:
              "Ortaokul ve lise öğrencilerine yönelik interaktif eğitim platformu: deneyler, kavramlar ve malzemelerle dolu içerikler.",
            url: "https://www.fizikfinito.com",
          }),
        }}
      />
      <div className="flex flex-col items-center text-gray-800 bg-white min-h-screen">
        {/* Kategori Seçimi */}
        <div className="p-4 md:p-8 bg-gray-100 shadow-md rounded-3xl w-full max-w-5xl text-center">
          <button
            onClick={() => handleCategoryClick(selectedCategoryId)}
            className="p-3 md:p-4 rounded-xl font-semibold transition-all duration-300 shadow-lg text-white bg-pink-500 hover:bg-pink-600 flex items-center justify-center w-full"
          >
            {selectedCategoryId || "Kategoriler"}{" "}
            {categoryOpen ? <FaChevronUp className="ml-2" /> : <FaChevronDown className="ml-2" />}
          </button>
          {categoryOpen && (
            <div className="flex flex-wrap justify-center gap-2 md:gap-4 mt-4">
              {kategoriler.map((kategori) => (
                <button
                  key={kategori.kategoriler}
                  onClick={() => handleCategoryClick(kategori.kategoriler)}
                  className={`p-3 md:p-4 rounded-xl font-semibold transition-all duration-300 shadow-lg text-white ${
                    selectedCategoryId === kategori.kategoriler
                      ? "bg-pink-600 scale-110"
                      : "bg-pink-500 hover:bg-pink-600"
                  }`}
                >
                  {kategori.kategoriler}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Alt Kategori Seçimi */}
        {selectedCategoryId && (
          <div className="p-4 md:p-6 bg-gray-50 shadow-md rounded-3xl w-full max-w-5xl mt-4 md:mt-6">
            {filteredAltKategoriler.length > 0 ? (
              <div className="flex flex-wrap justify-center gap-2 md:gap-4">
                {filteredAltKategoriler.map((altKategori) => (
                  <button
                    key={altKategori.altkategoriler}
                    onClick={() => {
                      setSelectedAltKategori(altKategori);
                      setSelectedExperiment(null);
                    }}
                    className={`p-3 md:p-4 rounded-xl font-semibold transition-all duration-300 shadow-lg text-white ${
                      selectedAltKategori &&
                      selectedAltKategori.altkategoriler === altKategori.altkategoriler
                        ? "bg-orange-600 scale-110"
                        : "bg-orange-500 hover:bg-orange-600"
                    }`}
                  >
                    {altKategori.altkategoriler}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-600">Alt kategori bulunamadı.</p>
            )}
          </div>
        )}

        {/* Konular ve Deneyler */}
        {selectedAltKategori && (() => {
          const filteredTopics = konular.filter(
            (topic) => topic.altkategori_adi === selectedAltKategori.altkategoriler
          );
          if (filteredTopics.length === 0) {
            return (
              <div className="p-4 md:p-6 bg-white shadow-md rounded-3xl w-full max-w-5xl mt-4 md:mt-6">
                <p className="text-center text-gray-600">
                  Seçilen alt kategori ile ilgili konu bulunamadı.
                </p>
              </div>
            );
          }
          return (
            <div className="p-4 md:p-6 bg-white shadow-md rounded-3xl w-full max-w-5xl mt-4 md:mt-6 overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 text-center rounded-xl overflow-hidden text-gray-800 text-xs md:text-base">
                <tbody>
                  {filteredTopics.map((topic) => {
                    const topicDeneyler = deneyler.filter(
                      (deney) => deney.konu_adi === topic.konu_adi
                    );
                    return (
                      <React.Fragment key={topic.konu_adi}>
                        <tr className="bg-gray-100 hover:bg-gray-200 transition-all shadow-md rounded-lg overflow-hidden">
                          <td className="border border-gray-300 p-3 md:p-5 font-bold text-sm md:text-xl text-white bg-gradient-to-r from-pink-500 to-pink-400 shadow-md w-1/3 md:w-auto rounded-l-lg">
                            {topic.konu_adi}
                          </td>
                          <td className="border border-gray-300 p-2 md:p-3">
                            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                              {topicDeneyler.map((deney) => (
                                <button
                                  key={deney.deney_adi}
                                  onClick={() =>
                                    setSelectedExperiment(
                                      selectedExperiment?.deney_adi === deney.deney_adi ? null : deney
                                    )
                                  }
                                  className={`p-2 md:p-3 rounded-xl font-semibold transition-all duration-300 shadow-lg text-white ${
                                    selectedExperiment?.deney_adi === deney.deney_adi
                                      ? "bg-purple-600 scale-110"
                                      : "bg-purple-500 hover:bg-purple-600"
                                  }`}
                                >
                                  {deney.deney_adi}
                                </button>
                              ))}
                            </div>
                          </td>
                        </tr>
                        {selectedExperiment &&
                          topicDeneyler.some(
                            (deney) => deney.deney_adi === selectedExperiment.deney_adi
                          ) && (
                            <tr>
                              <td colSpan={2}>
                                <div className="p-6 bg-gray-50 shadow-md rounded-3xl w-full max-w-4xl mx-auto">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="p-4 border rounded-3xl bg-gray-100 shadow-lg text-gray-800">
                                      <div className="flex flex-wrap gap-4 mt-4 justify-center">
                                        {/* "Kavram" butonu kaldırıldı */}
                                        <button
                                          onClick={() => setContentType("experiment")}
                                          className={`p-3 rounded-lg text-white ${
                                            contentType === "experiment"
                                              ? "bg-red-600 scale-105"
                                              : "bg-red-500 hover:bg-red-600"
                                          }`}
                                        >
                                          Deney
                                        </button>
                                        <button
                                          onClick={() => setContentType("materials")}
                                          className={`p-3 rounded-lg text-white ${
                                            contentType === "materials"
                                              ? "bg-indigo-600 scale-105"
                                              : "bg-indigo-500 hover:bg-indigo-600"
                                          }`}
                                        >
                                          Malzemeler
                                        </button>
                                      </div>
                                      <p className="mt-4 text-gray-700 font-semibold text-lg text-center">
                                        {displayText || "İçerik bulunamadı."}
                                      </p>
                                      {fullText.length > 250 && (
                                        <button
                                          onClick={() => setReadMore(!readMore)}
                                          className="mt-2 text-pink-500 font-semibold"
                                        >
                                          {readMore ? "Kapat" : "Devamını Oku"}
                                        </button>
                                      )}
                                    </div>
                                    <div className="flex justify-center w-full md:w-auto">
                                      {embedVideoUrl ? (
                                        <iframe
                                          className="w-[360px] h-[640px] border rounded-3xl shadow-lg"
                                          src={embedVideoUrl}
                                          title="Deney Videosu"
                                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                          allowFullScreen
                                        ></iframe>
                                      ) : (
                                        <div className="w-[360px] h-[640px] border rounded-3xl shadow-lg flex items-center justify-center bg-gray-100 text-center p-4">
                                          <p className="text-gray-700 font-semibold">
                                            Çok yakında eklenecektir. Lütfen beklemede kalın
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        })()}
      </div>
    </>
  );
}
