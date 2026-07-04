"use client";

import { newComplaint } from "@/actions/form";
import Input from "@/components/forms/Input";
import Label from "@/components/forms/Label";
import { NewComplaintResult } from "@/lib/complaint/types";
import {
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "@/components/forms/Forms.module.css";
import Textarea from "@/components/forms/Textarea";
import { Paperclip, X } from "lucide-react";
import { NewComplaintSchema } from "@/lib/complaint/schemas";
import { useRouter } from "next/navigation";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];

export default function Form() {
  const [clientError, setClientError] = useState<string | null>(null);
  const [fields, setFields] = useState({ folderId: "", content: "" });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);
  const [state, action, isPending] = useActionState<
    NewComplaintResult,
    FormData
  >(newComplaint, {
    success: false,
    error: "",
  });

  const errorMessage = clientError ?? (!state.success ? state.error : null);

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      const timer = setTimeout(() => {
        router.replace(`/plaintes/${state.id}`);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [state, router]);

  function removeFile(index: number) {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  }

  function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} o`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
  }

  function handleDragEnter(e: React.DragEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isPending || state.success) return;
    dragCounter.current += 1;
    setIsDragging(true);
  }

  function handleDragLeave(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    dragCounter.current -= 1;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    dragCounter.current = 0;
    setIsDragging(false);
    if (isPending || state.success) return;
    handleFiles(e.dataTransfer.files);
  }

  function validateFile(file: File): string | null {
    if (file.size > MAX_FILE_SIZE) {
      return `${file.name} dépasse la taille maximale de 10 Mo`;
    }
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return `${file.name} : type de fichier non supporté`;
    }
    return null;
  }

  function handleFiles(fileList: FileList | null) {
    if (!fileList) return;
    const incoming = Array.from(fileList);

    for (const file of incoming) {
      const error = validateFile(file);
      if (error) {
        setClientError(error);
        return;
      }
    }

    setClientError(null);
    setSelectedFiles((prev) => {
      const existingKeys = new Set(
        prev.map((f) => `${f.name}-${f.size}-${f.lastModified}`),
      );
      const deduped = incoming.filter(
        (f) => !existingKeys.has(`${f.name}-${f.size}-${f.lastModified}`),
      );
      return [...prev, ...deduped];
    });
  }

  function validateForm(): string | null {
    const result = NewComplaintSchema.safeParse({
      folderId: fields.folderId,
      content: fields.content,
    });
    if (!result.success) return result.error.issues[0].message;
    return null;
  }

  function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    const error = validateForm();
    if (error) {
      setClientError(error);
      return;
    }
    setClientError(null);

    const formData = new FormData();
    formData.append("folderId", fields.folderId);
    formData.append("content", fields.content);
    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });

    startTransition(() => {
      action(formData);
    });
  }

  return (
    <>
      <div
        className={`absolute z-50 inset-0 size-full flex flex-col items-center justify-center gap-4 transition-opacity ${
          isDragging
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        style={{
          background:
            "radial-gradient(ellipse at center, hsl(0,0%,16%) 0%, hsl(0,0%,9%,0.97) 100%)",
        }}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="pointer-events-none flex flex-col items-center gap-5">
          <div className="rounded-2xl border border-dashed border-foreground-muted/50 bg-card p-6">
            <Paperclip className="text-foreground-muted" size={28} />
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <p className="text-foreground text-sm font-medium">
              Déposez vos fichiers ici
            </p>
            <p className="text-foreground-muted text-xs">
              PDF, JPEG, PNG, GIF, WebP — 10 Mo max
            </p>
          </div>
        </div>
      </div>
      <form
        onSubmit={handleSubmit}
        onDragEnter={handleDragEnter}
        className="w-full space-y-8 px-5"
      >
        <div className="space-y-5">
          <div className={styles.inputGroup}>
            <Label text="Numéro de dossier" inputId="folderId" />
            <Input
              placeholder="AAA123456"
              disabled={isPending || state.success}
              name="folderId"
              id="folderId"
              autoComplete="id"
              value={fields.folderId}
              onChange={(e) => {
                setFields((p) => ({ ...p, folderId: e.target.value }));
                setClientError(null);
              }}
            />
          </div>
          <div className={styles.inputGroup}>
            <Label text="Contenu de la plainte" inputId="content" />
            <Textarea
              placeholder="Collez ici le texte brut de l'email du client..."
              disabled={isPending || state.success}
              name="content"
              id="content"
              autoComplete="message"
              rows={10}
              value={fields.content}
              onChange={(e) => {
                setFields((p) => ({ ...p, content: e.target.value }));
                setClientError(null);
              }}
            />
          </div>
          <div className={styles.inputGroup}>
            <Label text="Pièces jointes (Optionnel)" inputId="files" />
            <input
              type="file"
              multiple
              ref={fileInputRef}
              className="hidden"
              onChange={(e) => {
                handleFiles(e.target.files);
                e.target.value = "";
              }}
              disabled={isPending || state.success}
            />
            <button
              id="files"
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex gap-3 sm:gap-5 items-center py-4 sm:py-6 px-3 sm:px-4 justify-center mt-2 rounded-xl border bg-card cursor-pointer transition-colors border-border border-dotted"
              disabled={isPending || state.success}
            >
              <Paperclip className="text-foreground-muted" size={16} />
              <span className="max-sm:hidden text-sm text-foreground-muted">
                Glissez vos fichiers ici ou cliquez pour parcourir
              </span>
              <span className="text-xs sm:hidden text-foreground-muted text-left">
                Cliquez pour ajouter un fichier
              </span>
            </button>

            {selectedFiles.length > 0 && (
              <ul className="space-y-2 mt-3">
                {selectedFiles.map((file, index) => (
                  <li
                    key={`${file.name}-${file.size}-${file.lastModified}`}
                    className="flex items-center justify-between gap-3 py-2 px-3 rounded-lg border border-border bg-card text-sm cursor-default"
                  >
                    <div className="flex gap-2 items-center min-w-0 ">
                      <Paperclip className="text-foreground-muted" size={16} />
                      <span className="truncate text-foreground-muted">
                        {file.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs text-foreground-muted">
                        {formatFileSize(file.size)}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        disabled={isPending || state.success}
                        className="cursor-pointer text-foreground-muted hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <X className="text-foreground-muted" size={16} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {errorMessage && (
            <p className="text-sm text-red-400">{errorMessage}</p>
          )}
          {state.success && (
            <p className="text-sm text-green-400">{state.message}</p>
          )}
          <div className="w-full flex justify-end">
            <button
              type="submit"
              disabled={isPending || state.success}
              className="w-fit py-3 px-5 rounded-xl bg-black/80 text-foreground-muted cursor-pointer hover:bg-black/40 hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Analyser la plainte
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
