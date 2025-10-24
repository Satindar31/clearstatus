"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { User } from "better-auth";
import { useEffect, useState } from "react";
import Image from "next/image";
import { AccountSettings } from "./accountSettings";

export default function UserButton() {
	const {
		data: session,
		isPending, //loading state
	} = authClient.useSession();
	const [user, setUser] = useState<User | null>();

	useEffect(() => {
		if (isPending == false) {
			setUser(session?.user ?? null);
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
			<PopoverContent className="w-fit">
				<div className="flex flex-col items-start justify-center">
					<p className="font-medium">{user?.name}</p>
					<p className="text-sm text-muted-foreground">{user?.email}</p>
					<div className="grid grid-cols-2 gap-2 mt-4 w-full">
						<AccountSettings user={user} />
						
						<Button
							variant="outline"
							onClick={() =>
								authClient.signOut({
									fetchOptions: {
										onSuccess() {
											window.location.href = "/";
										},
									},
								})
							}
						>
							Sign Out
						</Button>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
}
