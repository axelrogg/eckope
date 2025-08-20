"use client";

import { AnimatePresence, motion } from "motion/react";
import { ComboBox, ComboboxOption } from "@/components/ui/combobox";

interface AnimatedComboboxProps {
    show: boolean;
    placeholder: string;
    options: ComboboxOption[];
    selectedOption: string;
    setOption: (value: string) => void;
}

export const AnimatedCombobox = ({
    show,
    placeholder,
    options,
    selectedOption,
    setOption,
}: AnimatedComboboxProps) => {
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="flex items-center"
                >
                    <ComboBox
                        placeholder={placeholder}
                        options={options}
                        setOption={setOption}
                        selectedOption={selectedOption}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
};
