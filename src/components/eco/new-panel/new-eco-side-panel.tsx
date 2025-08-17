"use client";

import * as React from "react";
import Link from "next/link";

import { User } from "next-auth";
import { AnimatePresence, motion } from "motion/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Map, RotateCcw, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    SidePanel,
    SidePanelAction,
    SidePanelContent,
    SidePanelDescription,
    SidePanelHeader,
    SidePanelTitle,
} from "@/components/side-panel/side-panel";
import { useSidePanel } from "@/hooks/use-side-panel";
import { useMap } from "@/hooks";
import { SelectableFormObjects } from "@/types/forms";
import {
    newEcoPinFormDefaultValues,
    newEcoPinFormSchema,
    NewEcoPinFormSchemaType,
} from "@/lib/schemas/new-eco-pin";
import { EcoPinCategory, EcoPinSeverity } from "@/types/eco";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchAddressFromCoordinates } from "@/lib/api/map";
import { createNewEcoPin } from "@/lib/api/eco-pins";
import { NewEcoPinPanelHeaderSkeleton } from "./skeletons";
import { CardAction } from "@/components/ui/card";

const SEVERITY_OPTS: SelectableFormObjects<EcoPinSeverity> = [
    { label: "Baja", value: "low" },
    { label: "Media", value: "medium" },
    { label: "Alta", value: "high" },
    { label: "Crítica", value: "critical" },
];

const CATEGORY_OPTS: SelectableFormObjects<EcoPinCategory> = [
    { label: "Infraestructura", value: "infrastructure" },
    { label: "Seguridad", value: "security" },
    { label: "Salud", value: "health" },
    { label: "Educación", value: "education" },
    { label: "Corrupción", value: "corruption" },
    { label: "Medio ambiente", value: "environment" },
    { label: "Otro", value: "other" },
];

interface NewEcoSidePanelProps {
    user: User | null;
}

