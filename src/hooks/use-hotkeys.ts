"use client";

import { useEffect } from "react";

function matchHotkey(hotkey: string[], event: KeyboardEvent): boolean {
    const key = event.key.toLowerCase();

    return (
        (!hotkey.includes("ctrl") || event.ctrlKey) &&
        (!hotkey.includes("meta") || event.metaKey) &&
        (!hotkey.includes("shift") || event.shiftKey) &&
        (!hotkey.includes("alt") || event.altKey) &&
        hotkey.includes(key)
    );
}

export function useHotkeys(hotkeys: Record<string, HotkeyHandler>) {
    useEffect(() => {
        const hotkeyList: Hotkey[] = Object.entries(hotkeys).map(
            ([keysCombo, handler]) => ({
                keys: keysCombo.toLowerCase().split("+"),
                handler,
            })
        );

        const onKeyDown = (event: KeyboardEvent) => {
            for (const { keys, handler } of hotkeyList) {
                if (matchHotkey(keys, event)) {
                    event.preventDefault();
                    handler(event);
                    break;
                }
            }
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [hotkeys]);
}
