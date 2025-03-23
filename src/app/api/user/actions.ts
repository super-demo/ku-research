"use server"

import { getServerSession } from "next-auth"

import authOption from "@/app/api/auth/[...nextauth]/auth-option"
import { GoogleSignInToken, UserProfile } from "@/app/api/user/types"
import config from "@/config"
import { ApiResponse } from "@/types/api"

export const GetUserProfile = async (userId: number, accessToken?: string) => {
  try {
    let authorizationToken
    if (accessToken) {
      authorizationToken = accessToken
    } else {
      const session = await getServerSession(authOption)
      authorizationToken = session?.user.jwt.accessToken
    }

    const response = await fetch(`${config.baseUrl}/users/${userId}/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authorizationToken}`
      }
    })

    const data = (await response.json()) as ApiResponse<UserProfile>

    return data
  } catch (error) {
    console.error("Error fetching user profile:", error)
    throw error
  }
}

export const GoogleSignIn = async (access_token: string) => {
  try {
    const response = await fetch(
      `${config.baseUrl}/authentications/sign/google`,
      {
        method: "POST",
        body: JSON.stringify({ access_token }),
        headers: {
          "App-Secret": config.appSecret
        }
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      if (errorData.status?.code === 404002) {
        throw new Error("Sorry, we couldn't find your Google Account")
      }
      throw new Error("Login request failed")
    }

    const data = (await response.json()) as ApiResponse<GoogleSignInToken>
    return data
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error(
      "Login failed! An unexpected error occurred. Please try again."
    )
  }
}
