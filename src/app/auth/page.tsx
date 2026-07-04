import SwitchForms from "./components/SwitchForms";

export default function Auth() {
  return (
    <>
      <div className="absolute inset-0 h-full w-full flex items-center justify-center px-6 py-16">
        <div className="max-w-sm w-full">
          <div className="w-full text-center mb-10">
            <p className="text-3xl font-semibold">Identifiez-vous</p>
            <p className="text-foreground-muted text-sm mt-2.5">
              Remplissez le formulaire pour accéder à votre compte.
            </p>
          </div>
          <SwitchForms />
        </div>
      </div>
    </>
  );
}
