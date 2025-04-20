// app/routes/_index.tsx
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

// Deneyler koleksiyonundan gelen obje tipi
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
  const [kRes, aRes, ktrRes, dRes] = await Promise.all([
    getCollectionItems("Kategoriler"),
    getCollectionItems("Alt_Kategoriler"),
    getCollectionItems("Konular"),
    getCollectionItems("Deneyler"),
  ]);

  const kategoriler = (kRes.data || kRes) as Kategoriler[];
  const altKategoriler = (aRes.data || aRes) as Alt_Kategoriler[];
  const konular = (ktrRes.data || ktrRes) as Konular[];
  const deneyler = (dRes.data || dRes) as Deneyler[];

  // "Tüm Kategoriler" başlığını en başa ekliyoruz
  kategoriler.unshift({ kategoriler: "Tüm Kategoriler" });

  return json<LoaderData>({ kategoriler, altKategoriler, konular, deneyler });
};

export const meta: MetaFunction = () => [
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

export const links: LinksFunction = () => [
  { rel: "canonical", href: "https://www.fizikfinito.com" },
];

// İçerik tipi: "experiment" veya "materials"
type ContentType = "experiment" | "materials";

// Boşlukları tireye çeviren basit slugify fonksiyonu
const slugify = (text: string) => text.trim().replace(/\s+/g, "-");

export default function ExperimentPage() {
  const { kategoriler, altKategoriler, konular, deneyler } =
    useLoaderData<LoaderData>();
  const location = useLocation();

  // Kullanıcı etkileşimini takip etmek için state
  const [hasInteracted, setHasInteracted] = useState(false);

  // Section referansları
  const altCategoriesRef = useRef<HTMLDivElement>(null);
  const topicsRef = useRef<HTMLDivElement>(null);
  const experimentsRef = useRef<HTMLDivElement>(null);
  const experimentDetailsRef = useRef<HTMLDivElement>(null);

  // URL segmentlerini ayıkla
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const initialCategory = pathSegments[0]
    ? decodeURIComponent(pathSegments[0])
    : kategoriler[0].kategoriler;
  const initialAltKategoriSegment = pathSegments[1]
    ? decodeURIComponent(pathSegments[1])
    : null;
  const initialTopicSegment = pathSegments[2]
    ? decodeURIComponent(pathSegments[2])
    : null;
  const initialExperimentSegment = pathSegments[3]
    ? decodeURIComponent(pathSegments[3])
    : null;

  // Seçili kategori
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    initialCategory
  );

  // Alt kategorileri filtrele
  const filteredAltKategoriler =
    selectedCategoryId === "Tüm Kategoriler"
      ? altKategoriler
      : altKategoriler.filter((alt) => alt.kategori === selectedCategoryId);

  // Varsayılan alt kategori
  const defaultAltKategori = initialAltKategoriSegment
    ? altKategoriler.find(
        (ak) =>
          ak.altkategoriler === initialAltKategoriSegment &&
          ak.kategori === selectedCategoryId
      ) || null
    : null;
  const [selectedAltKategori, setSelectedAltKategori] = useState<
    Alt_Kategoriler | null
  >(defaultAltKategori || filteredAltKategoriler[0] || null);

  // Seçili konu (topic)
  const [selectedTopic, setSelectedTopic] = useState<string | null>(
    initialTopicSegment
  );

  // Seçili deney (experiment)
  let initExp: Deneyler | null = null;
  if (initialTopicSegment && initialExperimentSegment) {
    initExp =
      deneyler.find(
        (exp) =>
          exp.konu_adi === initialTopicSegment &&
          exp.deney_adi === initialExperimentSegment
      ) || null;
  }
  const [selectedExperiment, setSelectedExperiment] = useState<Deneyler | null>(
    initExp
  );

  // İçerik tipi ve metin kontrolü
  const [contentType, setContentType] = useState<ContentType>("experiment");
  const [readMore, setReadMore] = useState(false);

  // --- Etkileşim olduğunda hasInteracted true olsun ---
  const onUserInteraction = () => {
    if (!hasInteracted) setHasInteracted(true);
  };

  // Kategori seçimi değiştiğinde alt kategori ve diğerleri sıfırlansın
  useEffect(() => {
    setSelectedAltKategori(
      filteredAltKategoriler[0] || null
    );
    setSelectedTopic(null);
    setSelectedExperiment(null);
  }, [selectedCategoryId]);

  // Alt kategori seçimi değiştiğinde konu ve deney sıfırlansın
  useEffect(() => {
    setSelectedTopic(null);
    setSelectedExperiment(null);
  }, [selectedAltKategori]);

  // URL güncelleme
  useEffect(() => {
    if (!hasInteracted) return;
    let newPath = `/${slugify(selectedCategoryId)}`;
    if (selectedAltKategori)
      newPath += `/${slugify(selectedAltKategori.altkategoriler)}`;
    if (selectedTopic) newPath += `/${slugify(selectedTopic)}`;
    if (selectedExperiment)
      newPath += `/${slugify(selectedExperiment.deney_adi)}`;
    if (newPath !== location.pathname) {
      window.history.pushState(null, "", newPath);
    }
  }, [
    selectedCategoryId,
    selectedAltKategori,
    selectedTopic,
    selectedExperiment,
    location.pathname,
    hasInteracted,
  ]);

  // Scroll efektleri
  useEffect(() => {
    if (!hasInteracted) return;
    altCategoriesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedCategoryId, hasInteracted]);

  useEffect(() => {
    if (!hasInteracted) return;
    topicsRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedAltKategori, hasInteracted]);

  useEffect(() => {
    if (!hasInteracted) return;
    experimentsRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedTopic, hasInteracted]);

  useEffect(() => {
    if (!hasInteracted) return;
    experimentDetailsRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedExperiment, hasInteracted]);

  // Click handler'lar
  const handleCategoryClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    cat: string
  ) => {
    e.preventDefault();
    onUserInteraction();
    setSelectedCategoryId(cat);
  };

  const handleAltKategoriClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    alt: Alt_Kategoriler
  ) => {
    e.preventDefault();
    onUserInteraction();
    setSelectedAltKategori(alt);
  };

  const handleTopicClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    konuAdi: string
  ) => {
    e.preventDefault();
    onUserInteraction();
    setSelectedTopic(konuAdi);
  };

  const handleDeneyClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    deney: Deneyler
  ) => {
    e.preventDefault();
    onUserInteraction();
    setSelectedExperiment(
      selectedExperiment?.deney_adi === deney.deney_adi ? null : deney
    );
  };

  // Deney veya malzeme metni
  let fullText = "";
  if (selectedExperiment) {
    fullText =
      contentType === "experiment"
        ? selectedExperiment.deney_yazisi
        : selectedExperiment.materiyel_yazisi;
    if (fullText.trim() === "?")
      fullText = "Çok yakında eklenecektir. Lütfen beklemede kalın";
  }
  const displayText =
    fullText.length > 250 && !readMore
      ? fullText.slice(0, 250) + "..."
      : fullText;
  const materialsDisplayText =
    fullText.length > 250 && !readMore
      ? fullText.slice(0, 250)
      : fullText;

  const embedVideoUrl =
    selectedExperiment?.video_url &&
    selectedExperiment.video_url.trim() !== "?"
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
      <div className="flex flex-col items-center min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        {/* Kategori Butonları */}
        <div className="p-4 md:p-8 bg-gray-100 dark:bg-gray-800 shadow-sm rounded-3xl w-full max-w-5xl text-center">
          <div className="flex flex-wrap justify-center gap-2 md:gap-4">
            {kategoriler
              .filter((k) => k.kategoriler !== "Tüm Kategoriler")
              .map((k) => (
                <button
                  key={k.kategoriler}
                  onClick={(e) => handleCategoryClick(e, k.kategoriler)}
                  className={`p-3 md:p-4 rounded-xl font-semibold transition-all duration-300 shadow-sm ${
                    selectedCategoryId === k.kategoriler
                      ? "bg-orange-500 scale-110 text-white"
                      : "bg-orange-200 hover:bg-orange-300 active:bg-orange-400 text-orange-900"
                  }`}
                >
                  {k.kategoriler}
                </button>
              ))}
          </div>
        </div>

        {/* Varsayılan "Tüm Kategoriler" görünümü */}
        {selectedCategoryId === "Tüm Kategoriler" && (
          <div
            ref={topicsRef}
            className="p-4 md:p-6 bg-white dark:bg-gray-900 shadow-sm rounded-3xl w-full max-w-5xl mt-4 overflow-x-auto"
          >
            {/* Mevcut içeriği bozmuyor */}
            {kategoriler
              .filter((kat) => kat.kategoriler !== "Tüm Kategoriler")
              .map((mainCat) => {
                const alts = altKategoriler.filter(
                  (alt) => alt.kategori === mainCat.kategoriler
                );
                if (!alts.length) return null;
                return (
                  <div key={mainCat.kategoriler} className="mb-10">
                    <h2 className="text-2xl font-bold mb-4 text-orange-800 border-l-4 border-orange-300 pl-2">
                      {mainCat.kategoriler}
                    </h2>
                    {alts.map((alt) => {
                      const topics = konular.filter(
                        (t) => t.altkategori_adi === alt.altkategoriler
                      );
                      if (!topics.length) return null;
                      return (
                        <div key={alt.altkategoriler} className="mb-8">
                          <h3 className="text-xl font-bold mb-4 text-pink-600 border-l-4 border-pink-300 pl-2">
                            {alt.altkategoriler}
                          </h3>
                          <table className="w-full border-collapse border border-gray-300 dark:border-gray-600 text-center rounded-xl overflow-hidden text-base dark:text-gray-100">
                            <tbody>
                              {topics.map((topic) => {
                                const exps = deneyler.filter(
                                  (d) => d.konu_adi === topic.konu_adi
                                );
                                return (
                                  <React.Fragment key={topic.konu_adi}>
                                    <tr className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">
                                      <td className="border p-4 font-bold bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-700 dark:to-amber-700 text-orange-800 dark:text-orange-300">
                                        {topic.konu_adi}
                                      </td>
                                      <td className="border p-4">
                                        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                                          {exps.map((d) => (
                                            <button
                                              key={d.deney_adi}
                                              onClick={(e) =>
                                                handleDeneyClick(e, d)
                                              }
                                              className={`p-2 rounded-xl font-semibold transition-all duration-300 shadow-sm ${
                                                selectedExperiment?.deney_adi ===
                                                d.deney_adi
                                                  ? "bg-fuchsia-500 scale-110 text-white"
                                                  : "bg-fuchsia-200 hover:bg-fuchsia-300 active:bg-fuchsia-400 text-fuchsia-900"
                                              }`}
                                            >
                                              {d.deney_adi}
                                            </button>
                                          ))}
                                        </div>
                                      </td>
                                    </tr>
                                    {selectedExperiment &&
                                      exps.some(
                                        (d) =>
                                          d.deney_adi ===
                                          selectedExperiment.deney_adi
                                      ) && (
                                        <tr>
                                          <td colSpan={2}>
                                            <div
                                              ref={experimentDetailsRef}
                                              className="p-6 bg-gray-50 dark:bg-gray-800 shadow-sm rounded-3xl w-full max-w-4xl mx-auto"
                                            >
                                              {/* Deney / Malzemeler ve Video */}
                                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {/* İçerik bölümü */}
                                                <div className="p-4 border rounded-3xl bg-gray-100 dark:bg-gray-800">
                                                  <div className="flex gap-4 justify-center mt-4">
                                                    <button
                                                      onClick={(e) => {
                                                        e.preventDefault();
                                                        onUserInteraction();
                                                        setContentType(
                                                          "experiment"
                                                        );
                                                      }}
                                                      className={`p-3 rounded-lg transition-all duration-300 ${
                                                        contentType ===
                                                        "experiment"
                                                          ? "bg-fuchsia-500 scale-105 text-white"
                                                          : "bg-fuchsia-200 hover:bg-fuchsia-300 active:bg-fuchsia-400 text-fuchsia-900"
                                                      }`}
                                                    >
                                                      Deney
                                                    </button>
                                                    <button
                                                      onClick={(e) => {
                                                        e.preventDefault();
                                                        onUserInteraction();
                                                        setContentType(
                                                          "materials"
                                                        );
                                                      }}
                                                      className={`p-3 rounded-lg transition-all duration-300 ${
                                                        contentType ===
                                                        "materials"
                                                          ? "bg-rose-500 scale-105 text-white"
                                                          : "bg-rose-200 hover:bg-rose-300 active:bg-rose-400 text-rose-900"
                                                      }`}
                                                    >
                                                      Malzemeler
                                                    </button>
                                                  </div>
                                                  <div className="mt-4 font-bold text-lg text-left dark:text-gray-100">
                                                    {contentType === "materials"
                                                      ? materialsDisplayText
                                                          .split("\n")
                                                          .map((line, idx) => (
                                                            <p key={idx}>
                                                              • {line}
                                                            </p>
                                                          ))
                                                      : displayText ||
                                                        "İçerik bulunamadı."}
                                                  </div>
                                                  {fullText.length > 250 && (
                                                    <button
                                                      onClick={(e) => {
                                                        e.preventDefault();
                                                        setReadMore(!readMore);
                                                      }}
                                                      className="mt-2 text-orange-600 font-semibold hover:text-orange-700"
                                                    >
                                                      {readMore
                                                        ? "Kapat"
                                                        : "Devamını Oku"}
                                                    </button>
                                                  )}
                                                </div>
                                                {/* Video bölümü */}
                                                <div className="flex justify-center">
                                                  {embedVideoUrl ? (
                                                    <iframe
                                                      className="w-[360px] h-[640px] border rounded-3xl"
                                                      src={embedVideoUrl}
                                                      title="Deney Videosu"
                                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                      allowFullScreen
                                                    />
                                                  ) : (
                                                    <div className="w-[360px] h-[640px] border rounded-3xl flex items-center justify-center bg-gray-100 dark:bg-gray-800 p-4 text-center">
                                                      Çok yakında eklenecektir. Lütfen
                                                      beklemede kalın.
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
                    })}
                  </div>
                );
              })}
          </div>
        )}

        {/* Seçilen kategoriye göre Alt_Kategoriler & Konular & Deneyler */}
        {selectedCategoryId !== "Tüm Kategoriler" && (
          <>
            {/* Alt_Kategoriler butonları */}
            <div
              ref={altCategoriesRef}
              className="p-4 md:p-6 bg-gray-100 dark:bg-gray-800 shadow-sm rounded-3xl w-full max-w-5xl mt-4 text-center"
            >
              <div className="flex flex-wrap justify-center gap-2 md:gap-4">
                {filteredAltKategoriler.map((alt) => (
                  <button
                    key={alt.altkategoriler}
                    onClick={(e) => handleAltKategoriClick(e, alt)}
                    className={`p-3 md:p-4 rounded-xl font-semibold transition-all duration-300 shadow-sm ${
                      selectedAltKategori?.altkategoriler === alt.altkategoriler
                        ? "bg-pink-500 scale-110 text-white"
                        : "bg-pink-200 hover:bg-pink-300 active:bg-pink-400 text-pink-900"
                    }`}
                  >
                    {alt.altkategoriler}
                  </button>
                ))}
              </div>
            </div>

            {/* Konular butonları */}
            {selectedAltKategori && (
              <div
                ref={topicsRef}
                className="p-4 md:p-6 bg-white dark:bg-gray-900 shadow-sm rounded-3xl w-full max-w-5xl mt-4 text-center"
              >
                <div className="flex flex-wrap justify-center gap-2 md:gap-4">
                  {konular
                    .filter(
                      (topic) =>
                        topic.altkategori_adi ===
                        selectedAltKategori.altkategoriler
                    )
                    .map((topic) => (
                      <button
                        key={topic.konu_adi}
                        onClick={(e) =>
                          handleTopicClick(e, topic.konu_adi)
                        }
                        className={`p-3 md:p-4 rounded-xl font-semibold transition-all duration-300 shadow-sm ${
                          selectedTopic === topic.konu_adi
                            ? "bg-amber-500 scale-110 text-white"
                            : "bg-amber-200 hover:bg-amber-300 active:bg-amber-400 text-amber-900"
                        }`}
                      >
                        {topic.konu_adi}
                      </button>
                    ))}
                </div>
              </div>
            )}

            {/* Deneyler listesi */}
            {selectedTopic && (
              <div
                ref={experimentsRef}
                className="p-4 md:p-6 bg-white dark:bg-gray-900 shadow-sm rounded-3xl w-full max-w-5xl mt-4 overflow-x-auto"
              >
                <table className="w-full border-collapse border border-gray-300 dark:border-gray-600 text-center rounded-xl overflow-hidden text-base dark:text-gray-100">
                  <tbody>
                    <tr className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">
                      <td className="border p-4 font-bold bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-700 dark:to-yellow-700 text-amber-800 dark:text-amber-300">
                        {selectedTopic}
                      </td>
                      <td className="border p-4">
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                          {deneyler
                            .filter((d) => d.konu_adi === selectedTopic)
                            .map((d) => (
                              <button
                                key={d.deney_adi}
                                onClick={(e) => handleDeneyClick(e, d)}
                                className={`p-2 rounded-xl font-semibold transition-all duration-300 shadow-sm ${
                                  selectedExperiment?.deney_adi ===
                                  d.deney_adi
                                    ? "bg-fuchsia-500 scale-110 text-white"
                                    : "bg-fuchsia-200 hover:bg-fuchsia-300 active:bg-fuchsia-400 text-fuchsia-900"
                                }`}
                              >
                                {d.deney_adi}
                              </button>
                            ))}
                        </div>
                      </td>
                    </tr>
                    {selectedExperiment &&
                      deneyler
                        .filter((d) => d.konu_adi === selectedTopic)
                        .some((d) => d.deney_adi === selectedExperiment.deney_adi) && (
                        <tr>
                          <td colSpan={2}>
                            <div
                              ref={experimentDetailsRef}
                              className="p-6 bg-gray-50 dark:bg-gray-800 shadow-sm rounded-3xl w-full max-w-4xl mx-auto"
                            >
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-4 border rounded-3xl bg-gray-100 dark:bg-gray-800">
                                  <div className="flex gap-4 justify-center mt-4">
                                    <button
                                      onClick={(e) => {
                                        e.preventDefault();
                                        onUserInteraction();
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
                                      onClick={(e) => {
                                        e.preventDefault();
                                        onUserInteraction();
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
                                  <div className="mt-4 font-bold text-lg text-left dark:text-gray-100">
                                    {contentType === "materials"
                                      ? materialsDisplayText
                                          .split("\n")
                                          .map((line, idx) => (
                                            <p key={idx}>• {line}</p>
                                          ))
                                      : displayText || "İçerik bulunamadı."}
                                  </div>
                                  {fullText.length > 250 && (
                                    <button
                                      onClick={(e) => {
                                        e.preventDefault();
                                        setReadMore(!readMore);
                                      }}
                                      className="mt-2 text-orange-600 font-semibold hover:text-orange-700"
                                    >
                                      {readMore ? "Kapat" : "Devamını Oku"}
                                    </button>
                                  )}
                                </div>
                                <div className="flex justify-center">
                                  {embedVideoUrl ? (
                                    <iframe
                                      className="w-[360px] h-[640px] border rounded-3xl"
                                      src={embedVideoUrl}
                                      title="Deney Videosu"
                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                      allowFullScreen
                                    />
                                  ) : (
                                    <div className="w-[360px] h-[640px] border rounded-3xl flex items-center justify-center bg-gray-100 dark:bg-gray-800 p-4 text-center">
                                      Çok yakında eklenecektir. Lütfen beklemede
                                      kalın.
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
