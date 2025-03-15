import { useState } from "react";

// Ödev planlama sayfası
export default function HomeworkPlanning() {
  // Ödevler için durum bilgisi
  const [homeworkProgress, setHomeworkProgress] = useState(() => {
    // Yerel depolamadan mevcut durumu yükleyin
    const storedProgress = localStorage.getItem("homeworkProgress");
    return storedProgress ? JSON.parse(storedProgress) : {};
  });

  // Her bir sınıfa ait konular
  const homeworkTopics = {
    "9. Sınıf": ["Fizik Temelleri", "Hareket ve Kuvvet", "Enerji ve Hareket"],
    "10. Sınıf": ["Elektrik ve Manyetizma", "Dalgalar", "Optik"],
    "11. Sınıf": ["Kuvvet ve Denge", "Basit Harmonik Hareket", "Isı ve Sıcaklık"],
    "12. Sınıf": ["Elektromanyetik İndüksiyon", "Çembersel Hareket", "Modern Fizik"]
  };

  // Toplam konu ve tamamlanan konu sayısı hesaplama
  const totalTopics = Object.values(homeworkTopics).flat().length;
  const completedTopics = Object.values(homeworkProgress).flatMap((topics) =>
    Object.values(topics).filter((status) => status === true)
  ).length;

  // İşaretleme durumunu güncelleme fonksiyonu
  const handleToggle = (classGrade, topic) => {
    setHomeworkProgress((prevProgress) => {
      const updatedProgress = {
        ...prevProgress,
        [classGrade]: {
          ...prevProgress[classGrade],
          [topic]: !prevProgress[classGrade]?.[topic]
        }
      };
      // Güncellenmiş durumu yerel depolamaya kaydedin
      localStorage.setItem("homeworkProgress", JSON.stringify(updatedProgress));
      return updatedProgress;
    });
  };

  // Tamamlanma yüzdesi hesaplama
  const completionPercentage = Math.round((completedTopics / totalTopics) * 100);

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white rounded-xl shadow-lg space-y-6 mt-12">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Ödev Planlamam</h2>
      <div className="w-full bg-gray-200 rounded-full h-6 mb-6">
        <div
          className="bg-green-500 h-6 rounded-full"
          style={{ width: `${completionPercentage}%` }}
        ></div>
      </div>
      <p className="text-lg font-semibold text-gray-700 mb-4">
        Tamamlanma Oranı: {completionPercentage}%
      </p>
      <div className="space-y-8">
        {Object.entries(homeworkTopics).map(([classGrade, topics]) => (
          <div key={classGrade} className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">{classGrade}</h3>
            <ul className="space-y-4">
              {topics.map((topic) => (
                <li key={topic} className="flex items-center justify-between">
                  <span className="text-gray-800">{topic}</span>
                  <button
                    onClick={() => handleToggle(classGrade, topic)}
                    className={`px-4 py-2 rounded-lg font-bold transition duration-300 ease-in-out ${
                      homeworkProgress[classGrade]?.[topic]
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                    }`}
                  >
                    {homeworkProgress[classGrade]?.[topic] ? "İzledim" : "İzlemedim"}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}