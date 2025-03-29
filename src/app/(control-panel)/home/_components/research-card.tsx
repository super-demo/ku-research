"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { FileText, Heart } from "lucide-react"
import { useSession } from "next-auth/react"
import Image from "next/image"

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
  const { data: session } = useSession()
  const userId = session?.user?.jwt?.userId
    ? Number(session.user.jwt.userId)
    : undefined

  // Check if the current user is the owner
  const isOwner = userId !== undefined && paper.owner === userId

  // Determine visibility badge content
  const getVisibilityBadge = () => {
    if (!paper.isPublic) {
      return { text: "Private", variant: "destructive" as const }
    }

    switch (paper.publicOption) {
      case "workspace":
        return { text: "Workspace", variant: "secondary" as const }
      case "site":
        return { text: "Organization", variant: "default" as const }
      case "everyone":
        return { text: "Public", variant: "outline" as const }
      default:
        return { text: "Unknown", variant: "outline" as const }
    }
  }

  const visibilityBadge = getVisibilityBadge()

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
          className="object-cover"
          priority
        />
        <div className="absolute top-2 right-2 left-2 flex items-center justify-between">
          <Badge variant="secondary" className="text-xs font-normal">
            {paper.field}
          </Badge>

          {isOwner && (
            <Badge variant="destructive" className="text-xs font-normal">
              Your Paper
            </Badge>
          )}
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

          <div className="mt-1 flex items-center gap-1">
            <Badge variant={visibilityBadge.variant} className="text-xs">
              {visibilityBadge.text}
            </Badge>
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
