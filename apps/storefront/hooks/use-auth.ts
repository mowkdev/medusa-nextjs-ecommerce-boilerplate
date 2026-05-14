"use client";

import { useState } from "react";

import type { SignInValues, SignUpValues } from "@/lib/auth-schemas";

/**
 * Auth business logic
 * ----------------------------------------------------------------
 * UI-only shell. The submit handlers below are placeholders — wire
 * them up to a real auth provider (NextAuth, Clerk, Supabase, your
 * own /api/auth/* routes, etc.) in one place and the forms will
 * inherit it.
 */

type Status = "idle" | "submitting" | "success" | "error";

type AuthResult =
  | { ok: true }
  | { ok: false; error: string; field?: "email" | "password" | "name" };

async function fakeNetwork<T>(value: T, ms = 600): Promise<T> {
  await new Promise((r) => setTimeout(r, ms));
  return value;
}

export function useSignIn() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const submit = async (values: SignInValues): Promise<AuthResult> => {
    setStatus("submitting");
    setError(null);
    try {
      // TODO: replace with real call, e.g.
      //   await signIn("credentials", { email, password, redirect: false })
      const result = await fakeNetwork<AuthResult>({ ok: true });
      if (!result.ok) {
        setStatus("error");
        setError(result.error);
        return result;
      }
      setStatus("success");
      return result;
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Something went wrong";
      setStatus("error");
      setError(msg);
      return { ok: false, error: msg };
    }
  };

  const signInWithGoogle = async (): Promise<AuthResult> => {
    setStatus("submitting");
    setError(null);
    try {
      // TODO: replace with real OAuth call, e.g.
      //   await signIn("google", { callbackUrl: "/" })
      const result = await fakeNetwork<AuthResult>({ ok: true });
      if (!result.ok) {
        setStatus("error");
        setError(result.error);
        return result;
      }
      setStatus("success");
      return result;
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Something went wrong";
      setStatus("error");
      setError(msg);
      return { ok: false, error: msg };
    }
  };

  return { submit, signInWithGoogle, status, error };
}

export function useSignUp() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const submit = async (values: SignUpValues): Promise<AuthResult> => {
    setStatus("submitting");
    setError(null);
    try {
      // TODO: replace with real account creation call.
      const result = await fakeNetwork<AuthResult>({ ok: true });
      if (!result.ok) {
        setStatus("error");
        setError(result.error);
        return result;
      }
      setStatus("success");
      return result;
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Something went wrong";
      setStatus("error");
      setError(msg);
      return { ok: false, error: msg };
    }
  };

  const signUpWithGoogle = async (): Promise<AuthResult> => {
    setStatus("submitting");
    setError(null);
    try {
      // TODO: replace with real OAuth flow.
      const result = await fakeNetwork<AuthResult>({ ok: true });
      if (!result.ok) {
        setStatus("error");
        setError(result.error);
        return result;
      }
      setStatus("success");
      return result;
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Something went wrong";
      setStatus("error");
      setError(msg);
      return { ok: false, error: msg };
    }
  };

  return { submit, signUpWithGoogle, status, error };
}
