import NextAuth from "next-auth"
import GitlabProvider from "next-auth/providers/gitlab"

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    // ...add more providers here
    // GitlabProvider({
    //     clientId: process.env.GITLAB_CLIENT_ID,
    //     clientSecret: process.env.GITLAB_CLIENT_SECRET
    // })
  ],
}

export default NextAuth(authOptions)