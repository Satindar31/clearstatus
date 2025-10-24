"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { User } from "better-auth";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function UserButton() {
	const {
		data: session,
		isPending, //loading state
	} = authClient.useSession();
	const [user, setUser] = useState<User | null>();
	const router = useRouter()

	useEffect(() => {
		if (isPending == false) {
			setUser(session?.user ?? null);
			console.log("User session:", session?.user.image);
		}
	}, [isPending]);
	return (
		<Popover>
			<PopoverTrigger>
				<div className="w-8 h-8 rounded-full p-0">
					<span className="sr-only">Open user menu</span>
					<Image
						width={32}
						height={32}
						className="w-8 h-8 rounded-full"
						src={
							user?.image ||
							"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
						}
						alt="User Avatar"
					/>
				</div>
			</PopoverTrigger>
			<PopoverContent className="w-56">
				<div className="flex flex-col items-start justify-center p-1">
					<p className="font-medium">{user?.name}</p>
					<p className="text-sm text-muted-foreground">{user?.email}</p>
					<Button variant="outline" onClick={() => authClient.signOut({
						fetchOptions: {
							onSuccess() {
								window.location.href = "/"
							},
						}
					})}>Sign Out</Button>
				</div>
			</PopoverContent>
		</Popover>
	);
}
