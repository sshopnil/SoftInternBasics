import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest){
    // return NextResponse.redirect(new URL("/", request.url));

    //conditional redirect
    // if(request.nextUrl.pathname === "/profile"){
    //     return NextResponse.redirect(new URL("/hello", request.url));
    // }

    //interact with cookies
    const response = NextResponse.next();
    const themePref = request.cookies.get("theme");
    if(!themePref){
        response.cookies.set("theme", "dark");
    }

    response.headers.set(
        "custom-header", "custom-value"
    )
    return response;
}

// export const config = {
//     matcher: "/profile"
// }