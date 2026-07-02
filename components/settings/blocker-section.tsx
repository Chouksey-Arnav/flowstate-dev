"use client";

import { useState } from "react";
import { Ban, Download, Plus, X, ShieldAlert, CheckCircle2, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useBlockerStore } from "@/store/blockerStore";
import {
  generateBlockerScript,
  generateLaunchdOffPlist,
  generateLaunchdPlist,
  downloadTextFile,
  getSitesFingerprint,
  getScheduleFingerprint,
} from "@/lib/blockerScript";

const SUGGESTED_DOMAINS = [
  "youtube.com",
  "instagram.com",
  "x.com",
  "twitter.com",
  "tiktok.com",
  "reddit.com",
  "netflix.com",
  "facebook.com",
];

const DAY_LABELS = [
  { value: 0, label: "Sun" },
  { value: 1, label: "Mon" },
  { value: 2, label: "Tue" },
  { value: 3, label: "Wed" },
  { value: 4, label: "Thu" },
  { value: 5, label: "Fri" },
  { value: 6, label: "Sat" },
];

const SCRIPT_PATH = "/usr/local/bin/flowstate-block.sh";

export function BlockerSection() {
  const sites = useBlockerStore((s) => s.sites);
  const schedule = useBlockerStore((s) => s.schedule);
  const addSite = useBlockerStore((s) => s.addSite);
  const removeSite = useBlockerStore((s) => s.removeSite);
  const updateSchedule = useBlockerStore((s) => s.updateSchedule);
  const lastDownloadedSitesFingerprint = useBlockerStore((s) => s.lastDownloadedSitesFingerprint);
  const lastDownloadedScheduleFingerprint = useBlockerStore((s) => s.lastDownloadedScheduleFingerprint);
  const markScriptDownloaded = useBlockerStore((s) => s.markScriptDownloaded);
  const markScheduleDownloaded = useBlockerStore((s) => s.markScheduleDownloaded);

  const [newDomain, setNewDomain] = useState("");

  const currentSitesFingerprint = getSitesFingerprint(sites);
  const currentScheduleFingerprint = getScheduleFingerprint(schedule);
  const scriptInSync = lastDownloadedSitesFingerprint === currentSitesFingerprint;
  const scheduleInSync = lastDownloadedScheduleFingerprint === currentScheduleFingerprint;

  function handleAdd(domain?: string) {
    const value = domain ?? newDomain;
    if (!value.trim()) return;
    addSite(value);
    setNewDomain("");
  }

  function toggleDay(day: number) {
    const days = schedule.days.includes(day)
      ? schedule.days.filter((d) => d !== day)
      : [...schedule.days, day].sort();
    updateSchedule({ days });
  }

  function handleDownloadScript() {
    downloadTextFile("flowstate-block.sh", generateBlockerScript(sites));
    markScriptDownloaded(currentSitesFingerprint);
  }

  function handleDownloadOnPlist() {
    downloadTextFile("com.flowstate.blocker.on.plist", generateLaunchdPlist(schedule, SCRIPT_PATH));
    markScheduleDownloaded(currentScheduleFingerprint);
  }

  function handleDownloadOffPlist() {
    downloadTextFile("com.flowstate.blocker.off.plist", generateLaunchdOffPlist(schedule, SCRIPT_PATH));
    markScheduleDownloaded(currentScheduleFingerprint);
  }

  const unaddedSuggestions = SUGGESTED_DOMAINS.filter(
    (d) => !sites.some((s) => s.domain === d || s.domain === `www.${d}`)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-1.5">
          <Ban className="h-4 w-4" /> Site &amp; app blocker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex items-start gap-2 rounded-lg border border-flow-yellow/30 bg-flow-yellow/[0.06] p-3 text-xs text-muted-foreground">
          <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-flow-yellow" />
          <p>
            FlowState runs in your browser and can&apos;t reach your operating system directly, so it can&apos;t
            flip a switch on your computer for you. Instead it generates a real blocker script below — download it
            once, run it locally, and it blocks these sites at the OS level (every browser and app), not just this tab.
          </p>
        </div>

        <div className="space-y-2">
          <Label>Blocked domains</Label>
          <div className="flex flex-wrap gap-1.5">
            {sites.map((site) => (
              <Badge key={site.id} variant="secondary" className="gap-1 pr-1">
                {site.domain}
                <button
                  type="button"
                  onClick={() => removeSite(site.id)}
                  className="ml-0.5 rounded-full p-0.5 hover:bg-background/60"
                  aria-label={`Remove ${site.domain}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {sites.length === 0 && <p className="text-xs text-muted-foreground">No domains yet — add one below.</p>}
          </div>
          <div className="flex gap-2">
            <Input
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              placeholder="e.g. youtube.com"
            />
            <Button variant="outline" onClick={() => handleAdd()}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {unaddedSuggestions.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {unaddedSuggestions.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => handleAdd(d)}
                  className="rounded-full border border-dashed border-border/60 px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                >
                  + {d}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-3 border-t border-border pt-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="schedule-enabled">Auto-block on a schedule (macOS)</Label>
              <p className="text-xs text-muted-foreground">Block automatically during work hours instead of remembering to toggle it.</p>
            </div>
            <Switch
              id="schedule-enabled"
              checked={schedule.enabled}
              onCheckedChange={(v) => updateSchedule({ enabled: v })}
            />
          </div>

          {schedule.enabled && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Input
                  type="time"
                  value={schedule.startTime}
                  onChange={(e) => updateSchedule({ startTime: e.target.value })}
                  className="w-32"
                />
                <span className="text-xs text-muted-foreground">to</span>
                <Input
                  type="time"
                  value={schedule.endTime}
                  onChange={(e) => updateSchedule({ endTime: e.target.value })}
                  className="w-32"
                />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {DAY_LABELS.map((day) => (
                  <button
                    key={day.value}
                    type="button"
                    onClick={() => toggleDay(day.value)}
                    className={cn(
                      "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                      schedule.days.includes(day.value)
                        ? "border-primary bg-primary/15 text-primary"
                        : "border-border/60 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2 border-t border-border pt-4">
          <div
            className={cn(
              "flex items-center gap-2 rounded-lg border px-3 py-2 text-xs",
              scriptInSync
                ? "border-flow-green/25 bg-flow-green/[0.06] text-flow-green"
                : "border-flow-yellow/30 bg-flow-yellow/[0.06] text-flow-yellow"
            )}
          >
            {scriptInSync ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                <span>Downloaded script matches your current blocklist.</span>
              </>
            ) : (
              <>
                <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                <span>Your blocklist changed since you last downloaded — download and re-run it to sync.</span>
              </>
            )}
          </div>
          <Button variant="outline" className="w-full justify-start" onClick={handleDownloadScript}>
            <Download className="mr-2 h-4 w-4" /> Download blocker script (flowstate-block.sh)
          </Button>
          {schedule.enabled && (
            <>
              {!scheduleInSync && (
                <div className="flex items-center gap-2 rounded-lg border border-flow-yellow/30 bg-flow-yellow/[0.06] px-3 py-2 text-xs text-flow-yellow">
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                  <span>Schedule changed since you last downloaded the plist files — re-download and reload them.</span>
                </div>
              )}
              <Button variant="outline" className="w-full justify-start" onClick={handleDownloadOnPlist}>
                <Download className="mr-2 h-4 w-4" /> Download ON schedule (com.flowstate.blocker.on.plist)
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={handleDownloadOffPlist}>
                <Download className="mr-2 h-4 w-4" /> Download OFF schedule (com.flowstate.blocker.off.plist)
              </Button>
            </>
          )}
          <details className="rounded-lg border border-border/60 bg-secondary/30 p-3 text-xs text-muted-foreground">
            <summary className="cursor-pointer font-medium text-foreground">Install instructions (macOS Terminal)</summary>
            <ol className="mt-2 list-decimal space-y-1.5 pl-4">
              <li>Move the downloaded file: <code className="rounded bg-background px-1 py-0.5">sudo mv ~/Downloads/flowstate-block.sh {SCRIPT_PATH}</code></li>
              <li>Make it executable: <code className="rounded bg-background px-1 py-0.5">sudo chmod +x {SCRIPT_PATH}</code></li>
              <li>Turn blocking on: <code className="rounded bg-background px-1 py-0.5">sudo {SCRIPT_PATH} on</code></li>
              <li>Turn it off any time: <code className="rounded bg-background px-1 py-0.5">sudo {SCRIPT_PATH} off</code></li>
              <li>Check status: <code className="rounded bg-background px-1 py-0.5">{SCRIPT_PATH} status</code></li>
              {schedule.enabled && (
                <>
                  <li>Copy the on.plist file: <code className="rounded bg-background px-1 py-0.5">sudo cp ~/Downloads/com.flowstate.blocker.on.plist /Library/LaunchDaemons/</code></li>
                  <li>Copy the off.plist file: <code className="rounded bg-background px-1 py-0.5">sudo cp ~/Downloads/com.flowstate.blocker.off.plist /Library/LaunchDaemons/</code></li>
                  <li>Load the on schedule: <code className="rounded bg-background px-1 py-0.5">sudo launchctl load /Library/LaunchDaemons/com.flowstate.blocker.on.plist</code></li>
                  <li>Load the off schedule: <code className="rounded bg-background px-1 py-0.5">sudo launchctl load /Library/LaunchDaemons/com.flowstate.blocker.off.plist</code></li>
                  <li className="text-xs">To stop the schedule later: <code className="rounded bg-background px-1 py-0.5">sudo launchctl unload /Library/LaunchDaemons/com.flowstate.blocker.on.plist</code> and <code className="rounded bg-background px-1 py-0.5">sudo launchctl unload /Library/LaunchDaemons/com.flowstate.blocker.off.plist</code></li>
                </>
              )}
              <li>
                Changed your domain list? Re-download the script, repeat step 1 to overwrite the old one, then run{" "}
                <code className="rounded bg-background px-1 py-0.5">sudo {SCRIPT_PATH} on</code> again — it
                automatically syncs to the new list even if blocking is already on.
              </li>
              {schedule.enabled && (
                <li>
                  Changed the schedule? <code className="rounded bg-background px-1 py-0.5">launchctl load</code>{" "}
                  on an already-loaded plist is a no-op — you must unload the old one before loading the new file,
                  or the old times keep running:{" "}
                  <code className="rounded bg-background px-1 py-0.5">
                    sudo launchctl unload /Library/LaunchDaemons/com.flowstate.blocker.on.plist
                  </code>{" "}
                  and{" "}
                  <code className="rounded bg-background px-1 py-0.5">
                    sudo launchctl unload /Library/LaunchDaemons/com.flowstate.blocker.off.plist
                  </code>
                  , then repeat the copy + load steps above with the freshly downloaded files.
                </li>
              )}
            </ol>
          </details>
        </div>
      </CardContent>
    </Card>
  );
}
