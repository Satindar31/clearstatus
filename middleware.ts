import { NextResponse, NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  let subdomain = null;
  try {
    const afterDoubleSlash = req.url.split("//")[1];
    if (afterDoubleSlash) {
      subdomain = afterDoubleSlash.split(".")[0];
    } else {
      // Handle URLs like 'localhost:3000' (no //)
      subdomain = req.url.split(".")[0].replace(/^https?:\/?\/?/, "").split(":")[0];
    }
  } catch (e) {
    subdomain = null;
  }
  if (subdomain === "www" || subdomain === "status") {
    return NextResponse.next();
  }
  const newUrl = `status/${subdomain}`;
  console.log(newUrl);
  return NextResponse.redirect(new URL(process.env.APP_URL!, newUrl));
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
