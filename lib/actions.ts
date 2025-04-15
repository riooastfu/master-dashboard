import z from "zod";
import axios from "axios";
import { LoginSchema } from "@/schemas";
import { signIn, signOut } from "next-auth/react";

export const login = async (values: z.infer<typeof LoginSchema>) => {
    const validatedFields = LoginSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields!" }
    }
    const { username, password } = validatedFields.data;
    try {
        const result = await signIn("credentials", {
            username,
            password,
            redirect: false, // Prevent automatic redirection
        });

        if (result?.error) {
            return { error: result.error }; // Pass the error to the UI
        }

        return { success: "Successfully logged in" };
    }
    catch (error) {
        return { error: "An Error Occured" }
    }
};

export const logout = async () => {

    await signOut({ callbackUrl: '/' });

    await axios.post("/api/signout")

    await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/logout`)

    return { success: "Successfully logout" }
}