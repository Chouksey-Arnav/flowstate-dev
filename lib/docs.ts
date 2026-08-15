import type { LucideIcon } from "lucide-react";
import {
  Rocket,
  UserCircle,
  LayoutDashboard,
  ListTodo,
  Gift,
  Timer,
  Flame,
  BarChart3,
  Trophy,
  SlidersHorizontal,
  ShieldCheck,
  Ban,
  Monitor,
} from "lucide-react";
import { DESKTOP_INSTALL_INSTRUCTIONS } from "@/lib/desktop-install";

export interface DocCategory {
  key: string;
  label: string;
}

export const DOC_CATEGORIES: DocCategory[] = [
  { key: "start", label: "Getting started" },
  { key: "core", label: "Core tools" },
  { key: "growth", label: "Growth & rewards" },
  { key: "control", label: "Settings & control" },
];

export interface DocSection {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
  steps?: string[];
  note?: string;
}

export interface DocPage {
  slug: string;
  category: string;
  icon: LucideIcon;
  title: string;
  description: string;
  readTime: string;
  sections: DocSection[];
}

export const DOCS: DocPage[] = [
  {
    slug: "introduction",
    category: "start",
    icon: Rocket,
    title: "Introduction to FlowState",
    description: "What FlowState is, the loop it's built around, and why it's built the way it is.",
    readTime: "3 min",
    sections: [
      {
        heading: "What FlowState is",
        paragraphs: [
          "FlowState is a dark, no-excuses productivity app that runs entirely in your browser. It combines a task manager, a drift-free Pomodoro focus timer, habit tracking, and stats into a single loop, wired to a leveling system that rewards the work you actually finish.",
          "It's free, open-source, and MIT-licensed — no paywall, no premium tier, no ads, and no tracking. Every feature described in these docs is available to everyone, whether you use the hosted app or self-host it.",
        ],
      },
      {
        heading: "The loop",
        paragraphs: [
          "The four tools aren't independent — each one feeds the next, and the dashboard is where they meet:",
        ],
        bullets: [
          "Capture — get everything out of your head and into Tasks, fast (brain-dump, subtasks, categories, due dates).",
          "Focus — pick one task and run a distraction-free Pomodoro session against it.",
          "Show up — check off your Habits daily, independent of any single task.",
          "See the proof — Stats and XP turn all of the above into a record you can't argue with.",
        ],
      },
      {
        heading: "Where to start",
        paragraphs: [
          "If you're new, read Accounts & Sync to understand how your data is stored, then Dashboard to see how the pieces come together on the page you'll open every day.",
        ],
      },
    ],
  },
  {
    slug: "installing-the-desktop-app",
    category: "start",
    icon: Monitor,
    title: "Installing the Desktop App",
    description: "Getting the Mac, Windows, or Linux download past the first-launch security warning.",
    readTime: "2 min",
    sections: [
      {
        heading: "Why there's a warning at all",
        paragraphs: [
          "FlowState's desktop app isn't code-signed by a paid Apple/Microsoft developer certificate, so each OS shows its standard first-launch warning for unsigned software — this is expected, not a sign anything is wrong with the download.",
        ],
      },
      {
        heading: DESKTOP_INSTALL_INSTRUCTIONS.mac.title,
        paragraphs: [DESKTOP_INSTALL_INSTRUCTIONS.mac.intro],
        steps: DESKTOP_INSTALL_INSTRUCTIONS.mac.steps,
        note: `Run: ${DESKTOP_INSTALL_INSTRUCTIONS.mac.command}`,
      },
      {
        heading: DESKTOP_INSTALL_INSTRUCTIONS.windows.title,
        paragraphs: [DESKTOP_INSTALL_INSTRUCTIONS.windows.intro],
        steps: DESKTOP_INSTALL_INSTRUCTIONS.windows.steps,
        note: `PowerShell command: ${DESKTOP_INSTALL_INSTRUCTIONS.windows.command}`,
      },
      {
        heading: DESKTOP_INSTALL_INSTRUCTIONS.linux.title,
        paragraphs: [DESKTOP_INSTALL_INSTRUCTIONS.linux.intro],
        steps: DESKTOP_INSTALL_INSTRUCTIONS.linux.steps,
        note: `Run: ${DESKTOP_INSTALL_INSTRUCTIONS.linux.command}`,
      },
    ],
  },
  {
    slug: "accounts-and-sync",
    category: "start",
    icon: UserCircle,
    title: "Accounts & Sync",
    description: "How signup, login, and cross-device sync work under the hood.",
    readTime: "4 min",
    sections: [
      {
        heading: "Usernames, not emails",
        paragraphs: [
          "FlowState accounts are a username (always shown with a leading @, e.g. @arnav) and a password. Usernames are globally unique, case-insensitive, and can be changed any time from Settings → Account. Logging in from any device signs you into that same account and pulls your data — nothing is tied to a single browser or machine.",
        ],
      },
      {
        heading: "How it's built",
        bullets: [
          "Auth runs on Supabase Auth. Since Supabase keys auth on email, each account gets an internal, never-shown synthetic email that your username maps to — password hashing, sessions, and JWTs are handled entirely by Supabase.",
          "Signup, login, and username changes run through dedicated Supabase Edge Functions rather than the browser, so the service-role key needed to create accounts and resolve usernames never touches client code.",
          "App data — tasks, habits, focus sessions, settings, XP, reflections, and blocker preferences — is stored in a Postgres table as one JSON row per store per account, gated by row-level security so a user can only ever read or write their own rows.",
        ],
      },
      {
        heading: "What stays local",
        paragraphs: [
          "The live-running Pomodoro timer state intentionally stays in your browser's local storage — it's per-device, per-tab UI state, not account data worth syncing across machines.",
        ],
      },
      {
        heading: "Backing up your data",
        paragraphs: [
          "Settings → Export data as JSON downloads a full snapshot of your tasks, habits, focus sessions, and settings any time you want a local backup, independent of the account system.",
        ],
        note: "Your data is never sold, shared, or used for anything besides running your account. See Privacy & Self-Hosting for the full picture.",
      },
    ],
  },
  {
    slug: "dashboard",
    category: "start",
    icon: LayoutDashboard,
    title: "The Dashboard",
    description: "A tour of the page you'll open every day, top to bottom.",
    readTime: "4 min",
    sections: [
      {
        heading: "What's on it",
        paragraphs: ["The dashboard is a single page, organized top to bottom by how urgently it matters:"],
        bullets: [
          "Level & XP — your total XP, current level and title, and how much you've earned today.",
          "Today's reminder & quote — a live count of today's tasks plus a nudge, tuned sharper if you're avoiding a task or your streak is at risk.",
          "Today — Today's One Thing (your single committed task), your top 3 priorities, and any tasks you're avoiding.",
          "Habits — every habit, tap to check off, enlarged so it's the thing you actually see and act on daily.",
          "Progress — your task-goal streak, today's goal progress, a mini task/focus summary, and your editable daily goal statement.",
          "Insights — a reflection summary of why you've skipped things lately, and a mini weekly chart.",
        ],
      },
      {
        heading: "Today's One Thing",
        paragraphs: [
          "Commit to a single task for the day from the Commitment card. Once locked in, it takes over the card until it's marked done — the idea is that everything else is optional until this one thing is finished.",
        ],
      },
      {
        heading: "Quick-add",
        paragraphs: [
          "The button in the top-right of the dashboard adds a bare task (Other category, Medium priority) in two keystrokes. For a fully-specified task — priority, difficulty, due date, reward — use New task from the Tasks page instead.",
        ],
      },
    ],
  },
  {
    slug: "tasks",
    category: "core",
    icon: ListTodo,
    title: "Tasks",
    description: "Full CRUD, subtasks, scheduling, avoidance scoring, and everything else the task manager does.",
    readTime: "6 min",
    sections: [
      {
        heading: "Creating a task",
        paragraphs: [
          "New task opens a single form: title, an optional description, priority (High/Medium/Low), difficulty (Easy/Medium/Hard), a category, an optional due date, an optional time estimate, subtasks, and an optional reward — see Rewards for that piece specifically.",
        ],
      },
      {
        heading: "Brain-dump",
        paragraphs: [
          "When your head is full, the brain-dump box on the Tasks page lets you type everything out as fast as you can — one line per task — then review and sort it afterward instead of slowing down mid-capture.",
        ],
      },
      {
        heading: "Repeating tasks",
        paragraphs: [
          "Turn on Repeat this task in the form to make a task recur across a run of consecutive days instead of being completed once. Checking a day off never removes it from the list — it just records that day as done, and you can uncheck it any time. Repeating tasks use their own completion history instead of a single due date.",
        ],
      },
      {
        heading: "Avoidance scoring",
        paragraphs: [
          "FlowState quietly tracks how long a task has sat untouched and how often you've hit \"show me another\" on it. Past a threshold, it surfaces with an Avoided badge and its own card on the dashboard — the point is to make the task you're actually dodging impossible to ignore.",
        ],
      },
      {
        heading: "Organizing the list",
        bullets: [
          "Filters by category, priority, difficulty, and status",
          "Sort by smart order, due date, priority, created date, or manual drag-to-reorder",
          "Bulk select to complete, archive, or delete several tasks at once",
          "Archive view for tasks you've set aside without deleting",
        ],
      },
      {
        heading: "Completing a task",
        paragraphs: [
          "Checking a task off fires a confetti burst, a chime, and an undo toast — click Undo within a few seconds to reverse it. Completion also awards XP (see Gamification & XP) and, if you set one, surfaces your reward.",
        ],
      },
    ],
  },
  {
    slug: "rewards",
    category: "growth",
    icon: Gift,
    title: "Rewards",
    description: "A tiny, optional personal-incentive layer on top of any task.",
    readTime: "2 min",
    sections: [
      {
        heading: "What it is",
        paragraphs: [
          "Every task has one extra, entirely optional field: Reward. It's a short note to yourself — a coffee, an episode of something, twenty guilt-free minutes on your phone — for when the task is actually finished. It sits alongside XP rather than replacing it: XP is the system's score, a reward is yours.",
        ],
      },
      {
        heading: "Setting one",
        steps: [
          "Open New task (or edit an existing task).",
          "Fill in the optional Reward field near the bottom of the form — plain text, no format required.",
          "Leave it blank if you don't want one for this task. Nothing else in the form changes and nothing is required.",
        ],
      },
      {
        heading: "Where it shows up",
        bullets: [
          "As a small badge on the task itself, anywhere it appears in your list.",
          "On the dashboard's Today's One Thing card, once you've committed to a task that has one.",
          "In the completion toast when you check the task off — a one-line reminder of what you promised yourself.",
        ],
      },
      {
        heading: "Why it's optional",
        paragraphs: [
          "Not every task needs a reward, and forcing one on every task would just be more overhead. It exists for the tasks where a small, concrete incentive is what actually gets you to start — set it there, skip it everywhere else.",
        ],
      },
    ],
  },
  {
    slug: "focus",
    category: "core",
    icon: Timer,
    title: "Focus",
    description: "A drift-free Pomodoro timer with ambient sound and a distraction-free mode.",
    readTime: "4 min",
    sections: [
      {
        heading: "The timer",
        paragraphs: [
          "Focus runs a Pomodoro cycle — work, break, long-break — with durations you set in Settings. It's drift-free: the countdown is computed from a real timestamp, not decremented tick by tick, so it stays accurate even if the tab is backgrounded or the device sleeps.",
        ],
      },
      {
        heading: "Attaching a task",
        paragraphs: [
          "Start a session from a specific task (the timer icon on any task row, or the focus button on Today's One Thing) to log that session against it, or start a plain, untargeted session from the Focus page directly. Either way you can set a short intention before the timer starts.",
        ],
      },
      {
        heading: "Full Focus Mode",
        paragraphs: [
          "A distraction-free full-screen view of just the ring and the controls — nothing else on the page competes for attention while you're mid-session.",
        ],
      },
      {
        heading: "Ambient sound",
        paragraphs: [
          "Lofi, rain, white noise, and brown noise are all synthesized live with the Web Audio API — there are no audio files, embeds, or autoplay ads involved.",
        ],
      },
      {
        heading: "XP",
        paragraphs: ["Every focused minute earns XP — see Gamification & XP for the exact rate."],
      },
    ],
  },
  {
    slug: "habits",
    category: "core",
    icon: Flame,
    title: "Habits",
    description: "Daily check-ins, streaks, and why they're front-and-center on the dashboard.",
    readTime: "4 min",
    sections: [
      {
        heading: "Why habits get special treatment",
        paragraphs: [
          "Tasks get finished and go away; habits are the thing you're supposed to keep doing forever. That's a harder sell, so the dashboard treats them accordingly — Today's habits gets its own section with large, tappable icons instead of being buried as a small status strip. Check one off right from the dashboard and it visibly lights up: a solid green ring, a streak flame, and a running \"X/Y done\" count that turns into a Perfect Day badge the moment every habit for the day is checked.",
        ],
      },
      {
        heading: "Adding a habit",
        paragraphs: [
          "Habits live on the dedicated Habits page. Give one a name, an icon, a category, and how many times per week it's expected (7 for daily, fewer for a weekly cadence). Six sensible defaults are pre-loaded so you're not starting from a blank page.",
        ],
      },
      {
        heading: "Streaks",
        paragraphs: [
          "Daily habits (7x/week) track a day-by-day streak; anything less than daily tracks a week-by-week streak against its target instead, so a habit you only intend to do 3x/week doesn't get unfairly broken by the other four days. Both current and best streaks are kept.",
        ],
      },
      {
        heading: "The weekly grid",
        paragraphs: [
          "The Habits page itself shows a full weekly completion grid per habit — click any day (past or present) to toggle it, not just today. Drag to reorder however you like.",
        ],
      },
      {
        heading: "Perfect Day",
        paragraphs: ["Complete every habit you have on a given day and you earn the Perfect Day badge — visible on both the Habits page and the dashboard."],
      },
    ],
  },
  {
    slug: "stats",
    category: "core",
    icon: BarChart3,
    title: "Stats",
    description: "The receipts: completion rate, focus time, habit consistency, and streaks.",
    readTime: "3 min",
    sections: [
      {
        heading: "Stat cards",
        paragraphs: ["Four headline numbers: tasks completed, total focus time, habit completion rate, and your best streak — the proof that you're moving, or the proof that you're stalling."],
      },
      {
        heading: "Category donut",
        paragraphs: ["A breakdown of completed tasks by category, so you can see where your time is actually going versus where you think it's going."],
      },
      {
        heading: "Weekly bar chart",
        paragraphs: ["Tasks completed per day for the current week, with the same chart mirrored in miniature on the dashboard."],
      },
      {
        heading: "Heatmap",
        paragraphs: ["A CSS-grid monthly heatmap of activity with month navigation — the GitHub-contributions-graph style view of your consistency over time."],
      },
      {
        heading: "Exporting",
        paragraphs: ["Every number on this page is derived from data you can export in full at any time from Settings → Export data as JSON."],
      },
    ],
  },
  {
    slug: "gamification-xp",
    category: "growth",
    icon: Trophy,
    title: "Gamification & XP",
    description: "Exactly how XP, levels, and titles are calculated.",
    readTime: "4 min",
    sections: [
      {
        heading: "Where XP comes from",
        bullets: [
          "Completing a task: base XP by difficulty (Easy 10, Medium 20, Hard 35) multiplied by priority (Low ×1, Medium ×1.2, High ×1.5) — roughly 10 to 52 XP.",
          "A focus session: 2 XP per focused minute.",
          "A habit check-in: 15 XP, flat, regardless of the habit.",
          "Hitting your daily task goal: a 50 XP bonus, once per day.",
        ],
      },
      {
        heading: "Custom XP",
        paragraphs: [
          "Any task can override its computed XP with a custom value (1–500) from the task form — useful for a task that matters more, or less, than its difficulty and priority alone would suggest.",
        ],
      },
      {
        heading: "Levels",
        paragraphs: [
          "Each level requires progressively more XP than the last — roughly 1.45x growth per level — so early levels come fast and later ones feel earned. Levels come with a title, from Novice at level 1 up through Apprentice, Focused, Disciplined, Relentless, Unstoppable, Elite, and finally Legend at level 36.",
        ],
      },
      {
        heading: "Undoing XP",
        paragraphs: [
          "Unchecking a completed task or habit revokes the XP it originally earned — the ledger always reflects your current state, not a history of everything you ever clicked.",
        ],
      },
    ],
  },
  {
    slug: "blocker",
    category: "control",
    icon: Ban,
    title: "Site & App Blocker",
    description: "Generate a real, OS-level blocker script for the sites that eat your focus time.",
    readTime: "3 min",
    sections: [
      {
        heading: "Why it's a download, not a switch",
        paragraphs: [
          "FlowState runs in your browser, which means it can't reach your operating system directly to block anything for you. Instead, Settings → Site & app blocker generates a real shell script from the domains you list — download it once, run it locally, and it blocks those sites at the OS level, across every browser and app, not just one tab.",
        ],
      },
      {
        heading: "Setting it up",
        steps: [
          "Add the domains you want blocked (a handful of common distractions are suggested for you).",
          "Download the generated script and move it to /usr/local/bin/flowstate-block.sh, then make it executable.",
          "Run it with the `on` argument to block, `off` to unblock, and `status` to check.",
        ],
      },
      {
        heading: "Scheduling it (macOS)",
        paragraphs: [
          "Turn on the schedule toggle to set work hours and days, then download the two generated launchd plist files. Loading both installs an automatic on/off switch so you don't have to remember to toggle it yourself.",
        ],
        note: "The blocker page always tells you when your downloaded script or schedule has drifted out of sync with what's currently configured, so you know exactly when to re-download.",
      },
    ],
  },
  {
    slug: "settings-and-data",
    category: "control",
    icon: SlidersHorizontal,
    title: "Settings & Data",
    description: "Profile, Pomodoro durations, behavior toggles, and your data.",
    readTime: "3 min",
    sections: [
      {
        heading: "Account & profile",
        paragraphs: ["Change your username or log out from Account. Profile holds your display name and daily-goal statement, both of which show up on the dashboard."],
      },
      {
        heading: "Pomodoro",
        paragraphs: ["Set your work, break, and long-break durations in minutes, and pick a timer sound (bell, digital, or silent)."],
      },
      {
        heading: "Behavior",
        bullets: [
          "Confetti and completion sound toggles",
          "Auto-start the next Pomodoro interval",
          "First day of week (Sunday or Monday) — affects every weekly view in the app",
        ],
      },
      {
        heading: "Data",
        bullets: [
          "Export data as JSON — a full local backup of tasks, habits, focus sessions, and settings",
          "Clear completed tasks — permanently removes anything marked done",
          "Reset habit streaks — clears completion history but keeps the habits themselves",
          "Reset everything — wipes tasks, habits, focus sessions, and restores default settings",
        ],
        note: "Every destructive action here asks for confirmation first and can't be undone afterward — export a backup if there's any doubt.",
      },
    ],
  },
  {
    slug: "privacy-and-self-hosting",
    category: "control",
    icon: ShieldCheck,
    title: "Privacy & Self-Hosting",
    description: "The data model, and how to run your own instance.",
    readTime: "3 min",
    sections: [
      {
        heading: "No paywall, no ads, no tracking",
        paragraphs: ["FlowState is completely free and MIT-licensed. There's no premium tier and nothing here is monetized off your data or attention."],
      },
      {
        heading: "Where your data lives",
        paragraphs: [
          "App data is stored in a Postgres table gated by row-level security, so only your account can ever read or write your rows. Everything lives in a flowstate_-prefixed schema, isolated from anything else in the shared Supabase project.",
        ],
      },
      {
        heading: "Self-hosting",
        steps: [
          "git clone the repository and run npm install.",
          "Create a .env.local with your own NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
          "Run npm run dev, or npm run build && npm start for production — the project is deployed using Coolify on a VPS (we are completely off Vercel) with the same environment variables.",
        ],
      },
      {
        heading: "Auditing the code",
        paragraphs: ["The full source is public on GitHub. Fork it, read it, or send a pull request — this is meant to be built on, not just used."],
      },
    ],
  },
];

export function getDoc(slug: string): DocPage | undefined {
  return DOCS.find((d) => d.slug === slug);
}

export function getDocsByCategory(categoryKey: string): DocPage[] {
  return DOCS.filter((d) => d.category === categoryKey);
}
