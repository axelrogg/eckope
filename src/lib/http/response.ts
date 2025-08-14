import { NextResponse } from "next/server";
import {
    HttpErrorResponseOptions,
    HttpSuccessResponseOptions,
} from "@/types/api/http-response";

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

export function httpSuccessResponse<T>(
    { status = 200, action, data, instance }: HttpSuccessResponseOptions<T>,
    init: ResponseInit = {}
) {
    const payload = {
        status,
        action,
        data,
        instance,
    };

    return NextResponse.json(payload, {
        ...init,
        status,
        headers: {
            "Content-Type": "application/json",
            ...(init.headers || {}),
        },
    });
}
