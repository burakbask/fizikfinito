import { ActionFunction, redirect } from "@remix-run/node";
import { authenticator } from "~/utils/auth.server";

export let action: ActionFunction = async ({ request }) => {
  return authenticator.logout(request, { redirectTo: "/" });
};
