```markdown
# flowstate-dev Development Patterns

> Auto-generated skill from repository analysis

## Overview

This skill covers the core development patterns and workflows for the `flowstate-dev` repository, a TypeScript-based Next.js application. It documents coding conventions, feature addition, UI enhancement workflows, and testing patterns, providing practical code examples and command shortcuts for efficient team collaboration.

## Coding Conventions

### File Naming

- Use **camelCase** for file and folder names.
  - Example: `habitList.tsx`, `useFocus.ts`, `taskStore.ts`

### Import Style

- Prefer **alias imports** for clarity and maintainability.
  - Example:
    ```typescript
    import TaskList from '@/components/tasks/taskList'
    import { fetchHabits } from '@/lib/habits'
    ```

### Export Style

- **Mixed**: Both default and named exports are used.
  - Example:
    ```typescript
    // Default export
    export default function HabitList() { ... }

    // Named export
    export function useHabits() { ... }
    ```

### Commit Patterns

- Commits use freeform messages, often prefixed with `m1`, `m2`, ... `m9`.
- Example: `m3: add mobile nav and polish transitions`

## Workflows

### Add New Feature Page

**Trigger:** When adding a new main feature or domain (e.g., Tasks, Habits, Focus, Dashboard, Stats, Settings) as a dedicated page.

**Command:** `/add-feature-page`

1. **Create or update the page file** under `app/(app)/[feature]/page.tsx`.
    - Example: `app/(app)/habits/page.tsx`
2. **Add new components** under `components/[feature]/*`.
    - Example: `components/habits/habitList.tsx`, `components/habits/habitItem.tsx`
3. **Optionally add or update supporting files** in `lib/`, `hooks/`, or `store/`.
    - Example: `lib/habits.ts`, `hooks/useHabits.ts`, `store/habitStore.ts`
4. **Wire up state management and UI interactions** as needed.

**Example Structure:**
```
app/
  (app)/
    habits/
      page.tsx
components/
  habits/
    habitList.tsx
    habitItem.tsx
lib/
  habits.ts
hooks/
  useHabits.ts
store/
  habitStore.ts
```

**Sample Page File:**
```typescript
// app/(app)/habits/page.tsx
import HabitList from '@/components/habits/habitList'

export default function HabitsPage() {
  return <HabitList />
}
```

---

### UI Polish or Enhancement Pass

**Trigger:** When improving the user experience or visual polish of existing features (animations, transitions, responsive/mobile enhancements).

**Command:** `/ui-polish`

1. **Update shared layout files** (e.g., `app/(app)/layout.tsx`) to add wrappers or providers.
2. **Add or update animation/transition components** under `components/layout/`.
    - Example: `components/layout/TransitionWrapper.tsx`
3. **Modify feature list components** to support new UI behaviors.
    - Example: `components/tasks/list.tsx`, `components/habits/habitList.tsx`
4. **Add new navigation or responsive UI elements** (e.g., mobile nav).

**Sample Enhancement:**
```typescript
// components/layout/TransitionWrapper.tsx
export default function TransitionWrapper({ children }) {
  return <div className="fade-in">{children}</div>
}

// Usage in layout
import TransitionWrapper from '@/components/layout/TransitionWrapper'

export default function AppLayout({ children }) {
  return <TransitionWrapper>{children}</TransitionWrapper>
}
```

---

## Testing Patterns

- **Test files** follow the pattern: `*.test.*`
    - Example: `habitList.test.tsx`
- **Testing framework** is not explicitly detected; check project dependencies for details.
- Place test files alongside the components or in a dedicated `__tests__` directory.

**Sample Test File:**
```typescript
// components/habits/habitList.test.tsx
import { render } from '@testing-library/react'
import HabitList from './habitList'

test('renders habit list', () => {
  const { getByText } = render(<HabitList />)
  expect(getByText('Your Habits')).toBeInTheDocument()
})
```

## Commands

| Command            | Purpose                                                      |
|--------------------|--------------------------------------------------------------|
| /add-feature-page  | Scaffold a new feature/domain page with supporting files     |
| /ui-polish         | Start a round of UI/UX improvements across the application   |
```
