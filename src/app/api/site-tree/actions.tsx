"use server"

import FetchInstance from "../../../lib/fetch-instance"
import { ApiResponse } from "../../../types/api"
import { SiteTree } from "./types"

export const GetListSiteTree = async () => {
  try {
    const response = await FetchInstance(`/site-trees/list/1`, {
      method: "GET"
    })

    const data = (await response.json()) as ApiResponse<SiteTree[]>
    return data.data
  } catch (error) {
    console.error("Error fetching site tree:", error)
    throw error
  }
}
