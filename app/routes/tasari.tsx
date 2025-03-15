import { json, LoaderFunction, ActionFunction } from "@remix-run/node";
import { useActionData, useLoaderData, Form } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { getSession } from "../utils/session.server";
import { getCollectionItems, addItem } from "../utils/directusClient";

const POST_LIMIT = 5;
const COOLDOWN_TIME_MS = 90000; // 90 seconds in milliseconds
const userCooldowns = new Map(); // To track cooldowns per user

// Loader function to fetch posts based on tag filter
export const loader: LoaderFunction = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const tag = url.searchParams.get("tag") || "Tümü";

    console.log(`Loader: Fetching posts for tag: ${tag}`);

    const posts = tag === "Tümü"
      ? await getCollectionItems("posts")
      : await getCollectionItems("posts", { filter: { tag: { _eq: tag } } });

    return json({ posts, tag });
  } catch (error: any) {
    console.error("Loader Error:", error);
    return json({ posts: [], error: error.message || "Failed to load posts.", tag: "Tümü" });
  }
};

// Action function to handle new post submissions
export const action: ActionFunction = async ({ request }) => {
  try {
    const session = await getSession(request.headers.get("Cookie"));
    const user = session.get("user");

    if (!user) {
      return json({ error: "Lütfen önce giriş yapınız.", redirectUrl: "/google" }, { status: 401 });
    }

    const userId = user.id;

    const formData = await request.formData();
    const content = formData.get("content");
    const title = formData.get("title");
    const nickname = formData.get("nickname");
    const tag = formData.get("tag") || "Karışık";

    const errors: Record<string, string> = {};
    if (!title) errors.title = "Lütfen konu başlığı giriniz..🎅";
    if (!content) errors.content = "Lütfen bir görüş giriniz..🎅";
    if (!nickname) errors.nickname = "Lütfen rumuzunuzu giriniz..🎅";

    if (Object.keys(errors).length > 0) {
      return json({ errors }, { status: 400 });
    }

    // Check for cooldown and post limits
    const currentTime = Date.now();
    if (!userCooldowns.has(userId)) {
      userCooldowns.set(userId, { lastPostTime: 0, postCount: 0 });
    }

    const userData = userCooldowns.get(userId);

    if (currentTime - userData.lastPostTime < COOLDOWN_TIME_MS) {
      const remainingTime = Math.ceil((COOLDOWN_TIME_MS - (currentTime - userData.lastPostTime)) / 1000);
      return json({
        error: `Yeni bir görüş paylaşmadan önce lütfen ${remainingTime} saniye bekleyin..😥`,
      }, { status: 429 });
    }

    if (userData.postCount >= POST_LIMIT) {
      return json({
        error: "Maksimum 5 adet görüş paylaşabilirsiniz.",
      }, { status: 403 });
    }

    await addItem("posts", {
      content,
      title,
      user: nickname,
      tag,
    });

    // Update cooldown and post count
    userCooldowns.set(userId, { lastPostTime: currentTime, postCount: userData.postCount + 1 });

    return json({ success: true, message: `Görüşünüz başarıyla paylaşıldı. Umarım hayallerine en kısa sürede ulaşabilirsin..😊` });
  } catch (error: any) {
    return json({ error: error.message || "Failed to save post." }, { status: 500 });
  }
};

