import { z } from "zod"

export const NewComplaintSchema = z.object({
  folderId: z.string().min(1, "Le numéro de dossier est requis."),
  content: z.string().min(1, "Le contenu de la plainte est vide."),
})
