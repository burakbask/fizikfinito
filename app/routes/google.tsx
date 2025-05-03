import type { LoaderFunction } from "@remix-run/node";
import { authenticator } from "~/utils/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  // Google’a redirect et, callback’te cookie’yi commit etsin
  return authenticator.authenticate("google", request, {
    successRedirect: "/callback",
    failureRedirect: "/login",
  });
};