export default function Tasari() {
  const { posts, error, tag, redirectUrl } = useLoaderData();
  const actionData = useActionData();

  const tags = [
    "Tümü",
    "Karışık",
    "Türkçe",
    "Matematik",
    "Geometri",
    "Fizik",
    "Kimya",
    "Biyoloji",
    "Tarih",
    "Coğrafya",
    "Felsefe",
    "İngilizce"
  ];

  const postsSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (actionData?.success && postsSectionRef.current) {
      postsSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [actionData]);

  return (
    <div className="p-8 bg-gradient-to-r from-[#FF5733] to-[#C70039] min-h-screen">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-center text-white">🎄 Filtre 🎄</h2>
        <div className="flex flex-wrap justify-center space-x-2">
          {tags.map((filterTag) => (
            <Form method="get" key={filterTag} className="mb-2">
              <input type="hidden" name="tag" value={filterTag} />
              <button
                type="submit"
                className={`px-4 py-2 rounded-full shadow-lg whitespace-nowrap ${tag === filterTag ? "bg-white text-red-600" : "bg-red-200 text-white border border-white"} hover:bg-red-300 hover:text-white`}
              >
                {filterTag}
              </button>
            </Form>
          ))}
        </div>
      </div>

      <h1 className="text-4xl font-extrabold mb-8 text-center text-white">🎅 Görüşlerinizi Paylaşın 🎅</h1>

      {actionData?.success && (
        <div className="mb-6 max-w-xl mx-auto bg-green-100 p-6 rounded-lg shadow-xl text-center">
          <p className="text-green-700 font-bold">{actionData.message}</p>
        </div>
      )}

      {actionData?.error && (
        <div className="mb-6 max-w-xl mx-auto bg-red-100 p-6 rounded-lg shadow-xl text-center">
          <p className="text-red-700 font-bold">{actionData.error}</p>
        </div>
      )}

      {actionData?.error && actionData.redirectUrl && (
        <div className="mb-12 max-w-xl mx-auto bg-red-100 p-6 rounded-lg shadow-xl text-center">
          <p className="text-red-700 font-bold mb-4">{actionData.error}</p>
          <a
            href={actionData.redirectUrl}
            className="bg-red-500 text-white px-6 py-3 rounded-full font-bold hover:bg-red-600 shadow-lg inline-block"
          >
            Google ile Giriş Yap
          </a>
        </div>
      )}

      <Form method="post" className="mb-12 max-w-xl mx-auto bg-white p-6 rounded-lg shadow-xl">
        <input
          type="text"
          name="title"
          className="w-full p-3 border rounded-lg mb-4 shadow-inner focus:outline-none focus:ring-2 focus:ring-red-400"
          placeholder="Konu etiketi yazın..."
        />
        {actionData?.errors?.title && <p className="text-red-500 mb-2">{actionData.errors.title}</p>}
        <textarea
          name="content"
          className="w-full p-3 border rounded-lg mb-4 shadow-inner focus:outline-none focus:ring-2 focus:ring-red-400"
          placeholder="Görüşlerinizi yazın..."
          rows={4}
        ></textarea>
        {actionData?.errors?.content && <p className="text-red-500 mb-2">{actionData.errors.content}</p>}
        <input
          type="text"
          name="nickname"
          className="w-full p-3 border rounded-lg mb-4 shadow-inner focus:outline-none focus:ring-2 focus:ring-red-400"
          placeholder="Rumuzunuzu yazın..."
        />
        {actionData?.errors?.nickname && <p className="text-red-500 mb-2">{actionData.errors.nickname}</p>}
        <select name="tag" className="w-full p-3 border rounded-lg mb-4 shadow-inner focus:outline-none focus:ring-2 focus:ring-red-400" defaultValue="Karışık">
          {tags.map((optionTag) => (
            <option key={optionTag} value={optionTag}>{optionTag}</option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-red-500 text-white px-6 py-3 rounded-full font-bold hover:bg-red-600 shadow-lg w-full"
        >
          Paylaş
        </button>
      </Form>

      {error && <p className="text-red-500 text-center">Hata: {error}</p>}

      <div ref={postsSectionRef}>
        <h2 className="text-3xl font-bold mb-6 text-center text-white">{tag === "Tümü" ? "🎁 Tüm Görüşler 🎁" : `🎁 ${tag} Görüşleri 🎁`}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.length > 0 ? (
            posts.filter((post) => tag === "Tümü" || post.tag === tag)
              .map((post) => (
                <div key={post.id} className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 hover:shadow-2xl transition duration-300">
                  <h3 className="font-bold text-xl mb-2 text-red-600 break-words">{post.title}</h3>
                  <p className="text-gray-700 mb-4 break-words">{post.content}</p>
                  <small className="text-gray-500">Kullanıcı: {post.user} | Etiket: {post.tag}</small>
                </div>
              ))
          ) : (
            <p className="text-gray-500 text-center">Henüz bir görüş yok.</p>
          )}
        </div>
      </div>
    </div>
  );
}
