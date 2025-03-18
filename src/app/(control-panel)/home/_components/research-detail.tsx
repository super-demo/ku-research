"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { useMediaQuery } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { BookOpen, Calendar, ExternalLink, Heart, X } from "lucide-react"
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

interface ResearchDetailProps {
  paper: ResearchPaper
  isFavorite: boolean
  onFavorite: () => void
  onClose: () => void
}

export function ResearchDetail({
  paper,
  isFavorite,
  onFavorite,
  onClose
}: ResearchDetailProps) {
  // Check if the image is a data URL (uploaded image)
  const isDataUrl = paper.coverImage.startsWith("data:image/")
  const isMobile = useMediaQuery("(max-width: 640px)")

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className={cn(
          "overflow-hidden p-0 [&>button]:hidden",
          isMobile ? "w-[calc(100%-32px)] max-w-full" : "sm:max-w-[700px]"
        )}
      >
        <DialogHeader className="flex flex-row items-start justify-between p-4 pb-0 sm:p-6">
          <div>
            <DialogTitle className="text-lg sm:text-xl">
              {paper.title}
            </DialogTitle>
            <div className="mt-2">
              <Badge variant="secondary">{paper.field}</Badge>
            </div>
          </div>
          <DialogClose asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </DialogClose>
        </DialogHeader>
        <div
          className={cn(
            "grid gap-4 p-4 sm:gap-6 sm:p-6",
            isMobile ? "grid-cols-1" : "sm:grid-cols-[1fr_2fr]"
          )}
        >
          <div className="space-y-4 pb-4">
            <div
              className="relative mx-auto aspect-[3/4] h-full max-h-[200px] sm:mx-0 sm:max-h-[300px]"
              style={{ maxWidth: isMobile ? "200px" : "auto" }}
            >
              <Image
                src={
                  paper.coverImage ||
                  "https://scontent-bkk1-2.xx.fbcdn.net/v/t39.30808-6/476509205_555409170843779_2189911961991409505_n.jpg?stp=dst-jpg_s1080x2048_tt6&_nc_cat=107&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=dvVyY7fKDE4Q7kNvgEUsxY5&_nc_oc=Adm7pMZkVfAy3GQbposPMK9VpKk81CyRhNdrr2JqPgAp0TnQlYyuOJT7nelQ2oDVmBM&_nc_zt=23&_nc_ht=scontent-bkk1-2.xx&_nc_gid=eBOCDkseztFEgrAKMda5Xg&oh=00_AYGH3QWile1EBMI5YsbJZHdZDO8Ut6TAyNEjyCzqITjDEw&oe=67DF7CDD"
                }
                alt={paper.title}
                fill
                className={cn(
                  "rounded-md object-cover",
                  !isDataUrl && "bg-slate-800" // Dark background for research papers
                )}
                sizes="(max-width: 768px) 200px, 300px"
              />
            </div>

            <div className="flex w-full flex-col gap-2 sm:flex-row">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 gap-2"
                onClick={onFavorite}
              >
                <Heart
                  className={cn(
                    "h-4 w-4",
                    isFavorite ? "fill-red-500 text-red-500" : ""
                  )}
                />
                {isFavorite ? "Remove" : "Favorite"}
              </Button>

              {paper.doi && (
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-2"
                  asChild
                >
                  <a
                    href={`https://doi.org/${paper.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View DOI
                  </a>
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col gap-1">
              <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                <Calendar className="h-4 w-4" />
                <span>{paper.publishedYear}</span>

                {paper.journal && (
                  <>
                    <Separator orientation="vertical" className="h-4" />
                    <BookOpen className="h-4 w-4" />
                    <span className="line-clamp-1">{paper.journal}</span>
                  </>
                )}
              </div>

              <h3 className="mt-2 text-sm font-semibold sm:text-base">
                Authors
              </h3>
              <p className="text-sm">{paper.authors}</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold sm:text-base">Abstract</h3>
              <p className="text-muted-foreground text-xs sm:text-sm">
                {paper.abstract}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold sm:text-base">
                Classifications
              </h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {paper.classifications.map((classification) => (
                  <Badge key={classification}>{classification}</Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
