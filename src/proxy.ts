import { createAuthMiddleware } from "@thomasbsgr-jarvis/jarvis-auth-next/server"
import { public_routes } from "./lib/config/app"

export const proxy = createAuthMiddleware({ publicRoutes: public_routes })

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
}
