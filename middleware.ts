import { NextResponse, NextRequest } from "next/server";

/*
 * Copied this from my other project https://github.com/satindar31/openpages
 */

export async function middleware(req: NextRequest) {
  const { hostname, pathname } = req.nextUrl;
  const baseDomain = process.env.APP_URL ?? "localhost";

  // If the URL is simple BASE_URL, allow default behavior
  if (hostname == baseDomain) {
    return NextResponse.next();
  }
  // If not then if the URL is a subdomain like: user.openpages.blog do the following
  else {
    if (hostname.endsWith(baseDomain)) {
      const segments = pathname.split("/");
      // const blogId = segments[segments.length - 1];
      const subdomain = hostname.replace(`.${baseDomain}`, "");
      // Fetch the publication from the subdomain
      // const publication = await findBlogByDomain(subdomain, false);

      // if (publication) {
      //   console.log("publication found");

      // If the URL contains blogId, rewrite to the blog's dynamic route
      //   if (blogId) {
      req.nextUrl.pathname = `/status/${subdomain}`;
      return NextResponse.rewrite(req.nextUrl);
      //   }

      // If no blogId, rewrite to the blog's main page
      //   request.nextUrl.pathname = `/blog/${publication.id}`;
      //   return NextResponse.rewrite(request.nextUrl);
      // }
      // Else return 404;
      //     return NextResponse.rewrite(new URL("/404", request.url));
      //   } else {
      //     // Handle custom domains like: example.com
      //     const blog = await findBlogByDomain(hostname, true);
      //     if (blog) {
      //       // Rewrite to the blog's dynamic route (e.g., `/blog/[id]`)
      //       request.nextUrl.pathname = `/blog/${blog.id}`; // Adjust this to your routing
      //       return NextResponse.rewrite(request.nextUrl);
      //     }

      //     // If no matching blog or domain, allow default behavior or return a 404
      //     return NextResponse.next();
    }
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
