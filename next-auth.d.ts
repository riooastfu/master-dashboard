import NextAuth from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string,
            employid: string,
            username: string,
            perusahaanId: string,
            estateId: string,
            divisiId: string,
            roleId: string,
            role: string,
            token: string
        }
    };

    interface User {
        id: string,
        employid: string,
        username: string,
        perusahaanId: string,
        estateId: string,
        divisiId: string,
        roleId: string,
        role: string,
        token: string
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        user: {
            id: string,
            employid: string,
            username: string,
            perusahaanId: string,
            estateId: string,
            divisiId: string,
            roleId: string,
            role: string,
            token: string
        }
    }
}

