import NextAuth from "next-auth";
import type { Provider } from "next-auth/providers";
import { SupabaseAdapter } from "@auth/supabase-adapter";
import Google from "next-auth/providers/google";

const authProviders: Provider[] = [Google];

export const authProvidersMap = authProviders
    .map((provider) => {
        if (typeof provider === "function") {
            const data = provider();
            return {
                id: data.id,
                name: data.name,
            };
        } else {
            return { id: provider.id, name: provider.name };
        }
    })
    .filter((provider) => provider.id !== "credentials");

export const { handlers, signIn, signOut, auth } = NextAuth(() => {
    return {
        debug: true,
        adapter: SupabaseAdapter({
            url: process.env.SUPABASE_URL!,
            secret: process.env.SUPABASE_ANON_KEY!,
        }),
        providers: authProviders,
        pages: {
            signIn: "/auth/login",
        },
    };
});
