import Link from "next/link";

export default function NotFound() {
  return (
    <div className="absolute inset-0 size-full flex items-center justify-center">
      <div className="flex items-center">
        <div className="space-y-3 pr-4 border-r-2 border-r-border">
          <h1 className="text-3xl font-bold">404 - Plainte Introuvable</h1>
          <p className="text-foreground-muted text-sm">
            La plainte recherchée n&apos;existe pas ou a été supprimée.
          </p>
        </div>
        <Link
          className="ml-4 px-3 py-2 rounded-xl border border-border bg-card hover:border-foreground-muted transition-colors"
          href="/"
        >
          Retourner à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
