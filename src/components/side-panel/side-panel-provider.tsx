"use client";

import * as React from "react";

/**
 * SidePanelKey
 *
 * Defines all possible panels that can be opened at a time.
 */
type SidePanelKey = "ecoPin" | "newEco" | "newEcoPrompt" | null;

/**
 * SidePanelContextType
 *
 * Provides state and utility functions for managing app-wide side panels.
 * Only one panel can be open at a time.
 */
type SidePanelContextType = {
    /** The key of the currently open panel (or null if none is open) */
    currentPanel: SidePanelKey;

    /**
     * Open a specific panel.
     * Automatically closes any currently open panel first.
     * If the same panel is already open, this will leave it open (no toggle).
     */
    openPanel: (panel: Exclude<SidePanelKey, null>) => void;

    /** Closes all panels (resets currentPanel to null) */
    closeAllPanels: () => void;

    /** Returns true if the specified panel is currently open */
    isPanelOpen: (panel: Exclude<SidePanelKey, null>) => boolean;
};

export const SidePanelContext = React.createContext<SidePanelContextType | null>(null);

/**
 * SidePanelProvider
 *
 * A global provider that manages side panel visibility throughout the app.
 * Ensures only one panel can be open at a time, and exposes helper functions
 * to open, close, and check panel state.
 *
 * Example usage:
 *
 * ```tsx
 * <SidePanelProvider>
 *   <App />
 * </SidePanelProvider>
 *
 * // inside a component:
 * const { openPanel, closeAllPanels, isPanelOpen } = useSidePanel();
 * openPanel("newEco");
 * ```
 */
export const SidePanelProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentPanel, setCurrentPanel] = React.useState<SidePanelKey>(null);

    const openPanel = (panel: Exclude<SidePanelKey, null>) => {
        // Close other panels first if another one is open
        if (currentPanel && currentPanel !== panel) {
            closeAllPanels();
        }
        // Set the requested panel as active
        setCurrentPanel(panel);
    };

    const closeAllPanels = () => {
        setCurrentPanel(null);
    };

    const isPanelOpen = (panel: Exclude<SidePanelKey, null>) => currentPanel === panel;

    const providerValue: SidePanelContextType = {
        currentPanel,
        openPanel,
        closeAllPanels,
        isPanelOpen,
    };

    return (
        <SidePanelContext.Provider value={providerValue}>
            {children}
        </SidePanelContext.Provider>
    );
};
