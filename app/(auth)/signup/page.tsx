"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { UsernameField } from "@/components/auth/username-field";
import { checkUsernameAvailable, signUp, usernameFormatError } from "@/lib/auth/actions";

type UsernameStatus = "idle" | "checking" | "available" | "taken" | "invalid";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!username) {
      setUsernameStatus("idle");
      return;
    }
    const formatError = usernameFormatError(username);
    if (formatError) {
      setUsernameStatus("invalid");
      return;
    }

    setUsernameStatus("checking");
    debounceRef.current = setTimeout(async () => {
      const available = await checkUsernameAvailable(username);
      if (available === null) return;
      setUsernameStatus(available ? "available" : "taken");
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [username]);

  const usernameMessage =
    usernameStatus === "invalid"
      ? usernameFormatError(username)
      : usernameStatus === "checking"
        ? "Checking availability…"
        : usernameStatus === "available"
          ? "Available"
          : usernameStatus === "taken"
            ? "That username is already taken."
            : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const formatError = usernameFormatError(username);
    if (formatError) {
      setError(formatError);
      return;
    }
    if (usernameStatus === "taken") {
      setError("That username is already taken.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setSubmitting(true);
    const result = await signUp(username, password);
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error ?? "Something went wrong.");
      return;
    }
    window.location.href = "/dashboard";
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create your FlowState account</CardTitle>
        <CardDescription>Pick a username — you&rsquo;ll use it to log in everywhere.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <UsernameField
            id="signup-username"
            value={username}
            onChange={setUsername}
            status={usernameStatus}
            statusMessage={usernameMessage}
            autoFocus
          />
          <div className="space-y-1.5">
            <Label htmlFor="signup-password">Password</Label>
            <PasswordInput
              id="signup-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
            <p className="text-xs text-muted-foreground">At least 8 characters.</p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="signup-confirm-password">Confirm password</Label>
            <PasswordInput
              id="signup-confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={submitting || usernameStatus === "checking"}>
            {submitting ? "Creating account…" : "Create account"}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary underline-offset-4 hover:underline">
            Log in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
