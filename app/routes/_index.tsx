// app/routes/$.tsx
import type { LoaderFunction, MetaFunction, LinksFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import React, { useState, useEffect, useRef } from "react";
import { useLoaderData, useLocation } from "@remix-run/react";
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
  konu_adi: string;
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
    {
      name: "description",
      content:
        "Ortaokul ve lise öğrencilerine yönelik interaktif eğitim platformu: deneyler, kavramlar ve malzemelerle dolu içerikler.",
    },
    {
      name: "keywords",
      content:
        "deneyler, kavramlar, malzemeler, eğitim, interaktif, ortaokul, lise, bilim, eğitim platformu",
    },
    { property: "og:title", content: "Deneyler & Kavramlar - Eğitim Platformu" },
    {
      property: "og:description",
      content:
        "Ortaokul ve lise öğrencilerine yönelik interaktif eğitim platformu: deneyler, kavramlar ve malzemelerle dolu içerikler.",
    },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://www.fizikfinito.com" },
    { property: "og:image", content: "https://www.fizikfinito.com/images/og-image.jpg" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Deneyler & Kavramlar - Eğitim Platformu" },
    {
      name: "twitter:description",
      content:
        "Ortaokul ve lise öğrencilerine yönelik interaktif eğitim platformu: deneyler, kavramlar ve malzemelerle dolu içerikler.",
    },
    { name: "twitter:image", content: "https://www.fizikfinito.com/images/twitter-image.jpg" },
  ];
};

export const links: LinksFunction = () => {
  return [{ rel: "canonical", href: "https://www.fizikfinito.com" }];
};

// İçerik tipi: "experiment" veya "materials"
type ContentType = "experiment" | "materials";

// Boşlukları tireye çeviren basit slugify fonksiyonu
const slugify = (text: string) => {
  return text.trim().replace(/\s+/g, "-");
};

