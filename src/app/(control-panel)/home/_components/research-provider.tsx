"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode
} from "react"

interface ResearchPaper {
  id: string
  title: string
  authors: string
  abstract: string
  coverImage: string
  publishedYear: number
  field: string
  classifications: string[]
  doi?: string
  journal?: string
}

interface ResearchContextType {
  papers: ResearchPaper[]
  favorites: string[]
  fields: string[]
  classifications: string[]
  toggleFavorite: (id: string) => void
  addPaper: (paper: ResearchPaper) => Promise<void>
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

  useEffect(() => {
    // Load papers data from localStorage or use sample data if none exists
    const savedPapers = localStorage.getItem("kuresearch-papers")
    if (savedPapers) {
      const parsedPapers = JSON.parse(savedPapers)
      setPapers(parsedPapers)

      // Extract unique fields and classifications from saved papers
      extractMetadata(parsedPapers)
    } else {
      setPapers(samplePapers)

      // Extract unique fields and classifications from sample papers
      extractMetadata(samplePapers)
    }

    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem("kuresearch-favorites")
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }
  }, [])

  const extractMetadata = (papers: ResearchPaper[]) => {
    // Extract unique fields
    const uniqueFields = Array.from(new Set(papers.map((paper) => paper.field)))
    setFields(uniqueFields)

    // Extract unique classifications
    const allClassifications = papers.flatMap((paper) => paper.classifications)
    const uniqueClassifications = Array.from(new Set(allClassifications))
    setClassifications(uniqueClassifications)
  }

  const toggleFavorite = (id: string) => {
    const newFavorites = favorites.includes(id)
      ? favorites.filter((favId) => favId !== id)
      : [...favorites, id]
    setFavorites(newFavorites)
    localStorage.setItem("kuresearch-favorites", JSON.stringify(newFavorites))
  }

  const addPaper = async (paper: ResearchPaper): Promise<void> => {
    return new Promise((resolve) => {
      // Simulate network delay
      setTimeout(() => {
        const newPapers = [...papers, paper]
        setPapers(newPapers)

        // Save to localStorage
        localStorage.setItem("kuresearch-papers", JSON.stringify(newPapers))

        // Update fields if needed
        if (!fields.includes(paper.field)) {
          const newFields = [...fields, paper.field]
          setFields(newFields)
        }

        // Update classifications if needed
        const newClassifications = [...classifications]
        let classificationsUpdated = false

        paper.classifications.forEach((classification) => {
          if (!classifications.includes(classification)) {
            newClassifications.push(classification)
            classificationsUpdated = true
          }
        })

        if (classificationsUpdated) {
          setClassifications(newClassifications)
        }

        resolve()
      }, 500)
    })
  }

  return (
    <ResearchContext.Provider
      value={{
        papers,
        favorites,
        fields,
        classifications,
        toggleFavorite,
        addPaper
      }}
    >
      {children}
    </ResearchContext.Provider>
  )
}

