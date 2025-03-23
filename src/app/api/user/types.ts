export interface UserProfile {
  user_id: number
  user_level_id: number
  google_token: string
  avatar_url: string
  name: string
  nickname: string
  role: string
  email: string
  phone_number: string
  birthday: string
  created_at: string
  updated_at: string
}

export interface GoogleSignInToken {
  access_token: string
  expires_at: number
}
