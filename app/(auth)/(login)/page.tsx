
// import { getSession } from "@/lib/actions";
import { LoginForm } from "@/components/auth/login-form";
import { redirect } from "next/navigation";

const LoginPage = async () => {
    return (
        <main className="flex flex-col h-screen justify-center items-center">
            <div className="w-96">
                <LoginForm />
            </div>
        </main>
    )
}

export default LoginPage;