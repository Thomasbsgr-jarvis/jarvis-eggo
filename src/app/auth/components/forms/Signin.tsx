"use client";
import { useActionState, useState, useEffect } from "react";
import { login } from "@/actions/auth";
import Label from "../../../../components/forms/Label";
import Input from "../../../../components/forms/Input";
import styles from "@/components/forms/Forms.module.css";
import { useRouter } from "next/navigation";
import { AuthResult, LoginSchema } from "@thomasbsgr-jarvis/jarvis-auth-next";

export default function Signin() {
  const [clientError, setClientError] = useState<string | null>(null);
  const [fields, setFields] = useState({ email: "", password: "" });
  const [state, action, isPending] = useActionState<AuthResult, FormData>(
    login,
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

  function validateForm(): string | null {
    const result = LoginSchema.safeParse({
      email: fields.email,
      password: fields.password,
    });
    if (!result.success) return result.error.issues[0].message;
    return null;
  }

  function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    const error = validateForm();
    if (error) {
      e.preventDefault();
      return setClientError(error);
    }
    setClientError(null);
  }

  return (
    <form action={action} onSubmit={handleSubmit} className="w-full space-y-8">
      <div className="space-y-5">
        <div className={styles.inputGroup}>
          <Label text="Email" inputId="email" />
          <Input
            placeholder="vous@exemple.com"
            disabled={isPending || state.success}
            autoComplete="email"
            name="email"
            id="email"
            value={fields.email}
            onChange={(e) => {
              setFields((p) => ({ ...p, email: e.target.value }));
              setClientError(null);
            }}
          />
        </div>
        <div className={styles.inputGroup}>
          <Label text="Mot de passe" inputId="password" />
          <Input
            placeholder="••••••••"
            type="password"
            disabled={isPending || state.success}
            autoComplete="current-password"
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
      </div>

      {errorMessage && <p className="text-sm text-red-400">{errorMessage}</p>}
      {state.success && (
        <p className="text-sm text-green-400">{state.message}</p>
      )}

      <button
        type="submit"
        disabled={isPending || state.success}
        className="w-full py-3 px-5 rounded-xl bg-black/80 text-foreground-muted cursor-pointer hover:bg-black/40 hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending
          ? "Chargement..."
          : state.success
            ? "Redirection..."
            : "Se connecter"}
      </button>
    </form>
  );
}
