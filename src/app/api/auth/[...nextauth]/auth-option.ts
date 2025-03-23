import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"

import config from "@/config"
import { DecodeJwt } from "@/lib/decode-jwt"
import { GetUserProfile, GoogleSignIn } from "../../user/actions"

const authOption: NextAuthOptions = {
  secret: config.authSecret,
  providers: [
    GoogleProvider({
      clientId: config.googleClientId,
      clientSecret: config.googleClientSecret,
      authorization: {
        params: {
          scope:
            "openid email profile https://www.googleapis.com/auth/drive.file",
          prompt: "consent",
          access_type: "offline"
        }
      }
    })
  ],
  callbacks: {
    signIn: async ({ user, account }) => {
      if (!account) {
        throw new Error("Failed to authenticate with Google. Please try again.")
      }
      try {
        const googleSignInResponse = await GoogleSignIn(
          account.access_token as string
        )

        const decodedJwt = DecodeJwt(
          googleSignInResponse.data.access_token as string
        )

        const { data: userProfile } = await GetUserProfile(
          decodedJwt?.user_id as number,
          googleSignInResponse.data.access_token as string
        )

        if (!decodedJwt) {
          throw new Error(
            "Login failed! An unexpected error occurred. Please try again."
          )
        }

        user.jwt = {
          accessToken: googleSignInResponse.data.access_token as string,
          expiresAt: googleSignInResponse.data.expires_at as number,
          userId: userProfile.user_id,
          userLevelId: userProfile.user_level_id,
          googleSignInToken: account.access_token as string
        }
      } catch (error) {
        throw error
      }
      return true
    },
    jwt: async ({ token, user }) => {
      if (user) {
        return {
          ...token,
          userId: user.jwt.userId,
          userLevelId: user.jwt.userLevelId,
          accessToken: user.jwt.accessToken,
          expiresAt: user.jwt.expiresAt,
          googleSignInToken: user.jwt.googleSignInToken,
          user
        }
      }
      if (Date.now() < token.expiresAt * 1000) {
        return token
      } else {
        return { ...token, error: "AccessTokenError" as const }
      }
    },
    session: async ({ session, token }) => {
      const { userId, accessToken } = token
      const { data: userData } = await GetUserProfile(userId, accessToken)

      session.user = {
        image: userData.avatar_url,
        email: userData.email,
        name: userData.name,
        jwt: {
          accessToken: token.accessToken,
          expiresAt: token.expiresAt,
          userId: token.userId,
          userLevelId: token.userLevelId,
          googleSignInToken: token.googleSignInToken
        }
      }
      session.error = token.error
      return session
    }
  },
  pages: {
    signIn: "/",
    error: "/"
  }
}

export default authOption
