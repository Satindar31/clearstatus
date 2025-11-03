import { betterAuth, User } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { passkey } from "better-auth/plugins/passkey";
import {
	organization,
	haveIBeenPwned,
	twoFactor,
	emailOTP,
} from "better-auth/plugins";
import prisma from "@/prisma/prisma";
import { get } from "@vercel/edge-config";
import { render } from "@react-email/components";
import { createElement } from "react";
import { ResetPasswordEmail } from "@/emails/passwordReset";
import { transporter } from "./mail";
import EmailVerification from "@/emails/verificationLink";
import Get from "./edgeClient";

export const auth = betterAuth({
	appName: process.env.APP_NAME || "ClearStatus",
	emailAndPassword: {
		enabled: true,
		async sendResetPassword(data, request) {
			const useMail = await Get("use-email");
			if (useMail == "false") {
				return;
			}
			const mailFrom = await Get("mail-from");
			const from =
				typeof mailFrom === "string" && mailFrom.length > 0
					? mailFrom
					: undefined;
			const emailHtml = await render(
				createElement(ResetPasswordEmail, {
					userFirstname: data.user.name.split(" ")[0],
					resetPasswordLink: data.url,
				}),
			);

			const options = {
				from,
				to: data.user.email,
				subject: "Password Reset Request",
				html: emailHtml,
			};

			await transporter.sendMail(options);
		},
		requireEmailVerification: true,

		disableSignUp: (await Get("allow-registrations")) === "true" ? true : false,
	},
	emailVerification: {
		autoSignInAfterVerification: true,
		expiresIn: 5 * 60, // 5 minutes
		sendVerificationEmail: async ({ user, url, token }, request) => {
			const useMail = await Get("use-email");
			if (useMail == "false") {
				return;
			}
			const mailFrom = await Get("mail-from");
			const from =
				typeof mailFrom === "string" && mailFrom.length > 0
					? mailFrom
					: undefined;
			const emailHtml = await render(
				createElement(EmailVerification, {
					validationLink: url,
				}),
			);

			const options = {
				from,
				to: user.email,
				subject: `Verify your email address for ${process.env.APP_NAME!}`,
				html: emailHtml,
			};

			try {
				await transporter.sendMail(options);
			} catch (error) {
				console.error("Error sending email:", error);
			}
		},
	},
	socialProviders: {
		google: {
prompt: "select_account", 
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		},
		github: {
			clientId: process.env.GITHUB_CLIENT_ID!,
			clientSecret: process.env.GITHUB_CLIENT_SECRET!,
		},
		// discord: {
		//     clientId: process.env.DISCORD_CLIENT_ID!,
		//     clientSecret: process.env.DISCORD_CLIENT_SECRET!
		// },
		// linear: {
		//     clientId: process.env.LINEAR_CLIENT_ID!,
		//     clientSecret: process.env.LINEAR_CLIENT_SECRET!
		// }
	},
	plugins: [passkey(), organization(), haveIBeenPwned(), twoFactor()],
	database: prismaAdapter(prisma, {
		provider: "postgresql",
	}),
	user: {
		changeEmail: {
			enabled: true,
			sendChangeEmailVerification: async (data, request) => {
				const useMail = await Get("use-email");
				if (useMail == "false") {
					return;
				}
				const mailFrom = await Get("mail-from");
				const from =
					typeof mailFrom === "string" && mailFrom.length > 0
						? mailFrom
						: undefined;
				const emailHtml = await render(
					createElement(EmailVerification, {
						validationLink: data.url,
					}),
				);

				const options = {
					from,
					to: data.user.email,
					subject: `Verify your new email address for ${process.env.APP_NAME!}`,
					html: emailHtml,
				};

				try {
					await transporter.sendMail(options);
				} catch (error) {
					console.error("Error sending email:", error);
				}
			},
		},
	},
	rateLimit: {
		storage: "database",
		modelName: "rateLimit",
		customRules: {
			"/send-verification-email": {
				window: 15 * 60, // 15 minutes
				max: 5, // limit each IP to 5 requests per window
			},
		},
	},
});
