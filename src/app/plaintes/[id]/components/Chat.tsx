"use client";

import { Messages } from "@/lib/complaint/types";
import { name } from "@/lib/config/app";
import { User } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef } from "react";

export default function Chat({
  messages,
  fullName,
}: {
  messages: Messages;
  fullName: string;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "instant" });
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="overflow-y-auto space-y-5 flex-1 min-h-0">
      {messages.map((msg, i) => (
        <div className="flex gap-4 group" key={i}>
          <div
            className={`p-2 w-fit h-fit rounded-lg max-lg:hidden border border-border bg-card shrink-0 ${msg.role !== "assistant" && "hidden"}`}
          >
            <Image
              loading="eager"
              src="/icon.svg"
              alt="Logo"
              width={14}
              height={14}
            />
          </div>
          <div
            className={`flex flex-col gap-3 w-full ${msg.role === "user" ? "items-end" : ""}`}
          >
            <p className="uppercase text-xs text-foreground-muted">
              {msg.role === "assistant" ? `${name} - Eggo` : `${fullName}`}
            </p>
            <div className="lg:w-8/12 w-11/12 space-y-2">
              <p className="space-y-2 bg-card p-3 rounded-xl border border-border">
                {msg.content}
              </p>
              <p
                className={`text-xs w-full ${msg.role === "user" && "text-right"}`}
              >
                {msg.created_at}
              </p>
            </div>
          </div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
