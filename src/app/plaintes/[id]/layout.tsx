import { FilesTabOpenProvider } from "./context/MessageContext";

export default function PlainteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <FilesTabOpenProvider>{children}</FilesTabOpenProvider>;
}
