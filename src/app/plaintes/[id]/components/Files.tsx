"use client";

import { FilesList } from "@/lib/complaint/types";
import { Paperclip, Trash2, X } from "lucide-react";
import { useFilesTabOpen } from "../context/MessageContext";

export default function Files({ filesList }: { filesList: FilesList }) {
  const { setFilesTabOpen } = useFilesTabOpen();

  return (
    <div className="space-y-3 overflow-y-auto min-h-0 max-lg:max-w-[400px] max-lg:mx-auto">
      <div className="lg:hidden w-full flex items-center justify-end">
        <button
          type="button"
          onClick={() => setFilesTabOpen(false)}
          className="p-2 rounded-full border border-border bg-card flex items-center justify-center"
        >
          <X size={20} className="text-foreground-muted" />
        </button>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase">Pièce jointe</p>
        <p className="text-foreground-muted text-xs">
          {String(filesList.length).padStart(2, "0")}
        </p>
      </div>
      <button
        type="button"
        className="w-full cursor-pointer py-2.5 px-3 border-dashed hover:bg-card transition-colors border border-border rounded-xl"
      >
        <div className="w-full flex items-center justify-center gap-2">
          <Paperclip size={14} className="text-foreground-muted" />
          <span className="text-xs ">Ajouter un fichier</span>
        </div>
      </button>
      {filesList.length === 0 ? (
        <div className="py-6 px-3 border border-border bg-card rounded-xl">
          <p className="w-full text-center text-sm text-foreground-muted">
            Aucun fichier
          </p>
        </div>
      ) : (
        filesList.map((file, index) => (
          <div
            key={index}
            className="group py-2.5 px-3 border hover:border-foreground-muted transition-colors border-border bg-card rounded-xl flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Paperclip size={14} className="text-foreground-muted" />
              <div>
                <p className="text-xs">{file.name}</p>
              </div>
            </div>
            <button
              type="button"
              className="lg:hidden items-center justify-center cursor-pointer group-hover:flex"
            >
              <Trash2
                size={14}
                className="text-foreground-muted hover:text-red-700 transition-colors"
              />
            </button>
          </div>
        ))
      )}
    </div>
  );
}
