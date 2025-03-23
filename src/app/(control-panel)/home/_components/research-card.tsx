"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { FileText, Heart } from "lucide-react"
import Image from "next/image"

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

interface ResearchCardProps {
  paper: ResearchPaper
  isFavorite: boolean
  onFavorite: () => void
  onClick: () => void
}

export function ResearchCard({
  paper,
  isFavorite,
  onFavorite,
  onClick
}: ResearchCardProps) {
  // Check if the image is a data URL (uploaded image)
  const isDataUrl = paper.coverImage.startsWith("data:image/")

  return (
    <Card className="flex h-full flex-col overflow-hidden transition-all hover:shadow-md">
      <div className="relative aspect-[3/4] cursor-pointer" onClick={onClick}>
        <Image
          src={
            paper.coverImage ||
            "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/icons/file-text.svg"
          }
          alt={paper.title}
          fill
          className={cn("object-cover")}
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          priority
        />
        <div className="absolute top-2 left-2">
          <Badge variant="secondary" className="text-xs font-normal">
            {paper.field}
          </Badge>
        </div>
        <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/80 to-transparent p-3">
          <div className="flex flex-wrap gap-1">
            {paper.classifications.slice(0, 2).map((classification) => (
              <Badge
                key={classification}
                variant="outline"
                className="border-white/20 bg-black/50 text-xs text-white"
              >
                {classification}
              </Badge>
            ))}
            {paper.classifications.length > 2 && (
              <Badge
                variant="outline"
                className="border-white/20 bg-black/50 text-xs text-white"
              >
                +{paper.classifications.length - 2}
              </Badge>
            )}
          </div>
        </div>
      </div>
      <CardContent className="flex-grow pt-3 pb-1">
        <div className="cursor-pointer space-y-1" onClick={onClick}>
          <h3 className="line-clamp-2 text-sm font-semibold sm:text-base">
            {paper.title}
          </h3>
          <p className="text-muted-foreground line-clamp-1 text-xs sm:text-sm">
            {paper.authors}
          </p>
          <div className="text-muted-foreground flex items-center gap-1 text-xs">
            <FileText className="h-3 w-3 flex-shrink-0" />
            <span>{paper.publishedYear}</span>
            {paper.journal && (
              <>
                <span className="mx-1">•</span>
                <span className="max-w-[120px] truncate">{paper.journal}</span>
              </>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end pt-0 pb-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={(e) => {
            e.stopPropagation()
            onFavorite()
          }}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart
            className={cn(
              "h-5 w-5",
              isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground"
            )}
          />
        </Button>
      </CardFooter>
    </Card>
  )
}
