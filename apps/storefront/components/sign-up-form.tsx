"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
import { useSignUp } from "@/hooks/use-auth";
import { signUpSchema, type SignUpValues } from "@/lib/auth-schemas";

export function SignUpForm() {
  const { submit, signUpWithGoogle, status, error } = useSignUp();

  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: "", email: "", password: "" },
    mode: "onTouched",
  });

  const onSubmit = async (values: SignUpValues) => {
    const result = await submit(values);
    if (!result.ok && result.field) {
      form.setError(result.field, { message: result.error });
    }
  };

  const submitting = status === "submitting";

  if (status === "success") {
    return (
      <p className="text-[14px] text-[var(--ink-soft)] leading-[1.6]">
        Account created (demo). Wire <code>useSignUp().submit</code> to your
        real auth provider — the schema, validation and form state stay
        as-is.
      </p>
    );
  }

  return (
    <>
      <GoogleButton
        label="Sign up with Google"
        onClick={signUpWithGoogle}
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormRow>
                  <FormLabel>Name</FormLabel>
                </FormRow>
                <FormControl>
                  <Input
                    type="text"
                    autoComplete="name"
                    placeholder="Jānis"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
                </FormRow>
                <FormControl>
                  <Input
                    type="password"
                    autoComplete="new-password"
                    placeholder="At least 8 characters"
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
            <span>{submitting ? "Creating…" : "Create account"}</span>
            <span>→</span>
          </button>
        </form>
      </Form>
    </>
  );
}
