import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import ResearchList from "./_components/research-list"
import { ResearchProvider } from "./_components/research-provider"

export default function Home() {
  return (
    <main className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-4 md:py-6">
        <header className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center md:mb-6">
          <div>
            <h1 className="text-xl font-bold tracking-tight md:text-2xl lg:text-3xl">
              Ku Research
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Discover and organize academic research papers
            </p>
          </div>
          <Button
            asChild
            size="sm"
            className="md:size-default w-full sm:w-auto md:w-auto"
          >
            <Link href="/home/add-research" className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Add New Research
            </Link>
          </Button>
        </header>
        <ResearchProvider>
          <ResearchList />
        </ResearchProvider>
      </div>
    </main>
  )
}
