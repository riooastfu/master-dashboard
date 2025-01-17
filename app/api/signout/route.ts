import { setCookie } from "cookies-next";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(res: Response) {
    cookies().delete('jwt');

    return NextResponse.json({ success: "logged out" });
}