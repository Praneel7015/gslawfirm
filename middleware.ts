import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: [
    // Match everything except API, _next, _vercel, and files (anything with a dot).
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
