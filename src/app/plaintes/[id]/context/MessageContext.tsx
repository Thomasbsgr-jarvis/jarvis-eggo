"use client";

import {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
} from "react";

interface FilesTabOpenContextType {
  filesTabOpen: boolean;
  setFilesTabOpen: Dispatch<SetStateAction<boolean>>;
}

const FilesTabOpenContext = createContext<FilesTabOpenContextType | null>(null);

export function FilesTabOpenProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [filesTabOpen, setFilesTabOpen] = useState<boolean>(false);
  return (
    <FilesTabOpenContext.Provider value={{ filesTabOpen, setFilesTabOpen }}>
      {children}
    </FilesTabOpenContext.Provider>
  );
}

export const useFilesTabOpen = () => {
  const ctx = useContext(FilesTabOpenContext);
  if (!ctx)
    throw new Error("useFilesTabOpen must be used within FilesTabOpenProvider");
  return ctx;
};
