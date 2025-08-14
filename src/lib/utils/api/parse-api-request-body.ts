import { NextAuthRequest } from "next-auth";
import { NextRequest } from "next/server";

export async function parseApiRequestBody(req: NextRequest | NextAuthRequest) {
    try {
        const body = await req.json();
        return {
            data: body,
            error: null,
        };
    } catch (error) {
        return {
            data: null,
            error: error,
        };
    }
}
