// app/routes/experiment.tsx
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import React, { useState, useEffect, useRef } from "react";
import { useLoaderData } from "@remix-run/react";
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
// altkategori_adi, eşleştirme için tutuluyor ancak UI’da gösterilmiyor.
type Konular = { 
  konu_adi: string;
  altkategori_adi: string;
};

// Deneyler koleksiyonundan gelen obje tipi (yeni model)
// Alan isimleri güncellendi:
type Deneyler = {
  deney_adi: string;
  deney_yazisi: string;
  kavram_yazisi: string;
  materiyel_yazisi: string;
  video_url: string;
  konu_adi: string; // Hangi konuya ait olduğunu belirtir
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

export default function ExperimentPage() {
  const { kategoriler, altKategoriler, konular, deneyler } = useLoaderData<LoaderData>();

  // Kategori seçimi: İlk kategorinin "kategoriler" değeri
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    kategoriler.length > 0 ? kategoriler[0].kategoriler : ""
  );
  const selectedCategory = kategoriler.find(
    (cat) => cat.kategoriler === selectedCategoryId
  );

  // Seçili kategoriye ait alt kategorileri filtreleyelim
  const filteredAltKategoriler = altKategoriler.filter(
    (alt) => alt.kategori === selectedCategoryId
  );
  const [selectedAltKategori, setSelectedAltKategori] = useState<Alt_Kategoriler | null>(
    filteredAltKategoriler.length > 0 ? filteredAltKategoriler[0] : null
  );
  useEffect(() => {
    const relatedAltKategoriler = altKategoriler.filter(
      (alt) => alt.kategori === selectedCategoryId
    );
    if (relatedAltKategoriler.length > 0) {
      setSelectedAltKategori(relatedAltKategoriler[0]);
    } else {
      setSelectedAltKategori(null);
    }
  }, [selectedCategoryId, altKategoriler]);

  // Konular: Directus'tan gelen "konular" verileri
  const topics = konular;

  // Deneyler: Deneyler koleksiyonundan, konu_adi eşleşen deneyleri filtreleyelim
  const [selectedExperiment, setSelectedExperiment] = useState<Deneyler | null>(null);

  // İçerik tipi: "experiment", "explanation" veya "materials"
  const [contentType, setContentType] = useState<"experiment" | "explanation" | "materials">("experiment");
  const [categoryOpen, setCategoryOpen] = useState(true);
  const [readMore, setReadMore] = useState(false);
  const altKategoriRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setReadMore(false);
  }, [contentType]);

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setCategoryOpen(!categoryOpen);
    setTimeout(() => {
      if (altKategoriRef.current) {
        altKategoriRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  // Seçili deneyin içerik alanlarını alıyoruz.
  let fullText = "";
  if (selectedExperiment) {
    if (contentType === "experiment") {
      fullText = selectedExperiment.deney_yazisi;
    } else if (contentType === "explanation") {
      fullText = selectedExperiment.kavram_yazisi;
    } else if (contentType === "materials") {
      fullText = selectedExperiment.materiyel_yazisi;
    }
  }
  const displayText =
    fullText.length > 250 && !readMore ? fullText.slice(0, 250) + "..." : fullText;

  // Video URL'sini embed için dönüştürelim; eğer "/shorts/" içeriyorsa "/embed/" ile değiştirelim.
  const embedVideoUrl = selectedExperiment?.video_url
    ? selectedExperiment.video_url.replace("/shorts/", "/embed/")
    : "";

  return (
    <div className="flex flex-col items-center text-gray-800 bg-white min-h-screen">
      {/* Kategori Seçimi */}
      <div className="p-4 md:p-8 bg-gray-100 shadow-md rounded-3xl w-full max-w-5xl text-center">
        <button
          onClick={() => setCategoryOpen(!categoryOpen)}
          className="p-3 md:p-4 rounded-xl font-semibold transition-all duration-300 shadow-lg text-white bg-blue-500 hover:bg-blue-600 flex items-center justify-center w-full"
        >
          {selectedCategory ? selectedCategory.kategoriler : "Kategoriler"}{" "}
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
                    ? "bg-blue-600 scale-110"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                {kategori.kategoriler}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Alt Kategori Seçimi */}
      {selectedCategory && (
        <div
          ref={altKategoriRef}
          className="p-4 md:p-6 bg-gray-50 shadow-md rounded-3xl w-full max-w-5xl mt-4 md:mt-6"
        >
          {filteredAltKategoriler.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-2 md:gap-4">
              {filteredAltKategoriler.map((altKategori) => (
                <button
                  key={altKategori.altkategoriler}
                  onClick={() => setSelectedAltKategori(altKategori)}
                  className={`p-3 md:p-4 rounded-xl font-semibold transition-all duration-300 shadow-lg text-white ${
                    selectedAltKategori &&
                    selectedAltKategori.altkategoriler === altKategori.altkategoriler
                      ? "bg-green-600 scale-110"
                      : "bg-green-500 hover:bg-green-600"
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
      {topics.length > 0 && (
        <div className="p-4 md:p-6 bg-white shadow-md rounded-3xl w-full max-w-5xl mt-4 md:mt-6 overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 text-center rounded-xl overflow-hidden text-gray-800 text-xs md:text-base">
            <tbody>
              {topics.map((topic) => {
                // Her konu için, Deneyler koleksiyonundan konu_adi eşleşen deneyleri filtreleyelim
                const topicDeneyler = deneyler.filter(
                  (deney) => deney.konu_adi === topic.konu_adi
                );
                return (
                  <React.Fragment key={topic.konu_adi}>
                    <tr className="bg-gray-100 hover:bg-gray-200 transition-all shadow-md rounded-lg overflow-hidden">
                      <td className="border border-gray-300 p-3 md:p-5 font-bold text-sm md:text-xl text-white bg-gradient-to-r from-blue-500 to-blue-400 shadow-md w-1/3 md:w-auto rounded-l-lg">
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
                                  ? "bg-blue-600 scale-110"
                                  : "bg-blue-500 hover:bg-blue-600"
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
                                    <button
                                      onClick={() => setContentType("experiment")}
                                      className={`p-3 rounded-lg text-white ${
                                        contentType === "experiment"
                                          ? "bg-blue-600 scale-105"
                                          : "bg-blue-500 hover:bg-blue-600"
                                      }`}
                                    >
                                      Deney
                                    </button>
                                    <button
                                      onClick={() => setContentType("explanation")}
                                      className={`p-3 rounded-lg text-white ${
                                        contentType === "explanation"
                                          ? "bg-purple-600 scale-105"
                                          : "bg-purple-500 hover:bg-purple-600"
                                      }`}
                                    >
                                      Kavram
                                    </button>
                                    <button
                                      onClick={() => setContentType("materials")}
                                      className={`p-3 rounded-lg text-white ${
                                        contentType === "materials"
                                          ? "bg-green-600 scale-105"
                                          : "bg-green-500 hover:bg-green-600"
                                      }`}
                                    >
                                      Malzemeler
                                    </button>
                                  </div>
                                  <p className="text-gray-700 font-semibold text-lg text-center">
                                    {displayText || "İçerik bulunamadı."}
                                  </p>
                                  {fullText.length > 250 && (
                                    <button
                                      onClick={() => setReadMore(!readMore)}
                                      className="mt-2 text-blue-500 font-semibold"
                                    >
                                      {readMore ? "Kapat" : "Devamını Oku"}
                                    </button>
                                  )}
                                </div>
                                <div className="flex justify-center w-full md:w-auto">
                                  {selectedExperiment.video_url && (
                                    <iframe
                                      className="w-[360px] h-[640px] border rounded-3xl shadow-lg"
                                      src={embedVideoUrl}
                                      title="Deney Videosu"
                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                      allowFullScreen
                                    ></iframe>
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
      )}
    </div>
  );
}
