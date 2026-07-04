"use client";
import { Paperclip } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Files from "./Files";
import { FilesList } from "@/lib/complaint/types";
import { useFilesTabOpen } from "../context/MessageContext";

export default function MessageInput({ filesList }: { filesList: FilesList }) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [message, setMessage] = useState<string>("");

  const [anim, setAnim] = useState<{ visible: boolean; cls: string }>({
    visible: false,
    cls: "",
  });

  const { filesTabOpen, setFilesTabOpen } = useFilesTabOpen();

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    const next = Math.min(ta.scrollHeight, 140);
    ta.style.height = `${next}px`;
    ta.style.overflowY = ta.scrollHeight > 140 ? "auto" : "hidden";
  }, [message]);

  useEffect(() => {
    if (filesTabOpen) {
      const raf1 = requestAnimationFrame(() => {
        setAnim({ visible: true, cls: "" });
        requestAnimationFrame(() =>
          setAnim({ visible: true, cls: "slide-in" }),
        );
      });
      return () => cancelAnimationFrame(raf1);
    } else {
      const raf = requestAnimationFrame(() =>
        setAnim((prev) => ({ ...prev, cls: "slide-out" })),
      );
      const t = setTimeout(() => setAnim({ visible: false, cls: "" }), 200);
      return () => {
        cancelAnimationFrame(raf);
        clearTimeout(t);
      };
    }
  }, [filesTabOpen]);

  const handleSend = () => {
    if (!message.trim()) return;
    setMessage("");
  };

  return (
    <div className="border-t border-border bg-background">
      <div className="lg:px-4 py-3 max-lg:pb-0 max-w-[1440px] mx-auto lg:grid-cols-[300px_1fr] lg:grid">
        {anim.visible && (
          <div
            className={`lg:hidden p-8 absolute inset-0 z-50 bg-background overflow-y-auto [&::-webkit-scrollbar]:hidden ${anim.cls}`}
          >
            <Files filesList={filesList} />
          </div>
        )}

        {anim.visible && (
          <div className="absolute inset-0 size-full bg-background z-40"></div>
        )}
        <div className="max-lg:hidden"></div>
        <div className="flex items-center gap-2.5 w-full mx-auto">
          <button
            type="button"
            onClick={() => setFilesTabOpen(true)}
            className="lg:hidden flex items-center justify-center rounded-full p-2 border border-border bg-card"
          >
            <Paperclip size={18} className="text-foreground-muted" />
          </button>
          <textarea
            ref={textareaRef}
            rows={1}
            className="flex-1 resize-none rounded-[14px] border border-border bg-card px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-foreground/40 transition-colors [&::-webkit-scrollbar]:hidden scrollbar-none"
            style={{ minHeight: "44px", maxHeight: "140px", lineHeight: "1.5" }}
            placeholder="Votre message…"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!message.trim()}
            aria-label="Envoyer"
            className={`flex items-center justify-center shrink-0 w-10 h-10 rounded-xl bg-foreground text-background disabled:opacity-25 disabled:pointer-events-none hover:opacity-85 active:scale-95 transition-all duration-100`}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="19" x2="12" y2="5" />
              <polyline points="5 12 12 5 19 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
