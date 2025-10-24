"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { User } from "better-auth";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function AccountSettings({ user }: { user: User | null | undefined }) {
	const [open, setOpen] = React.useState(false);
	const isDesktop = useMediaQuery("(min-width: 768px)");

	if (isDesktop) {
		return (
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger asChild>
					<Button variant={"secondary"}>Account Settings</Button>
				</DialogTrigger>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Edit profile</DialogTitle>
						<DialogDescription>
							Make changes to your profile here. Click save when you&apos;re
							done.
						</DialogDescription>
					</DialogHeader>
					<ProfileForm user={user} />
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>
				<Button variant={"secondary"}>Account Settings</Button>
			</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader className="text-left">
					<DrawerTitle>Edit profile</DrawerTitle>
					<DrawerDescription>
						Make changes to your profile here. Click save when you&apos;re done.
					</DrawerDescription>
				</DrawerHeader>
				<ProfileForm user={user} className="px-4" />
				<DrawerFooter className="pt-2">
					<DrawerClose asChild>
						<Button variant="outline">Cancel</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}

function ProfileForm({
	className,
	user,
}: React.ComponentProps<"form"> & { user: User | null | undefined }) {
    const router = useRouter();
    const [loading, setLoading] = React.useState(false);

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
        setLoading(true);

		const form = e.target as HTMLFormElement;
		const email = (form.elements.namedItem("email") as HTMLInputElement).value;
		const name = (form.elements.namedItem("name") as HTMLInputElement).value;
		if(user?.name !== name) {
            const res = authClient.updateUser({
                name: name,
            }).then(() => {
                setLoading(false);
            })
            toast.promise(res, {
                loading: "Updating profile...",
                success: () => {
                    router.refresh();
                    return "Profile updated successfully!";
                },
                error: "Failed to update profile.",
            })
        }
        if(user?.email !== email) {
            const res = authClient.changeEmail({
                newEmail: email,
                callbackURL: window.location.origin + "/dashboard",
            }).then(() => {
                setLoading(false);
            })
            toast.promise(res, {
                loading: "Sending email change verification...",
                success: () => {
                    router.refresh();
                    return "Verification email sent! Please check your new email's inbox.";
                },
                error: "Failed to send verification email.",
            })

        }
	}
	return (
		<form
			className={cn("grid items-start gap-6", className)}
			onSubmit={(e) => handleSubmit(e)}
		>
			<div className="grid gap-3">
				<Label htmlFor="email">Email</Label>
				<Input type="email" id="email" defaultValue={user?.email} />
			</div>
			<div className="grid gap-3">
				<Label htmlFor="name">Name</Label>
				<Input id="name" defaultValue={user?.name} />
			</div>
			<Button disabled={loading} type="submit">{loading ? "Saving..." : "Save changes"}</Button>
		</form>
	);
}
