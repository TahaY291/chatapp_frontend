import { NextRequest , NextResponse } from "next/server";

const protectedRoutes  = ['/chats', '/profile' , "/settings",]
const authRoutes = ["/login", "/register"]

const verifiedOnlyRoutes = ["/chats", "/profile", "/settings"]

export function proxy (req : NextRequest) {
    const {pathname} = req.nextUrl
    const accessToken = req.cookies.get("accessToken")?.value
    const isVerified = req.cookies.get('isVerified')?.value
    const email = req.cookies.get('email')?.value
    console.log("Proxy middleware:", { email })

//   if (!accessToken && protectedRoutes.some(r => pathname.startsWith(r))) {
//         return NextResponse.redirect(new URL("/login", req.url))
//     }

// if (accessToken &&  isVerified !== "true" && verifiedOnlyRoutes.some(r => pathname.startsWith(r))) {
//     const url = new URL("/verify-otp", req.url)
//     if (email) url.searchParams.set("email", email)
//     return NextResponse.redirect(url)
// }
//       if (accessToken && isVerified === "true"  && authRoutes.some(r => pathname.startsWith(r))) {
//         return NextResponse.redirect(new URL("/chats", req.url))
//     }
     return NextResponse.next()
}
export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)" ]
}