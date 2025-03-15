import { useState, useEffect } from "react";
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { authenticator } from "~/utils/auth.server"; // Adjust based on your file structure

// Loader to check if the user is authenticated
export const loader = async ({ request }: { request: Request }) => {
  const user = await authenticator.isAuthenticated(request);
  if (!user) {
    return json({ loggedIn: false });
  }
  return json({ loggedIn: true });
};

export default function DersTakvimim() {
  const { loggedIn } = useLoaderData();

  // State to track homework progress
  const [homeworkProgress, setHomeworkProgress] = useState(() => {
    if (typeof window !== "undefined") {
      const storedProgress = localStorage.getItem("homeworkProgress");
      return storedProgress ? JSON.parse(storedProgress) : {};
    }
    return {};
  });

  // Save progress to localStorage whenever state changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("homeworkProgress", JSON.stringify(homeworkProgress));
    }
  }, [homeworkProgress]);

  // Physics topics by grade
  const homeworkTopics = {
    "9. Sınıf": ["Fizik Temelleri", "Hareket ve Kuvvet", "Enerji ve Hareket"],
    "10. Sınıf": ["Elektrik ve Manyetizma", "Dalgalar", "Optik"],
    "11. Sınıf": ["Kuvvet ve Denge", "Basit Harmonik Hareket", "Isı ve Sıcaklık"],
    "12. Sınıf": ["Elektromanyetik İndüksiyon", "Çembersel Hareket", "Modern Fizik"],
  };

  const totalTopics = Object.values(homeworkTopics).flat().length;
  const completedTopics = Object.values(homeworkProgress).flatMap((topics) =>
    Object.values(topics).filter((status) => status === true)
  ).length;

  const handleToggle = (classGrade: string, topic: string) => {
    setHomeworkProgress((prevProgress) => {
      const updatedProgress = {
        ...prevProgress,
        [classGrade]: {
          ...prevProgress[classGrade],
          [topic]: !prevProgress[classGrade]?.[topic],
        },
      };
      return updatedProgress;
    });
  };

  const completionPercentage = Math.round((completedTopics / totalTopics) * 100);

  if (!loggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-semibold mb-4">Ödev Planlamam</h2>
          <p className="mb-6 text-gray-700">Devam etmek için lütfen giriş yapın.</p>
          <a
            href="/auth/google"
            className="bg-blue-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Google ile Giriş Yap
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white rounded-xl shadow-lg space-y-6 mt-12">
      {/* Header */}
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Ders Takvimim</h2>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-6 mb-6">
        <div
          className="bg-green-500 h-6 rounded-full"
          style={{ width: `${completionPercentage}%` }}
        ></div>
      </div>
      <p className="text-lg font-semibold text-gray-700 mb-4">
        Tamamlanma Oranı: {completionPercentage}%
      </p>

      {/* Homework Topics */}
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
