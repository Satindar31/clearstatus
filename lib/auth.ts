import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { passkey } from "better-auth/plugins/passkey";
import { organization } from "better-auth/plugins";
import { haveIBeenPwned } from "better-auth/plugins"
import { twoFactor } from "better-auth/plugins"

// If your Prisma file is located elsewhere, you can change the path
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
export const auth = betterAuth({
    appName: "ClearStatus",

  emailAndPassword: {
    enabled: true,
    async sendResetPassword(data, request) {
      // Send an email to the user with a link to reset their password
    },
  },
  socialProviders: {
    google: {
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!
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
  plugins: [passkey(), organization(), haveIBeenPwned(), twoFactor() ],
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
});
