"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";

export function ResetPasswordForm({
	className,
	...props
}: React.ComponentProps<"form">) {
	const [loading, setLoading] = React.useState(false);
	const [password1, setPassword1] = React.useState("");
	const [password2, setPassword2] = React.useState("");

	const router = useRouter();
	const pathname = usePathname()
	const token = new URLSearchParams(`${process.env.BASE_URL}${pathname}`).get("token");
	if (!token) {
		toast.error("Invalid or missing token");
		return null;
	}

	function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setLoading(true);

		if (password1 !== password2) {
			toast.error("Passwords do not match");
			setLoading(false);
			return;
		}
		authClient
			.resetPassword({
				newPassword: password1,
				token: token?.toString(),
			})
			.then((data) => {
				if (data.error) {
					toast.error(data.error.message);
					setLoading(false);
					return;
				}
				toast.success("Password reset successfully");
				return router.push("/login");
			});
		return;
	}

	return (
		<form
			onSubmit={(e) => handleSubmit(e)}
			className={cn("flex flex-col gap-6", className)}
			{...props}
		>
			<div className="flex flex-col items-center gap-2 text-center">
				<h1 className="text-2xl font-bold">Reset your password</h1>
				<p className="text-muted-foreground text-sm text-balance">
					Enter your new password below
				</p>
			</div>
			<div className="grid gap-6">
				<div className="grid gap-3">
					<Label htmlFor="password">Enter new password</Label>
					<Input
						id="password1"
						name="password1"
						type="password"
						placeholder="Enter new password"
						value={password1}
						onChange={(e) => setPassword1(e.target.value)}
					/>
				</div>
				<div className="grid gap-3">
					<Label htmlFor="passwordconfirmation">Confirm new password</Label>
					<Input
						id="password2"
						name="password2"
						type="password"
						placeholder="Confirm new password"
						value={password2}
						onChange={(e) => setPassword2(e.target.value)}
					/>
				</div>
				<Button disabled={loading} type="submit" className="w-full">
					{loading ? "Resetting..." : "Reset Password"}
				</Button>
			</div>
			<div className="text-center text-sm">
				Remembered your password?{" "}
				<Link href="/login" className="underline underline-offset-4">
					Sign in
				</Link>
			</div>
		</form>
	);
}
