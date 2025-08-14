import NextAuth from "next-auth";
import type { Provider } from "next-auth/providers";
import { SupabaseAdapter } from "@auth/supabase-adapter";
import Google from "next-auth/providers/google";

declare module "next-auth" {
    interface User {
        id: string;
        email: string;
        emailVerified: boolean;
        name?: string | null;
        image?: string | null;
    }

    interface Session {
        user: User;
    }
}

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

export const { handlers, signIn, signOut, auth } = NextAuth({
    debug: false,
    adapter: SupabaseAdapter({
        url: process.env.SUPABASE_URL!,
        secret: process.env.SUPABASE_ANON_KEY!,
    }),
    providers: authProviders,
    pages: {
        signIn: "/auth",
    },
    callbacks: {
        async signIn({ account, profile }) {
            if (!account || !profile) {
                return false;
            }
            if (account.provider === "google") {
                if (typeof profile.email_verified === "boolean") {
                    if (profile.email_verified !== true) {
                        throw new Error("Auth::EmailNotVerifiedError");
                    }
                }
                return true;
            }
            return false;
        },
        session(params) {
            return {
                ...params.session,
                user: {
                    ...params.session.user,
                },
            };
        },
    },
});
