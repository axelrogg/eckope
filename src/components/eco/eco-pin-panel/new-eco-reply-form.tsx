"use client";

import * as React from "react";

import {
    newEcoReplyFormSchema,
    NewEcoReplyFormSchemaType,
} from "@/lib/schemas/new-eco-reply";
import { User } from "@/types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { postEcoReply } from "@/lib/api/eco-replies";
import { toast } from "sonner";
import { EcoReply } from "@/types/eco";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoaderCircle, Send } from "lucide-react";

interface EcoPinPanelNewEcoReplyFormProps {
    user: User;
    ecoId: string;
}

export const EcoPinPanelNewEcoReplyForm = ({
    user,
    ecoId,
}: EcoPinPanelNewEcoReplyFormProps) => {
    const queryClient = useQueryClient();
    const form = useForm<NewEcoReplyFormSchemaType>({
        resolver: zodResolver(newEcoReplyFormSchema),
        defaultValues: {
            content: "",
            userId: user.id,
            ecoId,
        },
    });

    React.useEffect(() => {
        form.reset({
            content: "",
            userId: user.id,
            ecoId,
        });
    }, [ecoId, form, user]);

    const newReply = useMutation({
        mutationFn: (values: NewEcoReplyFormSchemaType) => postEcoReply(values),
        onError: (err) => {
            console.error(err);
            toast.error("Uy, algo pasó", {
                description: "Probamos de nuevo",
            });
        },
        onSuccess: (data) => {
            queryClient.setQueryData<EcoReply[]>(["eco-reply-list", ecoId], (old) => {
                if (!old) return [];
                return old ? [data, ...old] : [data];
            });
            form.reset({ content: "", userId: user.id, ecoId });
        },
    });

    const reply = form.watch("content");

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit((values) => newReply.mutate(values))}
                className="flex w-full flex-row justify-between space-x-3 rounded-lg"
            >
                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem className="flex-1">
                            <FormControl>
                                <Input
                                    placeholder="Aporta con tu respuesta"
                                    {...field}
                                    disabled={newReply.isPending}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    variant="ghost"
                    type="submit"
                    disabled={newReply.isPending || !reply || reply.length === 0}
                >
                    {newReply.isPending ? (
                        <LoaderCircle className="animate-spin" />
                    ) : (
                        <Send />
                    )}
                </Button>
            </form>
        </Form>
    );
};
