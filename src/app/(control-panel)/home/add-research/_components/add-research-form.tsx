"use client"

import { cn } from "@/lib/utils"
import { AlertCircle, Loader2, Plus, Upload, X } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useRef, useState } from "react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useMediaQuery } from "@/hooks/use-mobile"
import { researchApi } from "../../../../api/paper/routes"

// Predefined fields and classifications for dropdown options
const PREDEFINED_FIELDS = [
  "Computer Science",
  "Biology",
  "Chemistry",
  "Physics",
  "Mathematics",
  "Medicine",
  "Engineering",
  "Psychology",
  "Economics",
  "other"
]

const PREDEFINED_CLASSIFICATIONS = [
  "AI",
  "Machine Learning",
  "Data Science",
  "Natural Language Processing",
  "Computer Vision",
  "Blockchain",
  "Quantum Computing",
  "Genetics",
  "Neuroscience",
  "Robotics",
  "Sustainable Energy",
  "Climate Science"
]

export default function AddResearchPaper() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [newClassification, setNewClassification] = useState("")
  const isMobile = useMediaQuery("(max-width: 768px)")

  const [formData, setFormData] = useState({
    title: "",
    authors: "",
    abstract: "",
    publishedYear: new Date().getFullYear(),
    field: "",
    classifications: [] as string[],
    doi: "",
    journal: "",
    coverImage:
      "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/icons/file-text.svg"
  })

  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageError, setImageError] = useState("")

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageError("")
    const file = e.target.files?.[0]

    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setImageError("Please select an image file")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setImageError("Image size should be less than 5MB")
      return
    }

    // Show preview immediately
    const reader = new FileReader()
    reader.onload = (event) => {
      const result = event.target?.result as string
      setImagePreview(result)
    }
    reader.readAsDataURL(file)

    // Upload to Google Drive
    try {
      setIsUploading(true)
      const uploadFormData = new FormData()
      uploadFormData.append("file", file)

      const response = await fetch("/api/uploader", {
        method: "POST",
        body: uploadFormData
      })

      if (!response.ok) {
        throw new Error("Failed to upload image")
      }

      const data = await response.json()
      setFormData((prev) => ({ ...prev, coverImage: data.imageUrl }))
    } catch (error) {
      console.error("Error uploading image:", error)
      setImageError("Failed to upload image. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setImagePreview(null)
    setFormData((prev) => ({
      ...prev,
      coverImage:
        "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/icons/file-text.svg"
    }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleAddClassification = () => {
    if (!newClassification.trim()) return

    if (formData.classifications.includes(newClassification)) {
      return
    }

    setFormData((prev) => ({
      ...prev,
      classifications: [...prev.classifications, newClassification]
    }))

    setNewClassification("")
  }

  const handleRemoveClassification = (classification: string) => {
    setFormData((prev) => ({
      ...prev,
      classifications: prev.classifications.filter((c) => c !== classification)
    }))
  }

  const handleClassificationSelect = (classification: string) => {
    if (formData.classifications.includes(classification)) {
      handleRemoveClassification(classification)
    } else {
      setFormData((prev) => ({
        ...prev,
        classifications: [...prev.classifications, classification]
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Prevent submission if an image is still uploading
    if (isUploading) {
      setError("Please wait for image upload to complete")
      return
    }

    // Basic validation
    if (!formData.title.trim()) {
      setError("Title is required")
      return
    }

    if (!formData.authors.trim()) {
      setError("Authors are required")
      return
    }

    if (!formData.field) {
      setError("Field is required")
      return
    }

    if (formData.classifications.length === 0) {
      setError("At least one classification is required")
      return
    }

    try {
      setIsSubmitting(true)

      // Submit the paper using the API service
      await researchApi.addPaper({
        ...formData,
        publishedYear: Number(formData.publishedYear)
      })

      // Redirect to home page on success
      router.push("/")
    } catch (err) {
      setError("Failed to add research paper. Please try again.")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="mx-auto">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div
            className={cn(
              "grid gap-6",
              isMobile ? "grid-cols-1" : "md:grid-cols-[1fr_2fr]"
            )}
          >
            <div className="space-y-4">
              <Label>Cover Image</Label>
              <div className="flex flex-col items-center gap-4">
                <div className="relative mx-auto aspect-[3/4] w-full max-w-[200px] overflow-hidden rounded-md border bg-slate-100">
                  {imagePreview ? (
                    <>
                      <Image
                        src={imagePreview}
                        alt="Cover preview"
                        fill
                        className={`object-cover ${isUploading ? "opacity-50" : ""}`}
                      />
                      {isUploading && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
                        </div>
                      )}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="bg-background/80 absolute top-2 right-2 h-8 w-8 rounded-full backdrop-blur-sm"
                        onClick={handleRemoveImage}
                        disabled={isUploading}
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Remove image</span>
                      </Button>
                    </>
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-1 p-4 text-center">
                      <Upload className="text-muted-foreground h-8 w-8" />
                      <p className="text-muted-foreground text-sm">
                        Drag & drop or click to upload
                      </p>
                      {isUploading && (
                        <div className="border-primary mt-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></div>
                      )}
                    </div>
                  )}
                </div>

                <div className="w-full">
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="cursor-pointer text-sm"
                    disabled={isUploading}
                  />
                  {imageError && (
                    <p className="text-destructive mt-1 text-sm">
                      {imageError}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter research paper title"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="authors">Authors *</Label>
                <Input
                  id="authors"
                  name="authors"
                  value={formData.authors}
                  onChange={handleChange}
                  placeholder="Enter authors (e.g., Dr. John Smith, Dr. Jane Doe)"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="abstract">Abstract *</Label>
                <Textarea
                  id="abstract"
                  name="abstract"
                  value={formData.abstract}
                  onChange={handleChange}
                  placeholder="Enter research abstract"
                  rows={4}
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="publishedYear">Published Year</Label>
              <Input
                id="publishedYear"
                name="publishedYear"
                type="number"
                value={formData.publishedYear}
                onChange={handleChange}
                min="1900"
                max={new Date().getFullYear()}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="field">Field of Study *</Label>
              <Select
                value={formData.field}
                onValueChange={(value) => handleSelectChange("field", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a field" />
                </SelectTrigger>
                <SelectContent>
                  {PREDEFINED_FIELDS.map((field) => (
                    <SelectItem key={field} value={field}>
                      {field}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {formData.field === "other" && (
                <Input
                  className="mt-2"
                  placeholder="Enter new field name"
                  value={formData.field === "other" ? "" : formData.field}
                  onChange={(e) => handleSelectChange("field", e.target.value)}
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="journal">Journal</Label>
              <Input
                id="journal"
                name="journal"
                value={formData.journal}
                onChange={handleChange}
                placeholder="Enter journal name"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="doi">DOI (Digital Object Identifier)</Label>
              <Input
                id="doi"
                name="doi"
                value={formData.doi}
                onChange={handleChange}
                placeholder="e.g., 10.1038/s41586-019-1666-5"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Classifications *</Label>
            <div className="mb-2 flex flex-wrap gap-2">
              {formData.classifications.map((classification) => (
                <Badge
                  key={classification}
                  variant="secondary"
                  className="gap-1 px-3 py-1"
                >
                  {classification}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-1 h-4 w-4 p-0"
                    onClick={() => handleRemoveClassification(classification)}
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Remove {classification}</span>
                  </Button>
                </Badge>
              ))}
              {formData.classifications.length === 0 && (
                <p className="text-muted-foreground text-sm">
                  No classifications selected
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Add a new classification"
                value={newClassification}
                onChange={(e) => setNewClassification(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleAddClassification()
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddClassification}
                disabled={!newClassification.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-2">
              <Label className="text-sm">Existing Classifications</Label>
              <div className="mt-1 flex flex-wrap gap-2">
                {PREDEFINED_CLASSIFICATIONS.map((classification) => (
                  <Badge
                    key={classification}
                    variant={
                      formData.classifications.includes(classification)
                        ? "default"
                        : "outline"
                    }
                    className="cursor-pointer"
                    onClick={() => handleClassificationSelect(classification)}
                  >
                    {classification}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/")}
              disabled={isSubmitting || isUploading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || isUploading}>
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading Image...
                </>
              ) : (
                "Add Research Paper"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
