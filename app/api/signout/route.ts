import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
    cookies().delete('jwt');

    return NextResponse.json({ success: "logged out" });
}