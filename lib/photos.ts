import { z } from "zod"

export const PhotoSchema = z.object({
  id: z.string(),
  src: z.string(),
  title: z.string().min(1, "Title is required"),
  location: z.string().min(1, "Location is required"),
  date: z.string().min(1, "Date is required"),
  description: z.string(),
})

export const PhotosArraySchema = z.array(PhotoSchema)

export type Photo = z.infer<typeof PhotoSchema>

export type PhotoFormData = Omit<Photo, "id" | "src">
