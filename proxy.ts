import { NextRequest , NextResponse } from "next/server";

const protectedRoutes  = ['/chats', '/profile' , "/settings",]
const authRoutes = ["/login", "/register"]

const verifiedOnlyRoutes = ["/chat", "/profile", "/settings"]

export function proxy (req : NextRequest) {
    const {pathname} = req.nextUrl
    const accessToken = req.cookies.get("accessToken")?.value
    const isVerified = req.cookies.get('isVerified')?.value

//   if (!accessToken && protectedRoutes.some(r => pathname.startsWith(r))) {
//         return NextResponse.redirect(new URL("/login", req.url))
//     }

//       if (accessToken && !isVerified && verifiedOnlyRoutes.some(r => pathname.startsWith(r))) {
//         return NextResponse.redirect(new URL("/verify-otp", req.url))
//     }

//       if (accessToken && isVerified && authRoutes.some(r => pathname.startsWith(r))) {
//         return NextResponse.redirect(new URL("/chats", req.url))
//     }
     return NextResponse.next()
}
export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)" ]
}