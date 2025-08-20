"use client";

import * as React from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Search } from "lucide-react";

import { MapSearchAutocomplete } from "@/components/map/tool-bar/search/map-search-autocomplete";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useMap } from "@/hooks";
import { MapLocationSearchResponse } from "@/types/map";

const formSchema = z.object({
    query: z.string().min(1).max(255),
});

export const MapSearchBar = () => {
    const { setLocation, setPendingPin } = useMap();

    const [suggestions, setSuggestions] = React.useState<MapLocationSearchResponse[]>([]);
    const [loadingSuggestions, setLoadingSuggestions] = React.useState(false);
    const [showSuggestions, setShowSuggestions] = React.useState(true);

    const debounceRef = React.useRef<NodeJS.Timeout | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            query: "",
        },
    });

    form.setFocus("query");

    const fetchSuggestionsDebounced = React.useCallback((query: string) => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            searchAndSetSuggestions(query);
        }, 300);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        form.setValue("query", newValue);

        if (newValue.length < 3) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        fetchSuggestionsDebounced(newValue);
    };

    async function searchAndSetSuggestions(query: string) {
        try {
            setLoadingSuggestions(true);
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_NOMINATIM_URL}/search?q=${encodeURIComponent(query)}&format=json`
            );

            if (response.ok) {
                const results = (await response.json()) as MapLocationSearchResponse[];
                const filtered = results.filter(
                    (r) =>
                        r.display_name.toLowerCase().includes("lima") ||
                        r.display_name.toLowerCase().includes("callao")
                );
                setSuggestions(filtered);
                setShowSuggestions(true);
            } else {
                setSuggestions([]);
            }
        } catch (error) {
            console.error("search error", error);
            setSuggestions([]);
        } finally {
            setLoadingSuggestions(false);
        }
    }

    function handleSearchIconClick() {
        if (form.getValues("query") === "") {
            form.setFocus("query");
            return;
        }
        onSubmit({ query: form.getValues("query") });
    }

    async function onSubmit({ query }: z.infer<typeof formSchema>) {
        setShowSuggestions(false);
        searchAndSetSuggestions(query);
    }

    const handleSelectSuggestion = (suggestion: MapLocationSearchResponse) => {
        form.setValue("query", suggestion.display_name);
        setShowSuggestions(false);
        if (
            suggestion.lat &&
            suggestion.lon &&
            !isNaN(Number(suggestion.lat)) &&
            !isNaN(Number(suggestion.lon))
        ) {
            setLocation({
                lat: Number(suggestion.lat),
                lng: Number(suggestion.lon),
            });
            setPendingPin({
                lat: Number(suggestion.lat),
                lng: Number(suggestion.lon),
            });
        }
    };

    return (
        <div className="relative w-full">
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
                                            autoComplete="off"
                                            onChange={handleChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </form>
                </div>
            </Form>
            {showSuggestions && (
                <MapSearchAutocomplete
                    suggestions={suggestions}
                    onSelect={handleSelectSuggestion}
                    loading={loadingSuggestions}
                    query={form.getValues("query")}
                />
            )}
        </div>
    );
};
