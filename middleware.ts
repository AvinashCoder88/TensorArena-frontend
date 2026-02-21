import { withAuth } from "next-auth/middleware"

export default withAuth({
    pages: {
        signIn: "/login",
    },
})

export const config = {
    matcher: [
        "/payment/:path*",
        "/admin/:path*",
        "/tutor/:path*",
        "/parent/:path*",
    ],
}
