import { authenticator } from "~/utils/auth.server";

export const loader = async ({ request }: { request: Request }) => {
  return authenticator.authenticate("google", request, {
    successRedirect: "/profile", // Redirect here after successful login
    failureRedirect: "/login",  // Redirect here if authentication fails
  });
};
