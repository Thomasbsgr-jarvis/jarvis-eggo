"use server"

import { redirect } from "next/navigation"
import { AuthResult } from "@thomasbsgr-jarvis/jarvis-auth-next"
import logger from "@/lib/logger"
import { register as registerFn, login as loginFn, refresh as refreshFn, logout as logoutFn } from "@thomasbsgr-jarvis/jarvis-auth-next/server"

const UNEXPECTED = "Une erreur est survenue." as const
const REGISTER_SUCCESS = "Votre compte a été créé avec succès." as const
const LOGIN_SUCCESS = "Vous êtes connecté avec succès." as const

export async function register(prevState: AuthResult, formData: FormData): Promise<AuthResult> {
  try {
    const res = await registerFn({
      fullName: formData.get("fullName") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string
    })

    if (!res.success) {
      if (res.status === 500) {
        logger.warn({ err: res.error }, "Register: Internal server error:")
        return {success: false, error: UNEXPECTED}
      }
      return {success: false, error: res.error}
    }
    return {success: true, message: REGISTER_SUCCESS}
  } catch (err) {
    logger.error({err}, "Register error:")
    return {success: false, error: UNEXPECTED}
  }
}

export async function login(prevState: AuthResult, formData: FormData): Promise<AuthResult> {
  try {
    const res = await loginFn({
      email: formData.get("email") as string,
      password: formData.get("password") as string
    })

    if (!res.success) {
      if (res.status === 500) {
        logger.warn({ err: res.error }, "Login: Internal server error:")
        return {success: false, error: UNEXPECTED}
      }
      return {success: false, error: res.error}
    }
    return {success: true, message: LOGIN_SUCCESS}
  } catch (err) {
    logger.error({err}, "Login error:")
    return {success: false, error: UNEXPECTED}
  }
}

export async function refresh() {
  try {
    const res = await refreshFn()
    if (res.success) return
    if (res.status === 500) {
      logger.warn({ err: res.error }, "Refresh: Internal server error:")
    }
  } catch (err) {
    logger.error({ err }, "Refresh error:")
  }
  redirect("/auth")
}

export async function logout() {
  try {
    const res = await logoutFn()
    if (!res.success && res.status === 500) {
      logger.warn({ err: res.error }, "Logout: Internal server error:")
    }
  } catch (err) {
    logger.error({ err }, "Logout error:")
  }
  redirect("/auth")
}
