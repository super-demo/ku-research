export interface SiteTree {
  site_id: number
  site_type_id: number
  name: string
  description: string
  short_description: string
  url: string
  image_url: string
  created_at: string
  updated_at: string
  updated_by: string
  created_by: string
  deleted_at: string
  site_parent_id: number
  site_parent_name: string
  depth: number
  path: number
}
