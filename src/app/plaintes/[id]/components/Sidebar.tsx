"use client";

import { FilesList } from "@/lib/complaint/types";
import Files from "./Files";

export default function Sidebar({ filesList }: { filesList: FilesList }) {
  return (
    <div className="max-lg:hidden overflow-y-auto min-h-0 mb-3 [&::-webkit-scrollbar]:hidden scrollbar-none">
      <Files filesList={filesList} />
    </div>
  );
}
