"use client";

import { useEffect, useRef } from "react";

import { Search } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useMap } from "@/hooks";

const formSchema = z.object({
    query: z.string().min(1).max(255),
});

export const MapSearchBar = () => {
    const { setSearchQuery, setLocation } = useMap();
    const queryFormFieldRef = useRef<HTMLInputElement | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            query: "",
        },
    });

    useEffect(() => form.setFocus("query"), [form]);

    function handleSearchIconClick() {
        if (form.getValues("query") === "") {
            form.setFocus("query");
            return;
        }
        onSubmit({ query: form.getValues("query") });
    }

    async function onSubmit({ query }: z.infer<typeof formSchema>) {
        setSearchQuery(query);
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?street=${encodeURIComponent(query)}&country=Peru&city=Lima&format=json&limit=1`
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

    return (
        <Form {...form}>
            <div className="bg-foreground flex w-full flex-row items-center rounded-lg">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Search
                            className="text-background cursor-pointer"
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
            </div>
        </Form>
    );
};
