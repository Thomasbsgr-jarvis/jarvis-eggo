export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const [{ default: logger }, { validateEnv }] = await Promise.all([
      import("./lib/logger"),
      import("./lib/config/env"),
    ])

    try {
      validateEnv()
      logger.info("Valid environment variables")
    } catch (err) {
      logger.fatal({ err }, "Startup failed: invalid environment variables")
      process.exit(1)
    }
  }
}
