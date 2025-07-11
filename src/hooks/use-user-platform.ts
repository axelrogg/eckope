"use client";

export function useUserPlatform(): UserPlatform {
    const ua = navigator.userAgent;

    if (/Macintosh|MacIntel|MacPPC|Mac68K/i.test(ua)) {
        return "macos";
    } else if (/Win32|Win64|Windows|WinCE/i.test(ua)) {
        return "windows";
    } else if (/Linux|X11/i.test(ua)) {
        return "linux";
    } else {
        return "unknown";
    }
}
