"use client";

import * as React from "react";

import z from "zod";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";

import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

import { useMap } from "@/hooks";
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
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { Switch } from "../ui/switch";

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

const formSchema = z.object({
    title: z
        .string()
        .min(4, "El título es demasiado corto.")
        .max(300, "El título es demasiado largo."),
    description: z
        .string()
        .min(10, "Por favor, brinda más contexto")
        .max(40000, "La descripción es demasiado larga."),
    category: z.string(),
    location: z.object({
        lat: z.number().min(-90).max(90),
        lng: z.number().min(-180).max(180),
    }),
    email: z.email().optional(),
    alias: z.string().max(100, "El alias es demasiado largo.").optional(),
    anonymous: z.boolean().optional(),
});

type SchemaType = z.infer<typeof formSchema>;

export const NewEcoSidePanel = () => {
    const { showNewEcoSidePanel, setShowNewEcoSidePanel } = useMap();

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

    const stayAnonymous = form.watch("anonymous");

    React.useEffect(() => {
        if (showNewEcoSidePanel) {
            document.body.style.overflow = "hidden";
        }
    }, [showNewEcoSidePanel]);

    const handleAnimationComplete = () => {
        if (!showNewEcoSidePanel) {
            document.body.style.overflow = "";
        }
    };

    function onSubmit() {}

    return (
        <AnimatePresence>
            {showNewEcoSidePanel && (
                <motion.div
                    className="absolute top-0 right-0 z-50 h-svh bg-transparent p-2 lg:w-120"
                    role="dialog"
                    aria-modal="true"
                    initial={{ x: "100%", opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: "100%", opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    onAnimationComplete={handleAnimationComplete}
                >
                    <ScrollArea className="h-full rounded-xl">
                        <Card className="h-full">
                            <CardHeader>
                                <CardTitle className="text-xl">
                                    ¿Qué eco quieres hacer sonar?
                                </CardTitle>
                                <CardDescription className="flex flex-col space-y-2">
                                    Cuéntanos lo que está pasando. No tengas miedo de ser
                                    claro y directo. Cuanto más detalles, mejor.
                                </CardDescription>
                                <CardAction>
                                    <Button
                                        aria-label="Cerrar formulario"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setShowNewEcoSidePanel(false)}
                                    >
                                        <X />
                                    </Button>
                                </CardAction>
                            </CardHeader>
                            <CardContent className="space-y-7 text-sm">
                                <Form {...form}>
                                    <form
                                        onSubmit={form.handleSubmit(onSubmit)}
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
                                                        Usa una frase clara para resumir
                                                        tu eco. Ejemplo: “Parque sin
                                                        alumbrado público”.
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
                                                        Ayúdanos a clasificar el problema
                                                        para entenderlo mejor.
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
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
                                                                    Correo electrónico
                                                                    (opcional)
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder="tucorreo@ejemplo.com"
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                                <FormDescription>
                                                                    Si podemos
                                                                    contactarte, es más
                                                                    fácil dar seguimiento.
                                                                    Sin correo, podríamos
                                                                    tener que descartar tu
                                                                    eco.
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
                                                                <FormLabel>
                                                                    Alias (opcional)
                                                                </FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder="Tu apodo o nombre público"
                                                                        {...field}
                                                                    />
                                                                </FormControl>
                                                                <FormDescription>
                                                                    Esto nos permite
                                                                    identificar tus
                                                                    aportes sin revelar tu
                                                                    identidad.
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
                                                    <FormLabel>
                                                        ¿Qué está pasando?
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="Describe lo que sucede, cómo afecta a tu comunidad, y cualquier otro dato relevante"
                                                            className="bg-foreground text-background h-40 resize-none"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Sé lo más específico posible:
                                                        ¿dónde ocurre?, ¿desde cuándo?,
                                                        ¿quiénes están afectados?
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
                                                            Si activas esta opción, tu
                                                            nombre no se mostrará
                                                            públicamente en este eco.
                                                        </FormDescription>
                                                    </div>
                                                    <FormControl>
                                                        <Switch
                                                            checked={field.value}
                                                            onCheckedChange={
                                                                field.onChange
                                                            }
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <div className="space-x-4">
                                            <Button type="submit">
                                                Haz sonar tu eco
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                onClick={() =>
                                                    setShowNewEcoSidePanel(false)
                                                }
                                            >
                                                Descartar
                                            </Button>
                                        </div>
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>
                    </ScrollArea>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
