"use client";
import { useActionState, useState, useEffect } from "react";
import { register } from "@/actions/auth";
import styles from "@/components/forms/Forms.module.css";
import Label from "../../../../components/forms/Label";
import Input from "../../../../components/forms/Input";
import { useRouter } from "next/navigation";
import {
  AuthResult,
  RegisterSchema,
} from "@thomasbsgr-jarvis/jarvis-auth-next";

export default function Signup() {
  const [step, setStep] = useState<1 | 2>(1);
  const [clientError, setClientError] = useState<string | null>(null);
  const [fields, setFields] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [state, action, isPending] = useActionState<AuthResult, FormData>(
    register,
    {
      success: false,
      error: "",
    },
  );

  const errorMessage = clientError ?? (!state.success ? state.error : null);

  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      const timer = setTimeout(() => {
        router.replace("/");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [state.success, router]);

  function validateStep1(): string | null {
    const result = RegisterSchema.pick({
      fullName: true,
      email: true,
    }).safeParse({
      fullName: fields.fullName,
      email: fields.email,
    });
    if (!result.success) return result.error.issues[0].message;
    return null;
  }

  function validateStep2(): string | null {
    const result = RegisterSchema.pick({ password: true }).safeParse({
      password: fields.password,
    });
    if (!result.success) return result.error.issues[0].message;

    const password = fields.password as string;
    const confirmPassword = fields.confirmPassword as string;
    if (password !== confirmPassword)
      return "Les mots de passe ne correspondent pas.";

    return null;
  }

  function handleNextStep() {
    const error = validateStep1();
    if (error) return setClientError(error);
    setClientError(null);
    setStep(2);
  }

  function handlePreviousStep() {
    setClientError(null);
    setStep(1);
  }

  function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    const error = validateStep2();
    if (error) {
      e.preventDefault();
      return setClientError(error);
    }
    setClientError(null);
  }

  return (
    <form onSubmit={handleSubmit} action={action} className="w-full space-y-8">
      <div className="space-y-5">
        {/* Étape 1 */}
        {step === 1 && (
          <>
            <div className={styles.inputGroup}>
              <Label text="Nom complet" inputId="fullName" />
              <Input
                placeholder="Votre nom"
                disabled={isPending || state.success}
                autoComplete="name"
                name="fullName"
                id="fullName"
                value={fields.fullName}
                onChange={(e) => {
                  setFields((p) => ({ ...p, fullName: e.target.value }));
                  setClientError(null);
                }}
              />
            </div>
            <div className={styles.inputGroup}>
              <Label text="Email" inputId="email" />
              <Input
                placeholder="vous@exemple.com"
                name="email"
                disabled={isPending || state.success}
                autoComplete="email"
                id="email"
                value={fields.email}
                onChange={(e) => {
                  setFields((p) => ({ ...p, email: e.target.value }));
                  setClientError(null);
                }}
              />
            </div>
          </>
        )}

        {/* Étape 2 */}
        {step === 2 && (
          <>
            <input type="hidden" name="fullName" value={fields.fullName} />
            <input type="hidden" name="email" value={fields.email} />

            <div className={styles.inputGroup}>
              <Label text="Mot de passe" inputId="password" />
              <Input
                placeholder="••••••••"
                type="password"
                disabled={isPending || state.success}
                autoComplete="new-password"
                name="password"
                id="password"
                value={fields.password}
                onChange={(e) => {
                  setFields((p) => ({ ...p, password: e.target.value }));
                  setClientError(null);
                }}
                onFocus={() => {
                  setFields((p) => ({ ...p, password: "" }));
                }}
              />
            </div>
            <div className={styles.inputGroup}>
              <Label
                text="Confirmez le mot de passe"
                inputId="confirmPassword"
              />
              <Input
                placeholder="••••••••"
                type="password"
                disabled={isPending || state.success}
                autoComplete="new-password"
                name="confirmPassword"
                id="confirmPassword"
                value={fields.confirmPassword}
                onChange={(e) => {
                  setFields((p) => ({ ...p, confirmPassword: e.target.value }));
                  setClientError(null);
                }}
                onFocus={() => {
                  setFields((p) => ({ ...p, confirmPassword: "" }));
                }}
              />
            </div>
          </>
        )}
      </div>

      {errorMessage && <p className="text-sm text-red-400">{errorMessage}</p>}
      {state.success && (
        <p className="text-sm text-green-400">{state.message}</p>
      )}

      {/* Barre d'actions / Boutons */}
      <div className="flex gap-4">
        {step === 1 ? (
          <button
            type="button"
            onClick={handleNextStep}
            className="w-full py-3 px-5 rounded-xl bg-black/80 text-foreground-muted cursor-pointer hover:bg-black/40 hover:text-foreground transition-colors"
          >
            Suivant
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={handlePreviousStep}
              disabled={isPending || state.success}
              className="w-full py-3 px-5 rounded-xl bg-black/80 text-foreground-muted cursor-pointer hover:bg-black/40 hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Retour
            </button>
            <button
              type="submit"
              disabled={isPending || state.success}
              className="w-full py-3 px-5 rounded-xl bg-black/80 text-foreground-muted cursor-pointer hover:bg-black/40 hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending
                ? "Chargement..."
                : state.success
                  ? "Redirection..."
                  : "S'inscrire"}
            </button>
          </>
        )}
      </div>
    </form>
  );
}
