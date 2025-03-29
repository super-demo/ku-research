"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
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
import { AlertCircle, Loader2, Upload, X } from "lucide-react"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { researchApi } from "../../../../api/paper/routes"
import { SiteTree } from "../../../../api/site-tree/types"

// Predefined fields for dropdown options
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

// Predefined classifications for dropdown options
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
  const { data: session, status } = useSession()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [newClassification, setNewClassification] = useState("")
  const [workspaces, setWorkspaces] = useState<SiteTree[]>([])
  const [isLoadingWorkspaces, setIsLoadingWorkspaces] = useState(true)

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
      "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/icons/file-text.svg",

    // Visibility-related fields
    userId: session?.user?.jwt?.userId,
    isPublic: false,
    publicOption: "" as "workspace" | "site" | "everyone" | "",
    workspaceSiteID: 0
  })

  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageError, setImageError] = useState("")

  // Get user ID from session and ensure it's a number
  const userId = session?.user?.jwt?.userId
    ? Number(session.user.jwt.userId)
    : undefined

  // For debug purposes, log the user ID
  useEffect(() => {
    if (userId) {
      console.log("Current user ID:", userId)
    } else {
      console.log("No user ID available in session")
    }
  }, [userId])

  const siteTree: SiteTree[] = [
    {
      site_id: 3,
      name: "Science",
      site_type_id: 1,
      path: 101,
      description: "",
      short_description: "",
      url: "",
      image_url: "",
      created_at: "",
      updated_at: "",
      updated_by: "",
      created_by: "",
      deleted_at: "",
      site_parent_id: 0,
      site_parent_name: "",
      depth: 0
    },
    {
      site_id: 8,
      name: "Office",
      site_type_id: 1,
      path: 102,
      description: "",
      short_description: "",
      url: "",
      image_url: "",
      created_at: "",
      updated_at: "",
      updated_by: "",
      created_by: "",
      deleted_at: "",
      site_parent_id: 0,
      site_parent_name: "",
      depth: 0
    },
    {
      site_id: 9,
      name: "Nisit",
      site_type_id: 1,
      path: 201,
      description: "",
      short_description: "",
      url: "",
      image_url: "",
      created_at: "",
      updated_at: "",
      updated_by: "",
      created_by: "",
      deleted_at: "",
      site_parent_id: 0,
      site_parent_name: "",
      depth: 0
    }
  ]

  // Fetch workspaces on component mount
  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        setIsLoadingWorkspaces(true)
        // const siteTree = await GetListSiteTree()
        console.log("Fetched site tree:", siteTree)

        // Filter to only include workspaces (type_id = 1)
        const workspacesOnly = siteTree
          .filter((site) => site.site_type_id === 1)
          .map((site) => ({
            ...site,
            path: typeof site.path === "number" ? site.path : 0 // Ensure 'path' is always a number
          }))
        setWorkspaces(workspacesOnly)
      } catch (error) {
        console.error("Failed to fetch workspaces:", error)
        setError("Could not load workspaces. Please try again.")
      } finally {
        setIsLoadingWorkspaces(false)
      }
    }

    fetchWorkspaces()
  }, [])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string | number) => {
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
      setFormData((prev) => ({ ...prev, coverImage: result }))
    }
    reader.readAsDataURL(file)
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

  const handlePublicOptionChange = (
    value: "workspace" | "site" | "everyone"
  ) => {
    // Reset dependent fields when public option changes
    setFormData((prev) => ({
      ...prev,
      publicOption: value,
      workspaceSiteID: 0
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Verify user is authenticated
    if (!userId) {
      setError("You must be logged in to add a research paper")
      return
    }

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

    // Additional validation for public options
    if (formData.isPublic) {
      if (!formData.publicOption) {
        setError("Please select a public option")
        return
      }

      if (
        formData.publicOption === "workspace" &&
        formData.workspaceSiteID === 0
      ) {
        setError("Please select a workspace")
        return
      }
    }

    try {
      setIsSubmitting(true)

      // Convert publishedYear to number if it's a string
      const publishedYear =
        typeof formData.publishedYear === "string"
          ? parseInt(formData.publishedYear, 10)
          : formData.publishedYear

      // Create the payload with correct types
      const paperData = {
        title: formData.title,
        authors: formData.authors,
        abstract: formData.abstract,
        coverImage: formData.coverImage,
        publishedYear: publishedYear,
        field: formData.field,
        classifications: formData.classifications,
        doi: formData.doi,
        journal: formData.journal,
        isPublic: formData.isPublic,
        publicOption: formData.publicOption,
        workspaceSiteID: formData.workspaceSiteID
      }

      console.log("Submitting paper data:", paperData)

      // Initialize SDK with userId as a number
      await researchApi.addPaper({
        ...formData,
        publishedYear: Number(formData.publishedYear)
      })
      console.log("🚀 ~ handleSubmit ~ formData:", formData)

      // Redirect to the papers page
      router.push("/home")
    } catch (err: any) {
      console.error("Error adding research paper:", err)
      setError(
        `Failed to add research paper: ${err.message || "Please try again."}`
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  // Show loading state while waiting for user data
  if (status === "loading") {
    return (
      <Card className="mx-auto">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center p-8">
            <Loader2 className="text-primary h-8 w-8 animate-spin" />
            <p className="text-muted-foreground mt-4 text-center">
              Loading user data...
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Show error if not authenticated
  if (status === "unauthenticated") {
    return (
      <Card className="mx-auto">
        <CardContent className="pt-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Authentication Error</AlertTitle>
            <AlertDescription>
              You must be logged in to add a research paper. Please log in and
              try again.
            </AlertDescription>
          </Alert>
          <div className="mt-4 flex justify-end">
            <Button onClick={() => router.push("/home")}>Return to Home</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mx-auto">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
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
                Add
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

          {/* Visibility Options Section */}
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label>Visibility *</Label>
              <Select
                value={formData.isPublic ? "public" : "not_public"}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    isPublic: value === "public",
                    publicOption: value === "public" ? prev.publicOption : "" // Maintain public option if still public
                  }))
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not_public">Private (Only You)</SelectItem>
                  <SelectItem value="public">Public</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Public options (only show if Public is selected) */}
            {formData.isPublic && (
              <div className="grid gap-2">
                <Label>Public Access Option *</Label>
                <Select
                  value={formData.publicOption}
                  onValueChange={(value) =>
                    handlePublicOptionChange(
                      value as "workspace" | "site" | "everyone"
                    )
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select public access option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="workspace">
                      Specific Workspace
                    </SelectItem>
                    <SelectItem value="site">Site</SelectItem>
                    <SelectItem value="everyone">Everyone</SelectItem>
                  </SelectContent>
                </Select>

                {/* Workspace Selection (only if workspace option selected) */}
                {formData.publicOption === "workspace" && (
                  <div className="mt-2 grid gap-2">
                    <Label>Select Workspace *</Label>
                    <Select
                      value={
                        formData.workspaceSiteID
                          ? formData.workspaceSiteID.toString()
                          : ""
                      }
                      onValueChange={(value) =>
                        handleSelectChange("workspaceSiteID", parseInt(value))
                      }
                      disabled={isLoadingWorkspaces}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            isLoadingWorkspaces
                              ? "Loading workspaces..."
                              : "Choose a workspace"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {workspaces.map((workspace) => (
                          <SelectItem
                            key={workspace.site_id}
                            value={workspace.site_id.toString()}
                          >
                            {workspace.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/home")}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
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
