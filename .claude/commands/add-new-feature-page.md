---
name: add-new-feature-page
description: Workflow command scaffold for add-new-feature-page in flowstate-dev.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /add-new-feature-page

Use this workflow when working on **add-new-feature-page** in `flowstate-dev`.

## Goal

Implements a new domain or feature section as a dedicated page, with associated UI components and supporting logic.

## Common Files

- `app/(app)/[feature]/page.tsx`
- `components/[feature]/*.tsx`
- `lib/[feature].ts`
- `hooks/use[Feature].ts`
- `store/[feature]Store.ts`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Create or update the page file under app/(app)/[feature]/page.tsx
- Add multiple new components under components/[feature]/*
- Optionally add or update supporting files in lib/, hooks/, or store/
- Wire up state management and UI interactions

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.