import { createAuthClient } from "better-auth/react"
import { emailOTPClient, organizationClient, twoFactorClient, passkeyClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
    plugins: [ 
        organizationClient(),
        twoFactorClient(),
        passkeyClient()
    ] 
})