export const NewEcoSidePanel = ({ user }: NewEcoSidePanelProps) => {
    const { isPanelOpen, closeAllPanels } = useSidePanel();
    const { pendingPin, setEcoPins } = useMap();

    const {
        data: locationResult,
        isLoading: locationIsLoading,
        isError: locationIsError,
        refetch: locationRefetch,
    } = useQuery({
        queryKey: ["reverse-geocode", pendingPin?.lat, pendingPin?.lng],
        queryFn: () => fetchAddressFromCoordinates(pendingPin!.lat, pendingPin!.lng),
        enabled: !!pendingPin, // only run when we have a pin
    });

    const newEco = useMutation({
        mutationFn: (values: NewEcoPinFormSchemaType) => createNewEcoPin(values),
        onSuccess: (data) => {
            setEcoPins((prev) => [...prev, data]);
            onClosePanel();
        },
        onError: (error) => {
            console.error("Error creating eco pin:", error);
        },
    });

    const form = useForm<NewEcoPinFormSchemaType>({
        resolver: zodResolver(newEcoPinFormSchema),
        defaultValues: newEcoPinFormDefaultValues(user),
    });

    const selectedCategory = form.watch("category");

    React.useEffect(() => {
        if (pendingPin) {
            form.reset({
                ...form.getValues(),
                location: {
                    lat: pendingPin.lat,
                    lng: pendingPin.lng,
                },
            });
        }
    }, [pendingPin, form]);

    function onClosePanel() {
        form.reset(newEcoPinFormDefaultValues(user), { keepErrors: false });
        closeAllPanels();
    }

    return (
        <SidePanel show={isPanelOpen("newEco")}>
            {locationIsLoading && (
                <React.Fragment>
                    <NewEcoPinPanelHeaderSkeleton />
                    <SidePanelContent className="flex w-full items-center justify-center">
                        <LoaderCircle className="animate-spin" />
                    </SidePanelContent>
                </React.Fragment>
            )}
            {!locationIsLoading && locationIsError && (
                <SidePanelContent className="space-y-3">
                    <div className="bg-destructive/50 flex flex-col items-center space-y-2 rounded-lg border p-3">
                        <span className="text-sm">
                            Uy, no pudimos encontrar esta dirección
                        </span>
                        <Button onClick={() => locationRefetch()}>
                            <RotateCcw />
                            Reintentar
                        </Button>
                    </div>
                    <CardAction>
                        <Button
                            aria-label="Cerrar el panel de eco"
                            variant="ghost"
                            size="sm"
                            onClick={closeAllPanels}
                        >
                            <X />
                        </Button>
                    </CardAction>
                </SidePanelContent>
            )}
            {!locationIsLoading && !locationIsError && (
                <React.Fragment>
                    <SidePanelHeader>
                        <SidePanelTitle className="text-xl">
                            ¿Qué eco quieres hacer sonar?
                            {locationResult?.display_name && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="text-muted-foreground my-2 items-center gap-3 rounded-lg border p-3 text-sm"
                                >
                                    <div className="group flex flex-row gap-3 text-sm">
                                        <div className="flex min-w-[24px] items-center justify-center">
                                            <Map className="group-hover:animate-bounce" />
                                        </div>
                                        <span className="leading-snug break-words">
                                            {locationResult?.display_name}
                                        </span>
                                    </div>
                                </motion.div>
                            )}
                        </SidePanelTitle>
                        <SidePanelDescription className="flex flex-col space-y-2">
                            Cuéntanos lo que está pasando. No tengas miedo de ser claro y
                            directo. Cuanto más detalles, mejor.
                        </SidePanelDescription>
                        <SidePanelAction>
                            <Button
                                aria-label="Cerrar formulario"
                                variant="ghost"
                                size="sm"
                                onClick={() => closeAllPanels()}
                            >
                                <X />
                            </Button>
                        </SidePanelAction>
                    </SidePanelHeader>
                    <SidePanelContent>
                        {user ? (
                            <Form {...form}>
                                <form
                                    onSubmit={form.handleSubmit((values) =>
                                        newEco.mutate(values)
                                    )}
                                    className="space-y-8"
                                >
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Título del eco</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Un título breve y directo"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Usa una frase clara para resumir tu
                                                    eco. Ejemplo: “Parque sin alumbrado
                                                    público”.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="category"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Categoría del problema
                                                </FormLabel>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Selecciona una categoría" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {CATEGORY_OPTS.map(
                                                            (item, idx) => (
                                                                <SelectItem
                                                                    key={idx}
                                                                    value={item.value}
                                                                >
                                                                    {item.label}
                                                                </SelectItem>
                                                            )
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                                <FormDescription>
                                                    Ayúdanos a clasificar el problema para
                                                    entenderlo mejor.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    {selectedCategory === "other" && (
                                        <motion.div
                                            key="customCategory"
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{
                                                duration: 0.3,
                                                ease: "easeInOut",
                                            }}
                                        >
                                            <FormField
                                                control={form.control}
                                                name="customCategory"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Especifica la categoría
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Ingresa la categoría"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Describe brevemente la
                                                            categoría del problema.
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </motion.div>
                                    )}
                                    <FormField
                                        control={form.control}
                                        name="severity"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Gravedad del problema
                                                </FormLabel>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Selecciona la severidad" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {SEVERITY_OPTS.map(
                                                            (item, idx) => (
                                                                <SelectItem
                                                                    key={idx}
                                                                    value={item.value}
                                                                >
                                                                    {item.label}
                                                                </SelectItem>
                                                            )
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                                <FormDescription>
                                                    Indica cuán grave consideras este
                                                    problema. Esto nos ayuda a priorizar
                                                    su atención.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <AnimatePresence></AnimatePresence>
                                    <FormField
                                        control={form.control}
                                        name="content"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>¿Qué está pasando?</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Describe lo que sucede, cómo afecta a tu comunidad, y cualquier otro dato relevante"
                                                        className="h-40 resize-none"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Sé lo más específico posible: ¿dónde
                                                    ocurre?, ¿desde cuándo?, ¿quiénes
                                                    están afectados?
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="space-x-4">
                                        <Button type="submit">Haz sonar tu eco</Button>
                                        <Button
                                            variant="destructive"
                                            onClick={onClosePanel}
                                        >
                                            Descartar
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        ) : (
                            <Button variant="destructive" asChild className="w-full">
                                <Link href="/auth">
                                    Únete a la conversación iniciando sesión
                                </Link>
                            </Button>
                        )}
                    </SidePanelContent>
                </React.Fragment>
            )}
        </SidePanel>
    );
};
