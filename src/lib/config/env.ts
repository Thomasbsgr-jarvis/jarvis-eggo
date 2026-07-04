import { z } from "zod"

const envSchema = z.object({
  API_URL: z.url("API_URL must be a valid URL"),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  NEXT_PUBLIC_LOGIN_ROUTE: z.string().min(1, "LOGIN_ROUTE is required"),
  NEXT_PUBLIC_HOME_ROUTE: z.string().min(1, "HOME_ROUTE is required"),
  S3_ACCESS_KEY: z.string().min(1, "S3_ACCESS_KEY is required"),
  S3_SECRET_KEY: z.string().min(1, "S3_SECRET_KEY is required"),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
})

export type Env = z.infer<typeof envSchema>

export function validateEnv(): Env {
  const result = envSchema.safeParse(process.env)

  if (!result.success) {
    const errors = result.error.issues
      .map((e, i) => `  ${i + 1}) ${e.path.join(".")}: ${e.message}`)
      .join("\n")
    throw new Error(`\n\n❌ Variables d'environnement manquantes ou invalides:\n${errors}\n`)
  }

  return result.data
}

export const env = validateEnv()
