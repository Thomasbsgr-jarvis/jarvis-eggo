"use server"

import { NewComplaintData, NewComplaintResult } from "@/lib/complaint/types";
import { apiFetch } from "@/lib/http/fetch";
import { MESSAGES } from "@/lib/http/messages";
import { sendFile } from "@/lib/http/s3";
import logger from "@/lib/logger";
import { getAccessCookie } from "@thomasbsgr-jarvis/jarvis-auth-next/server";
import { createHash } from "crypto";
import { redirect } from "next/navigation";

const UNEXPECTED = "Une erreur est survenue." as const

class TokenError extends Error {}

export async function newComplaint(prevState: NewComplaintResult, formData: FormData): Promise<NewComplaintResult> {
  try {
    const folderId = formData.get("folderId") as string;
    const content = formData.get("content") as string;

    const token = await getAccessCookie()
    if (!token) {
      throw new TokenError()
    }

    const res = await apiFetch<NewComplaintData>("/eggo/complaints", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ folderId, content }),
    })
    if (!res.ok) {
      if (res.status === 500) {
        logger.warn({ err: res.error }, "newComplaint: Internal server error:")
        return {success: false, error: MESSAGES.UNEXPECTED}
      }
      if (res.status === 409) {
        return { success: true, message: "Plainte déjà créée, redirection...", id: res.data?.id ?? "" }
      }
      return {success: false, error: res.error}
    }

    const complaintId = res.data.id

    const files = formData.getAll("files").filter((f): f is File => f instanceof File);

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const hash = createHash("md5").update(buffer).digest("hex")
      const url = `complaints/${complaintId}/${hash}_${file.name}`
      await sendFile(buffer, file.name, url, file.type)
      const res = await apiFetch("/eggo/files", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ complaintId, hash, name: file.name, url }),
      })
      if (!res.ok) {
        logger.warn({err: res.error}, "Api error: NewFile:")
        continue
      }
    }

    return {success: true, message: "Plainte créée avec succès", id: complaintId}
  } catch (err) {
    if (err instanceof TokenError) {
      redirect("/auth")
    }
    logger.error({ err }, "newComplaint error:")
    return {success: false, error: UNEXPECTED}
  }
}