export default function ExperimentPage() {
  const { kategoriler, altKategoriler, konular, deneyler } = useLoaderData<LoaderData>();
  const location = useLocation();

  // Bölüm referansları
  const altCategoriesRef = useRef<HTMLDivElement>(null);
  const topicsRef = useRef<HTMLDivElement>(null);
  const experimentDetailsRef = useRef<HTMLDivElement>(null);

  // URL yolundaki segmentler (URL başlangıçta okunuyor):
  // Beklenen: /[kategori]/[altKategori]/[konu]/[deney]
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const initialCategory = pathSegments[0]
    ? decodeURIComponent(pathSegments[0])
    : kategoriler.length > 0
    ? kategoriler[0].kategoriler
    : "";
  const initialAltKategoriSegment = pathSegments[1] ? decodeURIComponent(pathSegments[1]) : null;
  const initialKonu = pathSegments[2] ? decodeURIComponent(pathSegments[2]) : null;
  const initialDeney = pathSegments[3] ? decodeURIComponent(pathSegments[3]) : null;

  // Seçili kategori
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(initialCategory);

  // Seçili alt kategori
  const filteredAltKategoriler = altKategoriler.filter(
    (alt) => alt.kategori === selectedCategoryId
  );
  const defaultAltKategori = initialAltKategoriSegment
    ? altKategoriler.find(
        (ak) =>
          ak.altkategoriler === initialAltKategoriSegment &&
          ak.kategori === selectedCategoryId
      )
    : null;
  const [selectedAltKategori, setSelectedAltKategori] = useState<Alt_Kategoriler | null>(
    defaultAltKategori || (filteredAltKategoriler.length > 0 ? filteredAltKategoriler[0] : null)
  );

  // Seçili deney
  let initialExperiment: Deneyler | null = null;
  if (initialKonu && initialDeney) {
    initialExperiment =
      deneyler.find(
        (exp) => exp.konu_adi === initialKonu && exp.deney_adi === initialDeney
      ) || null;
  }
  const [selectedExperiment, setSelectedExperiment] = useState<Deneyler | null>(initialExperiment);

  // İçerik tipi
  const [contentType, setContentType] = useState<ContentType>("experiment");
  const [readMore, setReadMore] = useState(false);

  // Kategori değiştiğinde, ilgili alt kategoriyi sıfırlayalım.
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

  // Seçimler state üzerinde güncellendiğinde URL'i pushState ile güncelleyelim.
  useEffect(() => {
    let newPath = "/";
    if (selectedCategoryId) {
      newPath += `${slugify(selectedCategoryId)}`;
    }
    if (selectedAltKategori) {
      newPath += `/${slugify(selectedAltKategori.altkategoriler)}`;
    }
    if (selectedExperiment) {
      newPath += `/${slugify(selectedExperiment.konu_adi)}`;
      newPath += `/${slugify(selectedExperiment.deney_adi)}`;
    }
    if (newPath !== location.pathname) {
      window.history.pushState(null, "", newPath);
    }
  }, [selectedCategoryId, selectedAltKategori, selectedExperiment, location.pathname]);

  // İçerik değişince "readMore" durumunu sıfırlayalım.
  useEffect(() => {
    setReadMore(false);
  }, [contentType]);

  // Seçimlere bağlı olarak ilgili bölümlere scroll yapalım.
  useEffect(() => {
    if (altCategoriesRef.current) {
      altCategoriesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedCategoryId]);

  useEffect(() => {
    if (selectedAltKategori && topicsRef.current) {
      topicsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedAltKategori]);

  useEffect(() => {
    if (selectedExperiment && experimentDetailsRef.current) {
      experimentDetailsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedExperiment]);

  // Butonlarda event.preventDefault() ve type="button" kullanıyoruz.
  const handleCategoryClick = (event: React.MouseEvent<HTMLButtonElement>, categoryId: string) => {
    event.preventDefault();
    setSelectedCategoryId(categoryId);
  };

  let fullText = "";
  if (selectedExperiment) {
    fullText =
      contentType === "experiment"
        ? selectedExperiment.deney_yazisi
        : selectedExperiment.materiyel_yazisi;
    if (fullText.trim() === "?") {
      fullText = "Çok yakında eklenecektir. Lütfen beklemede kalın";
    }
  }
  const displayText =
    fullText.length > 250 && !readMore ? fullText.slice(0, 250) + "..." : fullText;
  const materialsDisplayText =
    fullText.length > 250 && !readMore ? fullText.slice(0, 250) : fullText;

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
      <div className="flex flex-col items-center text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-950 min-h-screen">
        {/* Ana Kategori (Turuncu) */}
        <div className="p-4 md:p-8 bg-gray-100 dark:bg-gray-800 shadow-sm rounded-3xl w-full max-w-5xl text-center">
          <div className="flex flex-wrap justify-center gap-2 md:gap-4">
            {kategoriler.map((kategori) => (
              <button
                type="button"
                key={kategori.kategoriler}
                onClick={(e) => handleCategoryClick(e, kategori.kategoriler)}
                className={`p-3 md:p-4 rounded-xl font-semibold transition-all duration-300 shadow-sm ${
                  selectedCategoryId === kategori.kategoriler
                    ? "bg-orange-500 scale-110 text-white"
                    : "bg-orange-200 hover:bg-orange-300 active:bg-orange-400 text-orange-900"
                }`}
              >
                {kategori.kategoriler}
              </button>
            ))}
          </div>
        </div>

        {/* Alt Kategori (Pembe) */}
        {selectedCategoryId && (
          <div
            ref={altCategoriesRef}
            className="p-4 md:p-6 bg-gray-50 dark:bg-gray-800 shadow-sm rounded-3xl w-full max-w-5xl mt-4 md:mt-6"
          >
            {filteredAltKategoriler.length > 0 ? (
              <div className="flex flex-wrap justify-center gap-2 md:gap-4">
                {filteredAltKategoriler.map((altKategori) => (
                  <button
                    type="button"
                    key={altKategori.altkategoriler}
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedAltKategori(altKategori);
                      setSelectedExperiment(null);
                      if (topicsRef.current) {
                        topicsRef.current.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    className={`p-3 md:p-4 rounded-xl font-semibold transition-all duration-300 shadow-sm ${
                      selectedAltKategori &&
                      selectedAltKategori.altkategoriler === altKategori.altkategoriler
                        ? "bg-pink-500 scale-110 text-white"
                        : "bg-pink-200 hover:bg-pink-300 active:bg-pink-400 text-pink-900"
                    }`}
                  >
                    {altKategori.altkategoriler}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-center">Alt kategori bulunamadı.</p>
            )}
          </div>
        )}

        {/* Konular ve Deneyler */}
        {selectedAltKategori &&
          (() => {
            const filteredTopics = konular.filter(
              (topic) => topic.altkategori_adi === selectedAltKategori.altkategoriler
            );
            if (filteredTopics.length === 0) {
              return (
                <div className="p-4 md:p-6 bg-white dark:bg-gray-900 shadow-sm rounded-3xl w-full max-w-5xl mt-4 md:mt-6">
                  <p className="text-center">Seçilen alt kategori ile ilgili konu bulunamadı.</p>
                </div>
              );
            }
            return (
              <div
                ref={topicsRef}
                className="p-4 md:p-6 bg-white dark:bg-gray-900 shadow-sm rounded-3xl w-full max-w-5xl mt-4 md:mt-6 overflow-x-auto"
              >
                <table className="w-full border-collapse border border-gray-300 dark:border-gray-600 text-center rounded-xl overflow-hidden text-xs md:text-base dark:text-gray-100">
                  <tbody>
                    {filteredTopics.map((topic) => {
                      const topicDeneyler = deneyler.filter(
                        (deney) => deney.konu_adi === topic.konu_adi
                      );
                      return (
                        <React.Fragment key={topic.konu_adi}>
                          <tr className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all shadow-sm rounded-lg overflow-hidden">
                            <td className="border border-gray-300 dark:border-gray-600 p-3 md:p-5 font-bold bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-700 dark:to-amber-700 shadow-sm rounded-l-lg text-orange-800 dark:text-orange-300">
                              {topic.konu_adi}
                            </td>
                            <td className="border border-gray-300 dark:border-gray-600 p-2 md:p-3">
                              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                                {topicDeneyler.map((deney) => (
                                  <button
                                    type="button"
                                    key={deney.deney_adi}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setSelectedExperiment(
                                        selectedExperiment?.deney_adi === deney.deney_adi ? null : deney
                                      );
                                    }}
                                    className={`p-2 md:p-3 rounded-xl font-semibold transition-all duration-300 shadow-sm ${
                                      selectedExperiment?.deney_adi === deney.deney_adi
                                        ? "bg-fuchsia-500 scale-110 text-white"
                                        : "bg-fuchsia-200 hover:bg-fuchsia-300 active:bg-fuchsia-400 text-fuchsia-900"
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
                                  <div
                                    ref={experimentDetailsRef}
                                    className="p-6 bg-gray-50 dark:bg-gray-800 shadow-sm rounded-3xl w-full max-w-4xl mx-auto"
                                  >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                      <div className="p-4 border border-gray-300 dark:border-gray-600 rounded-3xl bg-gray-100 dark:bg-gray-800 shadow-sm">
                                        <div className="flex flex-wrap gap-4 mt-4 justify-center">
                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              e.preventDefault();
                                              setContentType("experiment");
                                            }}
                                            className={`p-3 rounded-lg transition-all duration-300 ${
                                              contentType === "experiment"
                                                ? "bg-fuchsia-500 scale-105 text-white"
                                                : "bg-fuchsia-200 hover:bg-fuchsia-300 active:bg-fuchsia-400 text-fuchsia-900"
                                            }`}
                                          >
                                            Deney
                                          </button>
                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              e.preventDefault();
                                              setContentType("materials");
                                            }}
                                            className={`p-3 rounded-lg transition-all duration-300 ${
                                              contentType === "materials"
                                                ? "bg-rose-500 scale-105 text-white"
                                                : "bg-rose-200 hover:bg-rose-300 active:bg-rose-400 text-rose-900"
                                            }`}
                                          >
                                            Malzemeler
                                          </button>
                                        </div>
                                        <div className="mt-4 font-semibold text-lg text-left dark:text-gray-100">
                                          {contentType === "materials" ? (
                                            materialsDisplayText.split("\n").map((line, idx) => (
                                              <p key={idx}>
                                                <span className="mr-2">•</span>
                                                {line}
                                              </p>
                                            ))
                                          ) : (
                                            <p>{displayText || "İçerik bulunamadı."}</p>
                                          )}
                                        </div>
                                        {fullText.length > 250 && (
                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              e.preventDefault();
                                              setReadMore(!readMore);
                                            }}
                                            className="mt-2 text-orange-600 font-semibold hover:text-orange-700 active:text-orange-800"
                                          >
                                            {readMore ? "Kapat" : "Devamını Oku"}
                                          </button>
                                        )}
                                      </div>
                                      <div className="flex justify-center w-full md:w-auto">
                                        {embedVideoUrl ? (
                                          <iframe
                                            className="w-[360px] h-[640px] border rounded-3xl shadow-sm"
                                            src={embedVideoUrl}
                                            title="Deney Videosu"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                          ></iframe>
                                        ) : (
                                          <div className="w-[360px] h-[640px] border rounded-3xl shadow-sm flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-center p-4">
                                            <p className="font-semibold">
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
