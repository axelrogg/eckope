"use client";

import * as React from "react";

import z from "zod";
import { AnimatePresence, motion } from "motion/react";
import { Map, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Switch } from "@/components/ui/switch";
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
import { NominatimResult } from "@/types/nominatim";

const CATEGORY_OPTS: { label: string; value: string }[] = [
    {
        label: "Infraestructura",
        value: "infrastructure",
    },
    {
        label: "Seguridad",
        value: "security",
    },
    {
        label: "Salud",
        value: "health",
    },
    {
        label: "Educación",
        value: "education",
    },
    {
        label: "Corrupción",
        value: "corruption",
    },
    {
        label: "Medio ambiente",
        value: "environment",
    },
    {
        label: "Otro",
        value: "other",
    },
];

const formSchema = z
    .object({
        title: z
            .string()
            .min(4, "El título es demasiado corto.")
            .max(300, "El título es demasiado largo."),
        description: z
            .string()
            .min(10, "Por favor, brinda más contexto")
            .max(40000, "La descripción es demasiado larga."),
        category: z.string(),
        customCategory: z.string().optional(),
        location: z.object({
            lat: z.number(),
            lng: z.number(),
        }),
        email: z.email().optional(),
        alias: z.string().max(100, "El alias es demasiado largo.").optional(),
        anonymous: z.boolean().optional(),
    })
    .check((ctx) => {
        if (
            ctx.value.category === "other" &&
            (!ctx.value.customCategory || ctx.value.customCategory.trim() === "")
        ) {
            ctx.issues.push({
                code: "custom",
                path: ["customCategory"],
                message: "Por favor, indica la categoría",
                input: ctx.value,
            });
        }
        if (ctx.value.location.lat === 999 || ctx.value.location.lng === 999) {
            ctx.issues.push({
                code: "custom",
                message: "Por favor selecciona una ubicación válida",
                path: ["location"],
                input: ctx.value,
            });
        }
    });

type SchemaType = z.infer<typeof formSchema>;

export const NewEcoSidePanel = () => {
    const { isPanelOpen, closeAllPanels } = useSidePanel();
    const { pendingPin } = useMap();
    const [locationResult, setLocationResult] = React.useState<NominatimResult | null>(
        null
    );

    React.useEffect(() => {
        const fetchAddressFromCoordinates = async (lat: number, lng: number) => {
            const result = await fetch(
                `${process.env.NEXT_PUBLIC_NOMINATIM_URL}/reverse?lat=${lat}&lon=${lng}&format=json`
            );
            if (!result.ok) {
                console.error("not okay");
                return;
            }
            const body = (await result.json()) as NominatimResult;
            console.log(body);
            setLocationResult(body);
        };

        if (pendingPin) {
            fetchAddressFromCoordinates(pendingPin.lat, pendingPin.lng);
        }
    }, [pendingPin]);

    const form = useForm<SchemaType>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            category: "",
            location: {
                lat: 999,
                lng: 999,
            },
            description: "",
            anonymous: false,
            email: "",
            alias: "",
        },
    });

    const selectedCategory = form.watch("category");
    const stayAnonymous = form.watch("anonymous");

    function onSubmit(values: SchemaType) {
        const finalCategory =
            values.category === "other" ? values.customCategory : values.category;

        const submission = {
            ...values,
            category: finalCategory,
            customCategory: undefined, // remove from payload
        };
        console.log("submission", submission);
    }

    return (
        <SidePanel show={isPanelOpen("newEco")}>
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
                    Cuéntanos lo que está pasando. No tengas miedo de ser claro y directo.
                    Cuanto más detalles, mejor.
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
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                                        Usa una frase clara para resumir tu eco. Ejemplo:
                                        “Parque sin alumbrado público”.
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
                                    <FormLabel>Categoría del problema</FormLabel>
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
                                            {CATEGORY_OPTS.map((item, idx) => (
                                                <SelectItem key={idx} value={item.value}>
                                                    {item.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        Ayúdanos a clasificar el problema para entenderlo
                                        mejor.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <AnimatePresence>
                            {selectedCategory === "other" && (
                                <motion.div
                                    key="customCategory"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="overflow-hidden"
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
                                                    Describe brevemente la categoría del
                                                    problema.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <AnimatePresence>
                            {!stayAnonymous && (
                                <motion.div
                                    key="contactFields"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{
                                        opacity: 1,
                                        height: "auto",
                                    }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{
                                        duration: 0.3,
                                        ease: "easeInOut",
                                    }}
                                    className="space-y-8 overflow-hidden"
                                >
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Correo electrónico (opcional)
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="tucorreo@ejemplo.com"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Si podemos contactarte, es más fácil
                                                    dar seguimiento. Sin correo, podríamos
                                                    tener que descartar tu eco.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="alias"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Alias (opcional)</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Tu apodo o nombre público"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Esto nos permite identificar tus
                                                    aportes sin revelar tu identidad.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>¿Qué está pasando?</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Describe lo que sucede, cómo afecta a tu comunidad, y cualquier otro dato relevante"
                                            className="bg-foreground text-background h-40 resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Sé lo más específico posible: ¿dónde ocurre?,
                                        ¿desde cuándo?, ¿quiénes están afectados?
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="anonymous"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">
                                            Permanecer anónimo
                                        </FormLabel>
                                        <FormDescription>
                                            Si activas esta opción, tu nombre no se
                                            mostrará públicamente en este eco.
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <div className="space-x-4">
                            <Button type="submit">Haz sonar tu eco</Button>
                            <Button
                                variant="destructive"
                                onClick={() => closeAllPanels()}
                            >
                                Descartar
                            </Button>
                        </div>
                    </form>
                </Form>
            </SidePanelContent>
        </SidePanel>
    );
};
