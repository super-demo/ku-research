import { ResearchProvider } from "../_components/research-provider"
import AddResearchForm from "./_components/add-research-form"

export default function AddResearchPage() {
  return (
    <main className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-4 md:py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Add New Research Paper
          </h1>
          <p className="text-muted-foreground">
            Add a new academic research paper to your collection
          </p>
        </div>
        <ResearchProvider>
          <AddResearchForm />
        </ResearchProvider>
      </div>
    </main>
  )
}
