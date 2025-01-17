"use client"

import { useRouter } from "next/navigation";

export default function ErrorPage() {
    const router = useRouter();
    return (
        <div>
            <h1>Authentication Error</h1>
            <a href="/">Go back to login</a>
        </div>
    );
}