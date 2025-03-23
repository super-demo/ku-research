import NextAuth from "next-auth"

import authOption from "@/app/api/auth/[...nextauth]/auth-option"

const handler = NextAuth(authOption)

export { handler as GET, handler as POST }
