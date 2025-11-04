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
import Image from "next/image";
import { X } from "lucide-react";

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
	const [image, setImage] = React.useState<File | null>(null);
	const [imagePreview, setImagePreview] = React.useState<string | null>(user?.image || null);

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setImage(file);
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setLoading(true);

		const form = e.target as HTMLFormElement;
		const email = (form.elements.namedItem("email") as HTMLInputElement).value;
		const name = (form.elements.namedItem("name") as HTMLInputElement).value;
		if (user?.name !== name) {
			const res = authClient
				.updateUser({
					name: name,
				})
				.then(() => {
					setLoading(false);
				});
			toast.promise(res, {
				loading: "Updating profile...",
				success: () => {
					router.refresh();
					return "Profile updated successfully!";
				},
				error: "Failed to update profile.",
			});
		}
		if (user?.email !== email) {
			const res = authClient
				.changeEmail({
					newEmail: email,
					callbackURL: window.location.origin + "/dashboard",
				})
				.then(() => {
					setLoading(false);
				});
			toast.promise(res, {
				loading: "Sending email change verification...",
				success: () => {
					router.refresh();
					return "Verification email sent! Please check your new email's inbox.";
				},
				error: "Failed to send verification email.",
			});
		}
		if (user?.image !== imagePreview && image) {
			const res = authClient
				.updateUser({
					image: imagePreview || "",
				})
				.then(() => {
					setLoading(false);
				});
			toast.promise(res, {
				loading: "Updating profile image...",
				success: () => {
					router.refresh();
					router.refresh();
					return "Profile image updated successfully!";
				},
				error: "Failed to update profile image.",
			});
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
			<div className="grid gap-3">
				<Label htmlFor="image">Profile Image (optional)</Label>
				<div className="flex items-end gap-4">
					{imagePreview && (
						<div className="relative w-16 h-16 rounded-sm overflow-hidden">
							<Image
								src={imagePreview}
								alt="Profile preview"
								layout="fill"
								objectFit="cover"
							/>
						</div>
					)}
					<div className="flex items-center gap-2 w-full">
						<Input
							id="image"
							type="file"
							accept="image/*"
							onChange={handleImageChange}
							className="w-full"
						/>
						{imagePreview && (
							<X
								className="cursor-pointer"
								onClick={() => {
									setImage(null);
									setImagePreview(null);
								}}
							/>
						)}
					</div>
				</div>
			</div>
			<Button disabled={loading} type="submit">
				{loading ? "Saving..." : "Save changes"}
			</Button>
		</form>
	);
}
