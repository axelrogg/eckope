"use client";

import * as React from "react";
import { SidePanelContext } from "@/components/side-panel/side-panel-provider";

/**
 * useSidePanel
 *
 * A convenience hook for accessing the SidePanelContext.
 * This hook wraps React's `useContext`. If called outside of a `SidePanelProvider`, it will
 * throw an explicit error.
 *
 * Usage:
 * ```tsx
 * const { openPanel, closeAllPanels, isPanelOpen } = useSidePanel();
 * openPanel("newEco");
 * ```
 *
 * Make sure your component is rendered within a `SidePanelProvider`:
 * @see {@link "@/components/side-panel/side-panel-provider"}
 */
export const useSidePanel = () => {
    const ctx = React.useContext(SidePanelContext);
    if (!ctx) throw new Error("useSidePanel must be used within SidePanelProvider");
    return ctx;
};
