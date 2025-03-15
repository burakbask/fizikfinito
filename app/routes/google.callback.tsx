import { LoaderFunction } from "@remix-run/node";
import { authenticator } from "~/utils/auth.server";

export let loader: LoaderFunction = async ({ request }) => {
  // Giriş başarılı olursa profil sayfasına yönlendirin, başarısız olursa giriş sayfasına
  return authenticator.authenticate("google", request, {
    successRedirect: "/profile",
    failureRedirect: "/login",
  });
};
