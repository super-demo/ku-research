"use server"
import { getServerSession } from "next-auth"

import authOption from "@/app/api/auth/[...nextauth]/auth-option"
import config from "@/config"

const FetchInstance = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const session = await getServerSession(authOption)
  const accessToken = session?.user.jwt.accessToken

  const defaultHeaders: HeadersInit = {
    Authorization: `Bearer ${accessToken}`
  }

  const response = await fetch(`${config.baseUrl}${url}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    }
  })

  return response
}

export default FetchInstance
