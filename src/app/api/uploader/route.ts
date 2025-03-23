import { getServerSession } from "next-auth/next"
import { NextRequest, NextResponse } from "next/server"

import authOption from "@/app/api/auth/[...nextauth]/auth-option"
import config from "@/config"

export async function POST(request: NextRequest) {
  const FOLDER = config.googleDriveFolderId
  try {
    const session = await getServerSession(authOption)

    if (!session || !session.user?.jwt?.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const accessToken = session.user.jwt.googleSignInToken

    // Step 1: Create a file on Drive & get fileId
    const metadataResponse = await fetch(
      "https://www.googleapis.com/drive/v3/files",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: file.name,
          mimeType: file.type,
          parents: [FOLDER]
        })
      }
    )

    if (!metadataResponse.ok) {
      throw new Error(`Failed to create file: ${await metadataResponse.text()}`)
    }

    const { id: fileId } = await metadataResponse.json()

    // Step 2: Upload content to the created file
    const uploadResponse = await fetch(
      `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": file.type,
          "Content-Length": buffer.length.toString()
        },
        body: buffer
      }
    )

    if (!uploadResponse.ok) {
      throw new Error(`Failed to upload file: ${await uploadResponse.text()}`)
    }

    // Step 3: Make the file public
    await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}/permissions`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          role: "reader",
          type: "anyone"
        })
      }
    )

    const imageUrl = `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`

    return NextResponse.json({ imageUrl })
  } catch (error) {
    console.error("Error uploading image:", error)
  }
}
