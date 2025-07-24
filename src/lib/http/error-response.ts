import { NextResponse } from "next/server";
import { HttpErrorResponseOptions } from "@/types/http-error-response-options";

export function httpErrorResponse(
    {
        type = "about:blank",
        title,
        status,
        detail,
        errors,
        instance,
    }: HttpErrorResponseOptions,
    init: ResponseInit = {}
) {
    const payload = {
        type,
        title,
        status,
        detail,
        errors,
        instance,
    };

    return NextResponse.json(payload, {
        ...init,
        status,
        headers: {
            "Content-Type": "application/problem+json",
            ...(init.headers || {}),
        },
    });
}
