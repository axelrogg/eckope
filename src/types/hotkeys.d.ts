type HotkeyHandler = (event: KeyboardEvent) => void;

type Hotkey = {
    keys: string[];
    handler: HotkeyHandler;
};
