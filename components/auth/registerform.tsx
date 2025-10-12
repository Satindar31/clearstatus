"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import React from "react";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    setLoading(true);
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const email = formData.get("email");
    const password = formData.get("password");
    const name = formData.get("name");
    console.log({ email, password, name });

    authClient.signUp.email({
      email: email?.toString() || "",
      password: password?.toString() || "",
      name: name?.toString() || "",
      fetchOptions: {
        onSuccess: () => {
          setLoading(false);
          router.push("/dashboard");
        },
        onError: (ctx) => {
          setLoading(false);
          console.log(ctx.error);
          if (ctx.error.code == "PASSWORD_COMPROMISED") {
            toast.error(
              "This password has been compromised in a data breach. Please choose a different password."
            );
          } else {
            toast.error(ctx.error.message);
          }
        },
      },
    });
  }

  return (
    <form
      onSubmit={(e) => handleSubmit(e)}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Register an account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email below to create a new account
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="John Doe"
            required
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="m@example.com"
            required
          />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            {/* <p className="ml-auto text-sm underline-offset-4 hover:underline">
              Forgot your password?
            </p> */}
          </div>
          <Input id="password" name="password" type="password" required />
        </div>
        <Button disabled={loading} type="submit" className="w-full">
          {loading ? "Creating account..." : "Register"}
        </Button>
        {/* <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Or continue with
          </span>
        </div>
        <Button
          data-umami-event="Signup with google button"
          variant="outline"
          className="w-full"
          type="submit"
          name="provider"
          value={"google"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
              d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
              fill="currentColor"
            />
          </svg>
          Sign up with Google
        </Button>

        <Button
          data-umami-event="Signup with simplelogin button"
          variant="outline"
          className="w-full"
          type="submit"
          name="provider"
          value={"github"}
        >
          <svg
            viewBox="0 0 256.00 256.00"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMinYMin meet"
            fill="#000000"
            stroke="#000000"
            transform="rotate(0)matrix(1, 0, 0, 1, 0, 0)"
            stroke-width="0.00256"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke="#CCCCCC"
              stroke-width="9.728"
            ></g>
            <g id="SVGRepo_iconCarrier">
              {" "}
              <g fill="#161614">
                {" "}
                <path d="M127.505 0C57.095 0 0 57.085 0 127.505c0 56.336 36.534 104.13 87.196 120.99 6.372 1.18 8.712-2.766 8.712-6.134 0-3.04-.119-13.085-.173-23.739-35.473 7.713-42.958-15.044-42.958-15.044-5.8-14.738-14.157-18.656-14.157-18.656-11.568-7.914.872-7.752.872-7.752 12.804.9 19.546 13.14 19.546 13.14 11.372 19.493 29.828 13.857 37.104 10.6 1.144-8.242 4.449-13.866 8.095-17.05-28.32-3.225-58.092-14.158-58.092-63.014 0-13.92 4.981-25.295 13.138-34.224-1.324-3.212-5.688-16.18 1.235-33.743 0 0 10.707-3.427 35.073 13.07 10.17-2.826 21.078-4.242 31.914-4.29 10.836.048 21.752 1.464 31.942 4.29 24.337-16.497 35.029-13.07 35.029-13.07 6.94 17.563 2.574 30.531 1.25 33.743 8.175 8.929 13.122 20.303 13.122 34.224 0 48.972-29.828 59.756-58.22 62.912 4.573 3.957 8.648 11.717 8.648 23.612 0 17.06-.148 30.791-.148 34.991 0 3.393 2.295 7.369 8.759 6.117 50.634-16.879 87.122-64.656 87.122-120.973C255.009 57.085 197.922 0 127.505 0"></path>{" "}
                <path d="M47.755 181.634c-.28.633-1.278.823-2.185.389-.925-.416-1.445-1.28-1.145-1.916.275-.652 1.273-.834 2.196-.396.927.415 1.455 1.287 1.134 1.923M54.027 187.23c-.608.564-1.797.302-2.604-.589-.834-.889-.99-2.077-.373-2.65.627-.563 1.78-.3 2.616.59.834.899.996 2.08.36 2.65M58.33 194.39c-.782.543-2.06.034-2.849-1.1-.781-1.133-.781-2.493.017-3.038.792-.545 2.05-.055 2.85 1.07.78 1.153.78 2.513-.019 3.069M65.606 202.683c-.699.77-2.187.564-3.277-.488-1.114-1.028-1.425-2.487-.724-3.258.707-.772 2.204-.555 3.302.488 1.107 1.026 1.445 2.496.7 3.258M75.01 205.483c-.307.998-1.741 1.452-3.185 1.028-1.442-.437-2.386-1.607-2.095-2.616.3-1.005 1.74-1.478 3.195-1.024 1.44.435 2.386 1.596 2.086 2.612M85.714 206.67c.036 1.052-1.189 1.924-2.705 1.943-1.525.033-2.758-.818-2.774-1.852 0-1.062 1.197-1.926 2.721-1.951 1.516-.03 2.758.815 2.758 1.86M96.228 206.267c.182 1.026-.872 2.08-2.377 2.36-1.48.27-2.85-.363-3.039-1.38-.184-1.052.89-2.105 2.367-2.378 1.508-.262 2.857.355 3.049 1.398"></path>{" "}
              </g>{" "}
            </g>
          </svg>
          Sign up with Github
        </Button>

        <Button
          data-umami-event="Signup with passkey button"
          variant="outline"
          className="w-full"
          type="submit"
          name="provider"
          value={"passkey"}
          disabled
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            id="Passkey--Streamline-Outlined-Material"
            height="24"
            width="24"
          >
            <path
              fill="#000000"
              d="M3 20v-2.35c0 -0.63335 0.158335 -1.175 0.475 -1.625 0.316665 -0.45 0.725 -0.79165 1.225 -1.025 1.11665 -0.5 2.1875 -0.875 3.2125 -1.125S9.96665 13.5 11 13.5c0.43335 0 0.85415 0.02085 1.2625 0.0625s0.82915 0.10415 1.2625 0.1875c-0.08335 0.96665 0.09585 1.87915 0.5375 2.7375C14.50415 17.34585 15.15 18.01665 16 18.5v1.5H3Zm16 3.675 -1.5 -1.5v-4.65c-0.73335 -0.21665 -1.33335 -0.62915 -1.8 -1.2375 -0.46665 -0.60835 -0.7 -1.3125 -0.7 -2.1125 0 -0.96665 0.34165 -1.79165 1.025 -2.475 0.68335 -0.68335 1.50835 -1.025 2.475 -1.025s1.79165 0.34165 2.475 1.025c0.68335 0.68335 1.025 1.50835 1.025 2.475 0 0.75 -0.2125 1.41665 -0.6375 2 -0.425 0.58335 -0.9625 1 -1.6125 1.25l1.25 1.25 -1.5 1.5 1.5 1.5 -2 2ZM11 11.5c-1.05 0 -1.9375 -0.3625 -2.6625 -1.0875 -0.725 -0.725 -1.0875 -1.6125 -1.0875 -2.6625s0.3625 -1.9375 1.0875 -2.6625C9.0625 4.3625 9.95 4 11 4s1.9375 0.3625 2.6625 1.0875c0.725 0.725 1.0875 1.6125 1.0875 2.6625s-0.3625 1.9375 -1.0875 2.6625C12.9375 11.1375 12.05 11.5 11 11.5Zm7.5 3.175c0.28335 0 0.52085 -0.09585 0.7125 -0.2875S19.5 13.95835 19.5 13.675c0 -0.28335 -0.09585 -0.52085 -0.2875 -0.7125s-0.42915 -0.2875 -0.7125 -0.2875c-0.28335 0 -0.52085 0.09585 -0.7125 0.2875S17.5 13.39165 17.5 13.675c0 0.28335 0.09585 0.52085 0.2875 0.7125s0.42915 0.2875 0.7125 0.2875Z"
              strokeWidth="0.5"
            ></path>
          </svg>
          Sign up with Passkey
        </Button>
         */}
      </div>
      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link href="/login" className="underline underline-offset-4">
          Sign in
        </Link>
      </div>
    </form>
  );
}
