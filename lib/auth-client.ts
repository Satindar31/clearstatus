import { createAuthClient } from "better-auth/react"
import { organizationClient } from "better-auth/client/plugins"
import { twoFactorClient } from "better-auth/client/plugins"
import {
    passkeyClient
} from "better-auth/client/plugins";
export const authClient = createAuthClient({
    plugins: [ 
        organizationClient(),
        twoFactorClient(),
        passkeyClient()
    ] 
})