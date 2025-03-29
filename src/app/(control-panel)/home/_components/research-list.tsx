// ku-research/src/app/%28control-panel%29/home/_components/research-list.tsx
"use client"

import { useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useMediaQuery } from "@/hooks/use-mobile"
import { Filter, Search, SlidersHorizontal, X } from "lucide-react"
import { ResearchCard } from "./research-card"
import { ResearchDetail } from "./research-detail"
import { useResearch } from "./research-provider"

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

export default function ResearchList() {
  const { papers, favorites, fields, classifications, toggleFavorite } =
    useResearch()
  const [selectedPaper, setSelectedPaper] = useState<ResearchPaper | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedField, setSelectedField] = useState("all")
  const [selectedClassifications, setSelectedClassifications] = useState<
    string[]
  >([])
  const isMobile = useMediaQuery("(max-width: 768px)")

  const filteredPapers = papers.filter((paper) => {
    const matchesSearch =
      paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.authors.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.abstract.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesField =
      selectedField === "all" || paper.field === selectedField

    const matchesClassification =
      selectedClassifications.length === 0 ||
      paper.classifications.some((c) => selectedClassifications.includes(c))

    return matchesSearch && matchesField && matchesClassification
  })

  const handleClassificationToggle = (classification: string) => {
    setSelectedClassifications((prev) =>
      prev.includes(classification)
        ? prev.filter((c) => c !== classification)
        : [...prev, classification]
    )
  }

  const clearFilters = () => {
    setSelectedField("all")
    setSelectedClassifications([])
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 sm:flex-row">
          <div>
            {" "}
            {isMobile ? (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full sm:w-auto">
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    Filters
                    {(selectedField !== "all" ||
                      selectedClassifications.length > 0) && (
                      <Badge variant="secondary" className="ml-1">
                        {selectedField !== "all"
                          ? 1
                          : 0 + selectedClassifications.length}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px]">
                  <SheetHeader>
                    <SheetTitle>Research Filters</SheetTitle>
                    <SheetDescription>
                      Filter research papers by field and classification
                    </SheetDescription>
                  </SheetHeader>
                  <div className="space-y-6 p-4">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Field</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant={
                            selectedField === "all" ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => setSelectedField("all")}
                          className="justify-start"
                        >
                          All Fields
                        </Button>
                        {fields.map((field) => (
                          <Button
                            key={field}
                            variant={
                              selectedField === field ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => setSelectedField(field)}
                            className="justify-start"
                          >
                            {field}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Classifications</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {classifications.map((classification) => (
                          <div
                            key={classification}
                            className="flex items-center space-x-2"
                          >
                            <input
                              type="checkbox"
                              id={`classification-${classification}`}
                              checked={selectedClassifications.includes(
                                classification
                              )}
                              onChange={() =>
                                handleClassificationToggle(classification)
                              }
                              className="rounded border-gray-300"
                            />
                            <label
                              htmlFor={`classification-${classification}`}
                              className="text-sm"
                            >
                              {classification}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {(selectedField !== "all" ||
                      selectedClassifications.length > 0) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearFilters}
                        className="w-full"
                      >
                        Clear All Filters
                      </Button>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Classifications
                    {selectedClassifications.length > 0 && (
                      <Badge variant="secondary" className="ml-1">
                        {selectedClassifications.length}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    Research Classifications
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {classifications.map((classification) => (
                    <DropdownMenuCheckboxItem
                      key={classification}
                      checked={selectedClassifications.includes(classification)}
                      onCheckedChange={() =>
                        handleClassificationToggle(classification)
                      }
                    >
                      {classification}
                    </DropdownMenuCheckboxItem>
                  ))}
                  {selectedClassifications.length > 0 && (
                    <>
                      <DropdownMenuSeparator />
                      <div className="p-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => setSelectedClassifications([])}
                        >
                          Clear Classifications
                        </Button>
                      </div>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          <div className="relative flex-1">
            <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
            <Input
              type="search"
              placeholder="Search papers by title, author, or content..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div>
            <Button
              variant="outline"
              onClick={() => setSearchQuery("")}
              className="w-full sm:w-auto"
              disabled={!searchQuery}
            >
              Clear
            </Button>
          </div>
        </div>

        {!isMobile && (
          <div className="flex-1 overflow-auto pb-2">
            <Tabs
              defaultValue="all"
              value={selectedField}
              onValueChange={setSelectedField}
            >
              <TabsList className="flex h-auto flex-nowrap overflow-x-auto">
                <TabsTrigger value="all" className="px-4">
                  All Fields
                </TabsTrigger>
                {fields.map((field) => (
                  <TabsTrigger key={field} value={field} className="px-4">
                    {field}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        )}

        {(selectedField !== "all" || selectedClassifications.length > 0) &&
          !isMobile && (
            <div className="flex flex-wrap items-center gap-2">
              {selectedField !== "all" && (
                <Badge variant="outline" className="gap-1 px-3 py-1">
                  Field: {selectedField}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-1 h-4 w-4 p-0"
                    onClick={() => setSelectedField("all")}
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Clear field filter</span>
                  </Button>
                </Badge>
              )}

              {selectedClassifications.map((classification) => (
                <Badge
                  key={classification}
                  variant="outline"
                  className="gap-1 px-3 py-1"
                >
                  {classification}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-1 h-4 w-4 p-0"
                    onClick={() => handleClassificationToggle(classification)}
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Remove {classification}</span>
                  </Button>
                </Badge>
              ))}

              {(selectedField !== "all" ||
                selectedClassifications.length > 0) && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={clearFilters}
                >
                  Clear all
                </Button>
              )}
            </div>
          )}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-2 md:gap-4 lg:grid-cols-3 lg:gap-5 xl:grid-cols-4">
        {filteredPapers.map((paper) => (
          <ResearchCard
            key={paper.id}
            paper={paper}
            isFavorite={favorites.includes(paper.id)}
            onFavorite={() => toggleFavorite(paper.id)}
            onClick={() => setSelectedPaper(paper)}
          />
        ))}
      </div>

      {filteredPapers.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">
            No research papers found. Try different search terms or filters.
          </p>
        </div>
      )}

      {selectedPaper && (
        <ResearchDetail
          paper={selectedPaper}
          isFavorite={favorites.includes(selectedPaper.id)}
          onFavorite={() => toggleFavorite(selectedPaper.id)}
          onClose={() => setSelectedPaper(null)}
        />
      )}
    </div>
  )
}