// Sample research paper data
const samplePapers: ResearchPaper[] = [
  {
    id: "1",
    title: "Quantum Computing: Recent Advances and Future Directions",
    authors: "Dr. Richard Feynman, Dr. Lisa Chen",
    abstract:
      "This paper reviews recent developments in quantum computing, focusing on quantum supremacy experiments and potential applications in cryptography, optimization, and simulation of quantum systems.",
    coverImage:
      "https://scontent-bkk1-2.xx.fbcdn.net/v/t39.30808-6/476509205_555409170843779_2189911961991409505_n.jpg?stp=dst-jpg_s1080x2048_tt6&_nc_cat=107&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=dvVyY7fKDE4Q7kNvgEUsxY5&_nc_oc=Adm7pMZkVfAy3GQbposPMK9VpKk81CyRhNdrr2JqPgAp0TnQlYyuOJT7nelQ2oDVmBM&_nc_zt=23&_nc_ht=scontent-bkk1-2.xx&_nc_gid=eBOCDkseztFEgrAKMda5Xg&oh=00_AYGH3QWile1EBMI5YsbJZHdZDO8Ut6TAyNEjyCzqITjDEw&oe=67DF7CDD",
    publishedYear: 2023,
    field: "Computer Science",
    classifications: [
      "Quantum Computing",
      "Theoretical Physics",
      "Cryptography"
    ],
    doi: "10.1038/s41586-019-1666-5",
    journal: "Nature Quantum Information"
  },
  {
    id: "2",
    title:
      "Climate Change Impact on Marine Ecosystems: A Comprehensive Analysis",
    authors: "Dr. Sarah Johnson, Dr. Michael Rodriguez",
    abstract:
      "This research presents findings from a decade-long study on the effects of rising ocean temperatures and acidification on coral reefs and marine biodiversity across multiple climate zones.",
    coverImage:
      "https://scontent-bkk1-2.xx.fbcdn.net/v/t39.30808-6/476509205_555409170843779_2189911961991409505_n.jpg?stp=dst-jpg_s1080x2048_tt6&_nc_cat=107&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=dvVyY7fKDE4Q7kNvgEUsxY5&_nc_oc=Adm7pMZkVfAy3GQbposPMK9VpKk81CyRhNdrr2JqPgAp0TnQlYyuOJT7nelQ2oDVmBM&_nc_zt=23&_nc_ht=scontent-bkk1-2.xx&_nc_gid=eBOCDkseztFEgrAKMda5Xg&oh=00_AYGH3QWile1EBMI5YsbJZHdZDO8Ut6TAyNEjyCzqITjDEw&oe=67DF7CDD",
    publishedYear: 2023,
    field: "Environmental Science",
    classifications: ["Climate Change", "Marine Biology", "Ecology"],
    doi: "10.1126/science.abc1234",
    journal: "Science"
  },
  {
    id: "3",
    title:
      "Artificial Intelligence Ethics: Frameworks for Responsible Development",
    authors: "Dr. Alan Turing Institute, Dr. Grace Hopper",
    abstract:
      "This paper examines ethical considerations in AI development, proposing frameworks for addressing bias, transparency, privacy, and accountability in machine learning systems.",
    coverImage:
      "https://scontent-bkk1-2.xx.fbcdn.net/v/t39.30808-6/476509205_555409170843779_2189911961991409505_n.jpg?stp=dst-jpg_s1080x2048_tt6&_nc_cat=107&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=dvVyY7fKDE4Q7kNvgEUsxY5&_nc_oc=Adm7pMZkVfAy3GQbposPMK9VpKk81CyRhNdrr2JqPgAp0TnQlYyuOJT7nelQ2oDVmBM&_nc_zt=23&_nc_ht=scontent-bkk1-2.xx&_nc_gid=eBOCDkseztFEgrAKMda5Xg&oh=00_AYGH3QWile1EBMI5YsbJZHdZDO8Ut6TAyNEjyCzqITjDEw&oe=67DF7CDD",
    publishedYear: 2023,
    field: "Computer Science",
    classifications: ["Artificial Intelligence", "Ethics", "Policy"],
    doi: "10.1145/3442188.3445901",
    journal: "ACM Conference on Fairness, Accountability, and Transparency"
  },
  {
    id: "4",
    title: "CRISPR-Cas9 Applications in Treating Genetic Disorders",
    authors: "Dr. Jennifer Doudna, Dr. Feng Zhang",
    abstract:
      "This research explores recent advances in CRISPR-Cas9 gene editing technology and its potential applications in treating genetic disorders such as cystic fibrosis, sickle cell anemia, and Huntington's disease.",
    coverImage:
      "https://scontent-bkk1-2.xx.fbcdn.net/v/t39.30808-6/476509205_555409170843779_2189911961991409505_n.jpg?stp=dst-jpg_s1080x2048_tt6&_nc_cat=107&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=dvVyY7fKDE4Q7kNvgEUsxY5&_nc_oc=Adm7pMZkVfAy3GQbposPMK9VpKk81CyRhNdrr2JqPgAp0TnQlYyuOJT7nelQ2oDVmBM&_nc_zt=23&_nc_ht=scontent-bkk1-2.xx&_nc_gid=eBOCDkseztFEgrAKMda5Xg&oh=00_AYGH3QWile1EBMI5YsbJZHdZDO8Ut6TAyNEjyCzqITjDEw&oe=67DF7CDD",
    publishedYear: 2022,
    field: "Biotechnology",
    classifications: ["Genetics", "Gene Therapy", "Medical Research"],
    doi: "10.1016/j.cell.2022.01.035",
    journal: "Cell"
  },
  {
    id: "5",
    title:
      "Neuroplasticity and Cognitive Rehabilitation After Traumatic Brain Injury",
    authors: "Dr. Maya Rodriguez, Dr. James Wilson",
    abstract:
      "This paper presents findings on brain plasticity mechanisms and their implications for developing effective cognitive rehabilitation strategies for patients recovering from traumatic brain injuries.",
    coverImage:
      "https://scontent-bkk1-2.xx.fbcdn.net/v/t39.30808-6/476509205_555409170843779_2189911961991409505_n.jpg?stp=dst-jpg_s1080x2048_tt6&_nc_cat=107&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=dvVyY7fKDE4Q7kNvgEUsxY5&_nc_oc=Adm7pMZkVfAy3GQbposPMK9VpKk81CyRhNdrr2JqPgAp0TnQlYyuOJT7nelQ2oDVmBM&_nc_zt=23&_nc_ht=scontent-bkk1-2.xx&_nc_gid=eBOCDkseztFEgrAKMda5Xg&oh=00_AYGH3QWile1EBMI5YsbJZHdZDO8Ut6TAyNEjyCzqITjDEw&oe=67DF7CDD",
    publishedYear: 2022,
    field: "Neuroscience",
    classifications: [
      "Neuroplasticity",
      "Rehabilitation",
      "Traumatic Brain Injury"
    ],
    doi: "10.1093/brain/awab123",
    journal: "Brain"
  },
  {
    id: "6",
    title:
      "Renewable Energy Integration: Challenges and Solutions for Power Grids",
    authors: "Dr. Elena Patel, Dr. Thomas Schmidt",
    abstract:
      "This research addresses the technical challenges of integrating large-scale renewable energy sources into existing power grids, proposing solutions for energy storage, demand response, and grid stability.",
    coverImage:
      "https://scontent-bkk1-2.xx.fbcdn.net/v/t39.30808-6/476509205_555409170843779_2189911961991409505_n.jpg?stp=dst-jpg_s1080x2048_tt6&_nc_cat=107&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=dvVyY7fKDE4Q7kNvgEUsxY5&_nc_oc=Adm7pMZkVfAy3GQbposPMK9VpKk81CyRhNdrr2JqPgAp0TnQlYyuOJT7nelQ2oDVmBM&_nc_zt=23&_nc_ht=scontent-bkk1-2.xx&_nc_gid=eBOCDkseztFEgrAKMda5Xg&oh=00_AYGH3QWile1EBMI5YsbJZHdZDO8Ut6TAyNEjyCzqITjDEw&oe=67DF7CDD",
    publishedYear: 2023,
    field: "Energy Engineering",
    classifications: ["Renewable Energy", "Power Systems", "Energy Storage"],
    doi: "10.1109/tpwrs.2022.3156789",
    journal: "IEEE Transactions on Power Systems"
  },
  {
    id: "7",
    title: "Machine Learning Approaches to Drug Discovery and Development",
    authors: "Dr. David Kim, Dr. Rachel Martinez",
    abstract:
      "This paper reviews machine learning techniques applied to drug discovery, including virtual screening, de novo drug design, and prediction of pharmacokinetic properties and toxicity.",
    coverImage:
      "https://scontent-bkk1-2.xx.fbcdn.net/v/t39.30808-6/476509205_555409170843779_2189911961991409505_n.jpg?stp=dst-jpg_s1080x2048_tt6&_nc_cat=107&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=dvVyY7fKDE4Q7kNvgEUsxY5&_nc_oc=Adm7pMZkVfAy3GQbposPMK9VpKk81CyRhNdrr2JqPgAp0TnQlYyuOJT7nelQ2oDVmBM&_nc_zt=23&_nc_ht=scontent-bkk1-2.xx&_nc_gid=eBOCDkseztFEgrAKMda5Xg&oh=00_AYGH3QWile1EBMI5YsbJZHdZDO8Ut6TAyNEjyCzqITjDEw&oe=67DF7CDD",
    publishedYear: 2023,
    field: "Pharmaceutical Science",
    classifications: [
      "Machine Learning",
      "Drug Discovery",
      "Computational Chemistry"
    ],
    doi: "10.1021/acs.jmedchem.2c01699",
    journal: "Journal of Medicinal Chemistry"
  },
  {
    id: "8",
    title:
      "Sustainable Urban Planning: Integrating Green Infrastructure for Climate Resilience",
    authors: "Dr. Carlos Mendez, Dr. Sophia Lee",
    abstract:
      "This research examines strategies for incorporating green infrastructure into urban planning to enhance climate resilience, reduce urban heat islands, and improve stormwater management.",
    coverImage:
      "https://scontent-bkk1-2.xx.fbcdn.net/v/t39.30808-6/476509205_555409170843779_2189911961991409505_n.jpg?stp=dst-jpg_s1080x2048_tt6&_nc_cat=107&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=dvVyY7fKDE4Q7kNvgEUsxY5&_nc_oc=Adm7pMZkVfAy3GQbposPMK9VpKk81CyRhNdrr2JqPgAp0TnQlYyuOJT7nelQ2oDVmBM&_nc_zt=23&_nc_ht=scontent-bkk1-2.xx&_nc_gid=eBOCDkseztFEgrAKMda5Xg&oh=00_AYGH3QWile1EBMI5YsbJZHdZDO8Ut6TAyNEjyCzqITjDEw&oe=67DF7CDD",
    publishedYear: 2022,
    field: "Urban Planning",
    classifications: [
      "Sustainability",
      "Climate Resilience",
      "Green Infrastructure"
    ],
    doi: "10.1016/j.landurbplan.2022.104567",
    journal: "Landscape and Urban Planning"
  },
  {
    id: "9",
    title:
      "Blockchain Technology for Supply Chain Transparency and Traceability",
    authors: "Dr. Satoshi Nakamoto, Dr. Vitalik Buterin",
    abstract:
      "This paper explores applications of blockchain technology in enhancing supply chain transparency, traceability, and security, with case studies from food, pharmaceutical, and luxury goods industries.",
    coverImage:
      "https://scontent-bkk1-2.xx.fbcdn.net/v/t39.30808-6/476509205_555409170843779_2189911961991409505_n.jpg?stp=dst-jpg_s1080x2048_tt6&_nc_cat=107&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=dvVyY7fKDE4Q7kNvgEUsxY5&_nc_oc=Adm7pMZkVfAy3GQbposPMK9VpKk81CyRhNdrr2JqPgAp0TnQlYyuOJT7nelQ2oDVmBM&_nc_zt=23&_nc_ht=scontent-bkk1-2.xx&_nc_gid=eBOCDkseztFEgrAKMda5Xg&oh=00_AYGH3QWile1EBMI5YsbJZHdZDO8Ut6TAyNEjyCzqITjDEw&oe=67DF7CDD",
    publishedYear: 2023,
    field: "Computer Science",
    classifications: [
      "Blockchain",
      "Supply Chain Management",
      "Information Security"
    ],
    doi: "10.1109/access.2023.1234567",
    journal: "IEEE Access"
  },
  {
    id: "10",
    title:
      "Immunotherapy Advances in Cancer Treatment: Personalized Approaches",
    authors: "Dr. James Allison, Dr. Tasuku Honjo",
    abstract:
      "This research reviews recent advances in cancer immunotherapy, focusing on personalized approaches such as CAR-T cell therapy, checkpoint inhibitors, and neoantigen vaccines.",
    coverImage:
      "https://scontent-bkk1-2.xx.fbcdn.net/v/t39.30808-6/476509205_555409170843779_2189911961991409505_n.jpg?stp=dst-jpg_s1080x2048_tt6&_nc_cat=107&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=dvVyY7fKDE4Q7kNvgEUsxY5&_nc_oc=Adm7pMZkVfAy3GQbposPMK9VpKk81CyRhNdrr2JqPgAp0TnQlYyuOJT7nelQ2oDVmBM&_nc_zt=23&_nc_ht=scontent-bkk1-2.xx&_nc_gid=eBOCDkseztFEgrAKMda5Xg&oh=00_AYGH3QWile1EBMI5YsbJZHdZDO8Ut6TAyNEjyCzqITjDEw&oe=67DF7CDD",
    publishedYear: 2023,
    field: "Oncology",
    classifications: [
      "Immunotherapy",
      "Cancer Research",
      "Personalized Medicine"
    ],
    doi: "10.1038/s41591-023-02345-0",
    journal: "Nature Medicine"
  },
  {
    id: "11",
    title: "Quantum Machine Learning: Algorithms and Applications",
    authors: "Dr.Peter Shor, Dr. Lov Grover",
    abstract:
      "This paper explores the intersection of quantum computing and machine learning, discussing quantum algorithms for classification, clustering, and optimization problems.",
    coverImage:
      "https://scontent-bkk1-2.xx.fbcdn.net/v/t39.30808-6/476509205_555409170843779_2189911961991409505_n.jpg?stp=dst-jpg_s1080x2048_tt6&_nc_cat=107&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=dvVyY7fKDE4Q7kNvgEUsxY5&_nc_oc=Adm7pMZkVfAy3GQbposPMK9VpKk81CyRhNdrr2JqPgAp0TnQlYyuOJT7nelQ2oDVmBM&_nc_zt=23&_nc_ht=scontent-bkk1-2.xx&_nc_gid=eBOCDkseztFEgrAKMda5Xg&oh=00_AYGH3QWile1EBMI5YsbJZHdZDO8Ut6TAyNEjyCzqITjDEw&oe=67DF7CDD",
    publishedYear: 2022,
    field: "Computer Science",
    classifications: ["Quantum Computing", "Machine Learning", "Algorithms"],
    doi: "10.1103/physreva.2022.052412",
    journal: "Physical Review A"
  },
  {
    id: "12",
    title:
      "Microplastics in Marine Ecosystems: Distribution, Impacts, and Mitigation Strategies",
    authors: "Dr. Emily Chen, Dr. Robert Johnson",
    abstract:
      "This research investigates the distribution and ecological impacts of microplastics in marine environments, examining their entry pathways, effects on marine organisms, and potential strategies for mitigation and remediation.",
    coverImage:
      "https://scontent-bkk1-2.xx.fbcdn.net/v/t39.30808-6/476509205_555409170843779_2189911961991409505_n.jpg?stp=dst-jpg_s1080x2048_tt6&_nc_cat=107&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=dvVyY7fKDE4Q7kNvgEUsxY5&_nc_oc=Adm7pMZkVfAy3GQbposPMK9VpKk81CyRhNdrr2JqPgAp0TnQlYyuOJT7nelQ2oDVmBM&_nc_zt=23&_nc_ht=scontent-bkk1-2.xx&_nc_gid=eBOCDkseztFEgrAKMda5Xg&oh=00_AYGH3QWile1EBMI5YsbJZHdZDO8Ut6TAyNEjyCzqITjDEw&oe=67DF7CDD",
    publishedYear: 2022,
    field: "Environmental Science",
    classifications: ["Marine Pollution", "Microplastics", "Conservation"],
    doi: "10.1016/j.marpolbul.2022.113789",
    journal: "Marine Pollution Bulletin"
  }
]
