"use client";

import * as React from "react";

import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

const schema = z.object({
    reply: z.string(),
});

export const EcoPanelReplyForm = () => {
    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            reply: "",
        },
    });

    const reply = form.watch("reply");

    function onSubmit(values: z.infer<typeof schema>) {
        console.log(values);
        form.reset();
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="bg-foreground flex w-full flex-row items-center justify-between rounded-lg"
            >
                <FormField
                    control={form.control}
                    name="reply"
                    render={({ field }) => (
                        <FormItem className="flex-1">
                            <FormControl>
                                <Input placeholder="Responde con tu eco" {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <Button
                    variant="ghost"
                    type="submit"
                    disabled={!reply || reply.length === 0}
                >
                    <Send
                        className={`${reply && reply.length > 0 ? "text-background" : "text-muted"}`}
                    />
                </Button>
            </form>
        </Form>
    );
};
