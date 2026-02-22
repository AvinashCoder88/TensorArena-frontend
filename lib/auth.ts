import { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import bcrypt from "bcryptjs"

import prisma from "@/lib/prisma"

export const authOptions: AuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null
                }

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email
                    }
                })

                if (!user || !user.password) {
                    return null
                }

                let isPasswordValid = false
                if (user.password.startsWith("$2a$") || user.password.startsWith("$2b$") || user.password.startsWith("$2y$")) {
                    isPasswordValid = await bcrypt.compare(credentials.password, user.password)
                } else {
                    isPasswordValid = credentials.password === user.password
                }

                if (!isPasswordValid) {
                    return null
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                }
            }
        })
    ],
    session: {
        strategy: "jwt"
    },
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async session({ session, token }) {
            if (session.user && token.sub) {
                session.user.id = token.sub
                session.user.role = (token.role as string) || "STUDENT"
                // Fetch subscription status and question tracking
                const user = await prisma.user.findUnique({
                    where: { id: token.sub }
                })
                session.user.isSubscribed = user?.isSubscribed || false
                session.user.questionsUsed = user?.questionsUsed || 0
                session.user.freeQuestionLimit = user?.freeQuestionLimit || 5
            }
            return session
        },
        async jwt({ token, user }) {
            if (user) {
                token.sub = user.id
                token.role = (user as any).role || "STUDENT" // eslint-disable-line @typescript-eslint/no-explicit-any
            }
            return token
        }
    }
}
