"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode
} from "react"
import { ResearchPaper, researchApi } from "../../../api/paper/routes"

interface ResearchContextType {
  papers: ResearchPaper[]
  favorites: string[]
  fields: string[]
  classifications: string[]
  loading: boolean
  error: string | null
  toggleFavorite: (id: string) => void
  addPaper: (paper: Omit<ResearchPaper, "id">) => Promise<void>
  refreshPapers: () => Promise<void>
}

const ResearchContext = createContext<ResearchContextType | undefined>(
  undefined
)

export function useResearch() {
  const context = useContext(ResearchContext)
  if (!context) {
    throw new Error("useResearch must be used within a ResearchProvider")
  }
  return context
}

export function ResearchProvider({ children }: { children: ReactNode }) {
  const [papers, setPapers] = useState<ResearchPaper[]>([])
  const [favorites, setFavorites] = useState<string[]>([])
  const [fields, setFields] = useState<string[]>([])
  const [classifications, setClassifications] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const extractMetadata = (papers: ResearchPaper[]) => {
    // Extract unique fields
    const uniqueFields = Array.from(new Set(papers.map((paper) => paper.field)))
    setFields(uniqueFields)

    // Extract unique classifications
    const allClassifications = papers.flatMap((paper) => paper.classifications)
    const uniqueClassifications = Array.from(new Set(allClassifications))
    setClassifications(uniqueClassifications)
  }

  const refreshPapers = async () => {
    try {
      setLoading(true)
      setError(null)
      const fetchedPapers = await researchApi.getAllPapers()
      setPapers(fetchedPapers)
      extractMetadata(fetchedPapers)
    } catch (err) {
      setError("Failed to fetch papers. Please try again later.")
      console.error("Error fetching papers:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem("kuresearch-favorites")
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }

    // Fetch papers from API
    refreshPapers()
  }, [])

  const toggleFavorite = (id: string) => {
    const newFavorites = favorites.includes(id)
      ? favorites.filter((favId) => favId !== id)
      : [...favorites, id]
    setFavorites(newFavorites)
    localStorage.setItem("kuresearch-favorites", JSON.stringify(newFavorites))
  }

  const addPaper = async (
    paperData: Omit<ResearchPaper, "id">
  ): Promise<void> => {
    try {
      setLoading(true)
      setError(null)
      const newPaper = await researchApi.addPaper(paperData)

      // Update local state
      setPapers((prevPapers) => [...prevPapers, newPaper])

      // Update fields if needed
      if (!fields.includes(newPaper.field)) {
        setFields((prevFields) => [...prevFields, newPaper.field])
      }

      // Update classifications if needed
      const newClassifications = [...classifications]
      let classificationsUpdated = false
      newPaper.classifications.forEach((classification) => {
        if (!classifications.includes(classification)) {
          newClassifications.push(classification)
          classificationsUpdated = true
        }
      })

      if (classificationsUpdated) {
        setClassifications(newClassifications)
      }
    } catch (err) {
      setError("Failed to add paper. Please try again.")
      console.error("Error adding paper:", err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return (
    <ResearchContext.Provider
      value={{
        papers,
        favorites,
        fields,
        classifications,
        loading,
        error,
        toggleFavorite,
        addPaper,
        refreshPapers
      }}
    >
      {children}
    </ResearchContext.Provider>
  )
}
