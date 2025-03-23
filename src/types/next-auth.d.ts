import { User as NextAuthUser } from "next-auth"

import { userLevelId } from "@/constants/user-level"

declare module "next-auth" {
  enum UserLevel {
    Root = userLevelId.ROOT,
    Staff = userLevelId.STAFF,
    Owner = userLevelId.OWNER,
    SuperAdmin = userLevelId.SUPERADMIN,
    Admin = userLevelId.ADMIN,
    Member = userLevelId.MERBER
  }

  interface UserJWT {
    userId: number
    userLevelId: UserLevel
    accessToken: string
    expiresAt: number
    googleSignInToken: string
  }

  interface User extends NextAuthUser {
    jwt: UserJWT
    userId: number
    userLevelId: UserLevel
    googleSignInToken: string
  }

  interface Session {
    user: {
      email: string
      name: string
      image: string
      jwt: {
        userId: number
        userLevelId: UserLevel
        accessToken: string
        expiresAt: number
        googleSignInToken: string
      }
    }
    error?: "AccessTokenError"
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId: number
    userLevelId?: UserLevel
    accessToken: string
    expiresAt: number
    user: User
    googleSignInToken: string
    error?: "AccessTokenError"
  }
}
