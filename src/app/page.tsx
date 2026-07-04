import Form from "./components/Form";

export default function Home() {
  return (
    <div className="max-w-2xl mx-auto min-h-screen flex flex-col items-center justify-center pt-30 pb-10">
      <h1 className="text-3xl text-foreground font-semibold sm:text-4xl">
        Nouvelle plainte
      </h1>
      <p className="font-medium text-foreground-muted mt-3 mb-10 text-center px-2">
        Collez le contenu de l&apos;e-mail pour démarrer.
      </p>

      <Form />
    </div>
  );
}
