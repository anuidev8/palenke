"use client";

import { FormEvent, useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import { useAuth } from "@/lib/auth/AuthContext";

type LoginFormProps = {
  redirectTo: string;
};

export function LoginForm({ redirectTo }: LoginFormProps) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user && !isSubmitting) {
      router.push(redirectTo);
    }
  }, [user, loading, router, redirectTo, isSubmitting]);

  const supabaseReady = useMemo(() => {
    return Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
    );
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    if (!supabaseReady) {
      setErrorMessage(
        "Falta configuración de Supabase. Define NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY.",
      );
      return;
    }

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (!email || !password) {
      setErrorMessage("Correo y contraseña son obligatorios.");
      return;
    }

    setIsSubmitting(true);
    try {
      const supabase = createSupabaseBrowser();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMessage(error.message || "No fue posible iniciar sesión.");
        setIsSubmitting(false); // Only reset on error
        return;
      }

      router.push(redirectTo);
      router.refresh();
      // Keep isSubmitting true during transition to prevent double clicks and avoid flashing the form
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error inesperado al iniciar sesión.";
      setErrorMessage(message);
      setIsSubmitting(false);
    }
  }

  if (loading || (user && !isSubmitting)) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-[color:var(--sand-strong)] border-t-[color:var(--forest)]"></div>
        <p className="mt-4 text-sm font-medium text-[color:var(--forest)] animate-pulse">Verificando sesión...</p>
      </div>
    );
  }

  return (
    <form className="grid gap-5" onSubmit={handleSubmit}>
      <label className="grid gap-2">
        <span className="text-sm font-semibold text-[color:var(--forest)]">
          Correo electrónico<span className="ml-1 text-[color:var(--danger)]">*</span>
        </span>
        <input
          className="input-shell"
          name="email"
          type="email"
          autoComplete="email"
          required
          disabled={isSubmitting}
        />
      </label>

      <label className="grid gap-2">
        <span className="text-sm font-semibold text-[color:var(--forest)]">
          Contraseña<span className="ml-1 text-[color:var(--danger)]">*</span>
        </span>
        <input
          className="input-shell"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          disabled={isSubmitting}
        />
      </label>

      {errorMessage ? (
        <p role="alert" className="text-sm text-[color:var(--danger)]">
          {errorMessage}
        </p>
      ) : null}

      <button type="submit" className="button-primary justify-center" disabled={isSubmitting}>
        {isSubmitting ? "Entrando…" : "Iniciar sesión"}
      </button>
    </form>
  );
}
