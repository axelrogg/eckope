"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { LoaderCircle, Send } from "lucide-react";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { newEcoFormSchema, NewEcoFormSchemaType } from "@/lib/schemas/new-eco";
import { postEco } from "@/lib/api/ecos";
import { User } from "@/types/auth";
import { Eco } from "@/types/eco";

interface EcoPinPanelNewEcoFormProps {
    user: User;
    ecoPinId: string;
}

export const EcoPinPanelNewEcoForm = ({ user, ecoPinId }: EcoPinPanelNewEcoFormProps) => {
    const queryClient = useQueryClient();
    const form = useForm<NewEcoFormSchemaType>({
        resolver: zodResolver(newEcoFormSchema),
        defaultValues: {
            content: "",
            userId: user.id,
            ecoPinId,
        },
    });

    React.useEffect(() => {
        form.reset({
            content: "",
            userId: user.id,
            ecoPinId,
        });
    }, [ecoPinId, form, user]);

    const newEco = useMutation({
        mutationFn: (values: NewEcoFormSchemaType) => postEco(values),
        onMutate: () => {},
        onError: (err) => {
            console.error(err);
            toast.error("Uy, algo pasó", {
                description: "Probamos de nuevo",
            });
        },
        onSuccess: (data) => {
            queryClient.setQueryData<Eco[]>(["eco-list", ecoPinId], (old) => {
                if (!old) return [];
                return old ? [data, ...old] : [data];
            });

            form.reset({ content: "", userId: user.id, ecoPinId });
        },
    });

    const reply = form.watch("content");

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit((values) => newEco.mutate(values))}
                className="flex w-full flex-row justify-between space-x-3 rounded-lg"
            >
                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem className="flex-1">
                            <FormControl>
                                <Input
                                    placeholder="Responde con tu eco"
                                    {...field}
                                    disabled={newEco.isPending}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    variant="ghost"
                    type="submit"
                    disabled={newEco.isPending || !reply || reply.length === 0}
                >
                    {newEco.isPending ? (
                        <LoaderCircle className="animate-spin" />
                    ) : (
                        <Send />
                    )}
                </Button>
            </form>
        </Form>
    );
};
