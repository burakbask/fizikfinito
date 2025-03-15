import { useEffect, useState } from "react";

export default function WatchedVideos() {
  const [watchedVideos, setWatchedVideos] = useState<string[]>([]);

  useEffect(() => {
    // Yerel depolamadan izlenen videoları yükleyin
    const storedWatched = localStorage.getItem("watchedVideos");
    if (storedWatched) {
      setWatchedVideos(JSON.parse(storedWatched));
    }

    // Sayfa yüklendiğinde tıklanan kartları izlenmiş olarak işaretleyin
    window.addEventListener("cardClicked", (event: any) => {
      const newVideo = event.detail;
      setWatchedVideos((prevWatched) => {
        const updatedWatched = [...new Set([...prevWatched, newVideo])];
        localStorage.setItem("watchedVideos", JSON.stringify(updatedWatched));
        return updatedWatched;
      });
    });

    return () => {
      window.removeEventListener("cardClicked", () => {});
    };
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white rounded-xl shadow-lg space-y-6 mt-12">
      <h2 className="text-2xl font-bold text-gray-800">İzlediğim Videolar</h2>
      {watchedVideos.length > 0 ? (
        <ul className="list-disc list-inside space-y-4">
          {watchedVideos.map((video, index) => (
            <li key={index} className="text-gray-800">
              {video}
            </li>
          ))}
        </ul>
      ) : (
        <p>Henüz izlediğiniz bir video bulunmamaktadır.</p>
      )}
    </div>
  );
}
