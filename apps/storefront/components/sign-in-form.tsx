"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";

import { GoogleButton } from "@/components/google-button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormRow,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSignIn } from "@/hooks/use-auth";
import { signInSchema, type SignInValues } from "@/lib/auth-schemas";

export function SignInForm() {
  const { submit, signInWithGoogle, status, error } = useSignIn();

  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
    mode: "onTouched",
  });

  const onSubmit = async (values: SignInValues) => {
    const result = await submit(values);
    if (!result.ok && result.field) {
      form.setError(result.field as "email" | "password", { message: result.error });
    }
  };

  const submitting = status === "submitting";

  if (status === "success") {
    return (
      <p className="text-[14px] text-[var(--ink-soft)] leading-[1.6]">
        Signed in (demo). Wire <code>useSignIn().submit</code> to your real
        auth provider — the schema, validation and form state stay as-is.
      </p>
    );
  }

  return (
    <>
      <GoogleButton
        label="Continue with Google"
        onClick={signInWithGoogle}
        disabled={submitting}
      />

      <div className="auth-divider" role="separator">
        or
      </div>

      <Form {...form}>
        <form
          className="auth-form"
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormRow>
                  <FormLabel>Email</FormLabel>
                </FormRow>
                <FormControl>
                  <Input
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    placeholder="you@kurzeme.lv"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormRow>
                  <FormLabel>Password</FormLabel>
                  <Link href="#" className="link-mini">
                    Forgot?
                  </Link>
                </FormRow>
                <FormControl>
                  <Input
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {error && (
            <p className="text-[12px] text-[var(--accent-deep)]">{error}</p>
          )}

          <button type="submit" className="auth-cta" disabled={submitting}>
            <span>{submitting ? "Signing in…" : "Sign in"}</span>
            <span>→</span>
          </button>
        </form>
      </Form>
    </>
  );
}
