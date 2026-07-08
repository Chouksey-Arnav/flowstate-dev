"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UsernameField } from "@/components/auth/username-field";
import { changeUsername, checkUsernameAvailable, getCurrentUsername, logOut, usernameFormatError } from "@/lib/auth/actions";

type UsernameStatus = "idle" | "checking" | "available" | "taken" | "invalid";

export function AccountSection() {
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState<UsernameStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    getCurrentUsername().then(setCurrentUsername);
  }, []);

  useEffect(() => {
    if (!editing) return;
    const handle = setTimeout(async () => {
      const clean = draft.replace(/^@/, "");
      if (!clean || clean === currentUsername?.replace(/^@/, "")) {
        setStatus("idle");
        return;
      }
      const formatError = usernameFormatError(draft);
      if (formatError) {
        setStatus("invalid");
        return;
      }
      setStatus("checking");
      const available = await checkUsernameAvailable(draft);
      if (available === null) return;
      setStatus(available ? "available" : "taken");
    }, 400);
    return () => clearTimeout(handle);
  }, [draft, editing, currentUsername]);

  const statusMessage =
    status === "invalid"
      ? usernameFormatError(draft)
      : status === "checking"
        ? "Checking availability…"
        : status === "available"
          ? "Available"
          : status === "taken"
            ? "That username is already taken."
            : null;

  function startEditing() {
    setDraft(currentUsername?.replace(/^@/, "") ?? "");
    setEditing(true);
    setError(null);
    setSuccess(null);
  }

  async function handleSave() {
    setError(null);
    setSuccess(null);
    const formatError = usernameFormatError(draft);
    if (formatError) {
      setError(formatError);
      return;
    }
    if (status === "taken") {
      setError("That username is already taken.");
      return;
    }
    setSaving(true);
    const result = await changeUsername(draft);
    setSaving(false);
    if (!result.ok) {
      setError(result.error ?? "Something went wrong.");
      return;
    }
    setCurrentUsername(result.username ?? null);
    setEditing(false);
    setSuccess("Username updated.");
  }

  async function handleLogout() {
    setLoggingOut(true);
    await logOut();
    window.location.href = "/login";
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account</CardTitle>
        <CardDescription>Your login username and session.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {editing ? (
          <div className="space-y-3">
            <UsernameField id="account-username" value={draft} onChange={setDraft} status={status} statusMessage={statusMessage} autoFocus />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={saving || status === "checking"} size="sm">
                {saving ? "Saving…" : "Save username"}
              </Button>
              <Button variant="outline" size="sm" onClick={() => setEditing(false)} disabled={saving}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Username</p>
              <p className="font-medium text-foreground">{currentUsername ?? "…"}</p>
            </div>
            <Button variant="outline" size="sm" onClick={startEditing}>
              Change username
            </Button>
          </div>
        )}
        {success && !editing && <p className="text-sm text-emerald-500">{success}</p>}
        <div className="border-t border-border/60 pt-4">
          <Button variant="destructive" size="sm" onClick={handleLogout} disabled={loggingOut}>
            {loggingOut ? "Logging out…" : "Log out"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
