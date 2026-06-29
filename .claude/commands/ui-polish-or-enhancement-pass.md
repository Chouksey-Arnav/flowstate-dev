---
name: ui-polish-or-enhancement-pass
description: Workflow command scaffold for ui-polish-or-enhancement-pass in flowstate-dev.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /ui-polish-or-enhancement-pass

Use this workflow when working on **ui-polish-or-enhancement-pass** in `flowstate-dev`.

## Goal

Applies a round of UI/UX improvements, such as animations, transitions, or responsive/mobile enhancements, often across multiple components.

## Common Files

- `app/(app)/layout.tsx`
- `components/layout/*.tsx`
- `components/tasks/list.tsx`
- `components/habits/habit-list.tsx`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Update shared layout files (e.g., app/(app)/layout.tsx) to add wrappers or providers
- Add or update animation/transition components under components/layout/
- Modify feature list components (e.g., components/tasks/list.tsx, components/habits/habit-list.tsx) to support new UI behaviors
- Add new navigation or responsive UI elements (e.g., mobile nav)

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.