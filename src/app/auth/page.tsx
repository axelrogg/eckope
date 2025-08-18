import { signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import { TypographyH1 } from "@/components/ui/typography";
import { cn } from "@/lib/utils/cn";
import { AuthError } from "next-auth";
//import { redirect } from "next/navigation";

//const SIGNIN_ERROR_URL = "/error";
const GoogleLogo = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
    <svg
        {...props}
        viewBox="0 0 48 48"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
        className={cn("h-10 w-10", className)}
    >
        <path
            fill="#EA4335"
            d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
        />
        <path
            fill="#4285F4"
            d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
        />
        <path
            fill="#FBBC05"
            d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
        />
        <path
            fill="#34A853"
            d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
        />
        <path fill="none" d="M0 0h48v48H0z" />
    </svg>
);

//export default GoogleLogo;

export default async function SignInPage({
    searchParams,
}: {
    searchParams: Promise<{ callbackUrl: string | undefined }>;
}) {
    const params = await searchParams;

    const onSubmit = async () => {
        "use server";
        try {
            await signIn("google", {
                redirectTo: params?.callbackUrl ?? "",
            });
        } catch (error) {
            // Signin can fail for a number of reasons, such as the user
            // not existing, or the user not having the correct role.
            // In some cases, you may want to redirect to a custom error
            if (error instanceof AuthError) {
                console.error(error);
            }

            // Otherwise if a redirects happens Next.js can handle it
            // so you can just re-thrown the error and let Next.js handle it.
            // Docs:
            // https://nextjs.org/docs/app/api-reference/functions/redirect#server-component
            throw error;
        }
    };

    return (
        <div className="flex h-svh w-svw flex-1 flex-col items-center">
            <span className="my-10 text-4xl font-bold">éckope</span>
            <TypographyH1 className="mb-4">Hola de nuevo</TypographyH1>
            <span className="mb-8 w-[calc(100vw-5rem)] text-center lg:w-1/3">
                ¿No tienes cuenta? No te preocupes, puedes crearla rápidamente con alguno
                de los botones de abajo.
            </span>

            <div className="justify-center space-y-5 text-center">
                <form action={onSubmit}>
                    <Button
                        type="submit"
                        className="text-md gap-4 rounded-full bg-white py-7 has-[>svg]:px-7"
                    >
                        <GoogleLogo className="size-6" />
                        Continuar con Google
                    </Button>
                </form>
            </div>
        </div>
    );
}
