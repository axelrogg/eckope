"use client";

import { useEffect, useRef, useState } from "react";

import { Search } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { KeyboardKey } from "@/components/keyboard/keyboard-key";
import { useHotkeys, useMap, useUserPlatform } from "@/hooks";

const formSchema = z.object({
    query: z.string().min(1).max(255),
});

export const MapSearchBar = () => {
    const { setSearchQuery, setLocation } = useMap();
    const userPlatform = useUserPlatform();
    const queryFormFieldRef = useRef<HTMLInputElement | null>(null);
    const [isFocused, setIsFocused] = useState(false);

    useHotkeys({
        "Ctrl+K": () => {
            form.setFocus("query");
            setIsFocused(true);
        },
        Escape: () => {
            queryFormFieldRef.current?.blur();
            setIsFocused(false);
        },
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            query: "",
        },
    });

    useEffect(() => form.setFocus("query"), [form]);

    async function onSubmit({ query }: z.infer<typeof formSchema>) {
        setSearchQuery(query);
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`
            );
            if (!response.ok) {
                console.error(response);
            }
            const data = (await response.json()) as MapLocationSearchResponse[];
            console.log("search query result", data);

            const firstResult = data[0];
            if (firstResult) {
                if (
                    firstResult.lat &&
                    firstResult.lon &&
                    !isNaN(Number(firstResult.lat)) &&
                    !isNaN(Number(firstResult.lon))
                ) {
                    setLocation({
                        lat: Number(firstResult.lat),
                        lng: Number(firstResult.lon),
                    });
                }
            }
        } catch (error) {
            console.error(error);
        }
    }

    function handleSearchIconClick() {
        if (form.getValues("query") === "") {
            form.setFocus("query");
            return;
        }
        onSubmit({ query: form.getValues("query") });
    }

    return (
        <div
            className={`bg-foreground absolute z-40 flex w-1/3 flex-row items-center rounded-lg px-3 py-2 shadow-lg transition-all duration-500 ${
                isFocused
                    ? "bottom-1/2 left-1/4 translate-y-1/2 sm:left-1/3"
                    : "bottom-[12.5%] left-1/4 sm:left-1/3"
            }`}
        >
            <Form {...form}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Search
                            className="text-primary-foreground cursor-pointer"
                            size={20}
                            onClick={handleSearchIconClick}
                        />
                    </TooltipTrigger>
                    <TooltipContent>Busca un lugar</TooltipContent>
                </Tooltip>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                    <FormField
                        control={form.control}
                        name="query"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="text"
                                        placeholder="¿Dónde ocurrió?"
                                        className="shadow-none"
                                        ref={(el) => {
                                            field.ref(el);
                                            queryFormFieldRef.current = el;
                                        }}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </form>
            </Form>
            <div className="flex flex-row space-x-2">
                <KeyboardKey>{userPlatform === "macos" ? "Cmd" : "Ctrl"}</KeyboardKey>
                <KeyboardKey>K</KeyboardKey>
            </div>
        </div>
    );
};
