import { ResetPasswordForm } from "@/components/auth/resetPassword";
import { Button } from "@/components/ui/button";
import { GalleryVerticalEnd } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ResetPasswordPage() {
	return (
		<div className="grid min-h-svh lg:grid-cols-2">
			<div className="flex flex-col gap-4 p-6 md:p-10">
				<div className="flex flex-col justify-center gap-2 md:justify-start">
					<Link href="#" className="flex items-center gap-2 font-medium">
						<div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
							<GalleryVerticalEnd className="size-4" />
						</div>
						ClearStatus
					</Link>
					<p className="text-sm">
						Illustration by{" "}
						<Button variant="link" asChild size="sm" className="p-0">
							<Link href="https://unsplash.com/@andsproject?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">
								ands
							</Link>
						</Button>{" "}
						on{" "}
						<Button variant="link" size="sm" className="p-0">
							<Link href="https://unsplash.com/illustrations/girl-smoking-blowing-smoke-that-turns-into-stars-aRQ-hOdNiUI?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">
								Unsplash
							</Link>
						</Button>
					</p>
				</div>
				<div className="flex flex-1 items-center justify-center">
					<div className="w-full max-w-xs">
						<ResetPasswordForm />
					</div>
				</div>
			</div>
			<div className="bg-muted relative hidden lg:block">
				<Image
					src="/passwordResetbg.svg"
					fill={true}
					alt="Image"
					className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
				/>
			</div>
		</div>
	);
}
