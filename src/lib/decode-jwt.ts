import { jwtDecode } from "jwt-decode"

interface DecodedJwt {
  name: string
  email: string
  exp: number
  user_id: number
  user_level_id: number
}

export function DecodeJwt(token: string) {
  try {
    const decoded = jwtDecode(token)
    return decoded as DecodedJwt
  } catch (error) {
    console.error("Error decoding with jwt", error)
    return null
  }
}
