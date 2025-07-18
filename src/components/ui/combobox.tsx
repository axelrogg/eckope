"use client";

import * as React from "react";

import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";

import { cn } from "@/lib/utils/cn";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface ComboboxOption {
    value: string;
    label: string;
}

interface ComboboxProps {
    placeholder: string;
    options: ComboboxOption[];
    setOption: (value: string) => void;
    selectedOption: string;
    className?: string;
}

export const ComboBox = ({
    options,
    placeholder,
    setOption,
    selectedOption,
    className,
}: ComboboxProps) => {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState(selectedOption);

    React.useEffect(() => {
        setValue(selectedOption);
    }, [selectedOption]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        "h-full w-[250px] justify-between px-3 py-2 text-left break-words whitespace-normal",
                        value
                            ? "bg-background text-foreground"
                            : "bg-foreground text-background",
                        className
                    )}
                >
                    {value
                        ? options.find((opt) => opt.value === value)?.label
                        : placeholder}
                    <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[250px] p-0">
                <Command>
                    <CommandInput placeholder={placeholder} />
                    <ScrollArea className="h-66">
                        <CommandEmpty>No hay resultados</CommandEmpty>

                        <CommandGroup>
                            {options.map((opt) => (
                                <CommandItem
                                    key={opt.value}
                                    value={opt.value}
                                    onSelect={(currentValue) => {
                                        setValue(
                                            currentValue === value ? "" : currentValue
                                        );
                                        setOption(
                                            currentValue === value ? "" : currentValue
                                        );
                                        setOpen(false);
                                    }}
                                >
                                    <CheckIcon
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === opt.value
                                                ? "opacity-100"
                                                : "opacity-0"
                                        )}
                                    />
                                    {opt.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </ScrollArea>
                </Command>
            </PopoverContent>
        </Popover>
    );
};
