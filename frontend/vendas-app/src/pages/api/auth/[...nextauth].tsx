import NextAuth from "next-auth"
import Auth0 from "next-auth/providers/auth0"
import GithubProvider from "next-auth/providers/github"

export const authOptions = {
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string,
        }),
        Auth0({
            clientId: process.env.AUTH0_CLIENT_ID as string,
            clientSecret: process.env.AUTH0_CLIENT_SECRET as string,
            issuer: process.env.AUTH0_ISSUER as string,
        })
    ],
}

export default NextAuth(authOptions)