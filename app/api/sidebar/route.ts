import { getSession } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const session = await getSession();

        return NextResponse.json(session);
    } catch (error) {
        console.log("[SIDEBAR GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}