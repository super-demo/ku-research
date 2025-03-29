export interface ResearchPaper {
  id?: string
  title: string
  authors: string
  abstract: string
  coverImage: string
  publishedYear: number
  field: string
  classifications: string[]
  doi?: string
  journal?: string

  // Visibility fields
  userId?: number
  isPublic: boolean
  publicOption?: "workspace" | "site" | "everyone" | ""
  workspaceSiteID?: number
}

export interface WorkspaceUser {
  workspaceId: number
  userId: number
}

export class ResearchApiService {
  private baseUrl: string

  constructor() {
    this.baseUrl = "http://localhost:8083"
  }

  async getAllPapers(userId: number): Promise<ResearchPaper[]> {
    try {
      const response = await fetch(`${this.baseUrl}/get-research`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ userId })
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch papers: ${response.status}`)
      }

      const data = await response.json()
      return data.papers || []
    } catch (error) {
      console.error("Error fetching papers:", error)
      throw error
    }
  }

  async addPaper(paper: Omit<ResearchPaper, "id">): Promise<ResearchPaper> {
    try {
      const response = await fetch(`${this.baseUrl}/add-paper`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(paper)
      })

      if (!response.ok) {
        throw new Error(`Failed to add paper: ${response.status}`)
      }

      const data = await response.json()
      return data.paper
    } catch (error) {
      console.error("Error adding paper:", error)
      throw error
    }
  }
}

export const researchApi = new ResearchApiService()
