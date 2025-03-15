import { LoaderFunction, redirect } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { authenticator } from "~/utils/auth.server";

export let loader: LoaderFunction = async ({ request }) => {
  let user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/",
  });

  return { user };
};

export default function Profile() {
  const { user } = useLoaderData<typeof loader>();

  if (!user) {
    return <p>Giriş yapmanız gerekiyor.</p>;
  }

  return (
    <div className="p-8 max-w-2xl mx-auto bg-white rounded-xl shadow-lg mt-12">
      <div className="flex items-center space-x-6 mb-8">
        <img
          src={user._json.picture}
          alt="Profil Fotoğrafı"
          className="h-20 w-20 rounded-full border-2 border-gray-300"
        />
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {user.displayName}
          </h1>
          <p className="text-gray-600">{user._json.email}</p>
        </div>
      </div>

      <h2 className="text-xl font-semibold text-gray-800 mb-4">Profilim</h2>
      <div className="space-y-4">
        {/* İzlediğim Videolar */}
        <Link to="/watched-videos" className="block">
          <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-lg font-bold">İzlediğim Videolar</h3>
            <p className="text-sm mt-2">Daha önce izlediğiniz videoları buradan görüntüleyin.</p>
          </div>
        </Link>

        {/* Daha Sonra İzleyeceklerim */}
        <Link to="/watch-later" className="block">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-lg font-bold">Daha Sonra İzleyeceklerim</h3>
            <p className="text-sm mt-2">Daha sonra izlemek üzere kaydettiğiniz videoları buradan görüntüleyin.</p>
          </div>
        </Link>

        {/* Ödev Planlamam */}
        
         <Link to="/homework-planning" className="block">
          <div className="bg-gradient-to-r from-purple-400 to-pink-500 text-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-lg font-bold">Ödev Planlamam</h3>
            <p className="text-sm mt-2">Ödevlerinizi planlamak ve düzenlemek için burayı kullanın.</p>
          </div>
        </Link>
       
      </div>

      <div className="text-center mt-8">
        <form action="/logout" method="post">
          <button
            type="submit"
            className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold transition duration-300 ease-in-out hover:bg-red-600"
          >
            Çıkış Yap
          </button>
        </form>
      </div>
    </div>
  );
}
