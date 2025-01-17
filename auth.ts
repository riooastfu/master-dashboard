import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import { LoginSchema } from "@/schemas";
import { setCookie } from "cookies-next";

import { AuthOptions, getServerSession } from "next-auth";
import { cookies } from "next/headers";

const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {},
            async authorize(credentials) {

                const validatedFields = LoginSchema.safeParse(credentials);

                if (!validatedFields.success) {
                    return null
                }

                const { username, password } = validatedFields.data
                try {
                    const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/login`, {
                        username,
                        password,
                    });

                    if (res.status === 200) {
                        const { id, employid, username, perusahaanId, estateId, divisiId, roleId, role, token } = res.data;
                        const user = { id, employid, username, perusahaanId, estateId, divisiId, roleId, role, token };
                        return user;
                    }
                } catch (error: any) {
                    // Customize error message based on the API response
                    throw new Error(error.response?.data?.msg || "Invalid Credentials!");
                }

                return null
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.user = user

                await cookies().set('jwt', user.token);
            }
            return token;
        },
        async session({ session, token }) {
            session.user = token.user
            return session;
        },

    },
    secret: process.env.NEXTAUTH_SECRET,
    session: { strategy: 'jwt' },
    pages: {
        signIn: "/gis",
        error: "/auth/error"
    },
}


const getSession = () => getServerSession(authOptions)

export { authOptions, getSession }