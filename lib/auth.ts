import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { passkey } from "better-auth/plugins/passkey";
import { organization } from "better-auth/plugins";
import { haveIBeenPwned } from "better-auth/plugins";
import { twoFactor } from "better-auth/plugins";
import prisma from "@/prisma/prisma";
import { get } from "@vercel/edge-config";
import { render } from "@react-email/components";
import { createElement } from "react";
import { ResetPasswordEmail } from "@/emails/passwordReset";
import { transporter } from "./mail";

export const auth = betterAuth({
  appName: "ClearStatus",
  emailAndPassword: {
    enabled: true,
    async sendResetPassword(data, request) {
      const useMail = await get("use-email");
      if (useMail == "false") {
        return;
      }
      const mailFrom = await get("mail-from");
      const from =
        typeof mailFrom === "string" && mailFrom.length > 0
          ? mailFrom
          : undefined;
      const emailHtml = await render(
        createElement(ResetPasswordEmail, {
          userFirstname: data.user.name.split(" ")[0],
          resetPasswordLink: data.url,
        })
      );

      const options = {
        from,
        to: data.user.email,
        subject: "Password Reset Request",
        html: emailHtml,
      };

      await transporter.sendMail(options);
    },
  },
  socialProviders: {
    google: {
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
});
