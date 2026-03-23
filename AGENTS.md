# GIP - Project Guidelines

This file defines the general patterns and conventions for the project. For specific patterns, see the AGENTS.md files in each folder (e.g., `src/actions/AGENTS.md`).

## Identity

System for **Gestão Interna de Processos (GIP)** - internal control and traceability of bidding processes for Barra Mansa City Hall.

> For full requirements and business rules, see `docs/REQUIREMENTS.md`.

## Stack

- **Frontend:** Next.js 16 (App Router), React 19, TypeScript
- **Backend:** Server Actions (Next.js)
- **Database:** PostgreSQL + Prisma 7
- **Auth:** Better Auth
- **UI:** Shadcn/ui + Radix UI + Tailwind CSS 4
- **Validation:** Zod
- **State:** URL Search Params (nuqs) + React Hook Form
- **Linting:** Biome

## Code Principles

### Simplicity First
- Prefer simple solutions over complex architectures
- Avoid over-engineering
- Code should be understandable without extensive explanations

### Use Context7 MCP for Documentation
- When implementing features with external libraries, use Context7 MCP to get up-to-date documentation
- Always verify API signatures and patterns against current documentation
- Avoid using outdated examples from training data

### Be Self-Critical
- Continuously look for improvements in the codebase
- Ask questions when you notice inconsistencies
- If something seems wrong between requirements, design, and implementation - raise it
- Challenge assumptions and verify against `docs/REQUIREMENTS.md`

### Separation of Concerns
- **Server Actions** = domain logic + data access
- **UI Components** = pure presentation, no business logic
- **Dashboard Components** = coordination between actions and UI
- **Zod Schemas** = validation; co-located with component that uses them; move to shared file if reused

### Strict Typing
- Never use `any` without explicit justification
- Prefer explicit types over inference when it improves clarity

### Consistency
- Follow existing code patterns
- When creating something new, maintain consistency with surrounding code
- If something looks different, investigate before creating a new approach

### Security
- All Server Actions must validate permissions before execution
- Validate input on server, even if already validated on client

## Conventions

- **Language:** Portuguese for docs and commits, English for code
- **Exports:** Named exports only
- **Components:** PascalCase, prefix with domain (ex: `ProcessStatusBadge`)
- **Files:** kebab-case for actions/utils, PascalCase for components
- **Schemas:** co-located with component that uses them; move to shared if reused

## Project Structure

```
src/
├── actions/           # Server Actions (grouped by domain)
├── app/               # Next.js App Router
├── components/        # React components
│   └── ui/            # Base UI (shadcn)
├── hooks/            # Custom hooks
└── lib/              # Utils, auth, prisma client
```

## Patterns

- **Server Actions:** `withPermissions()` wrapper for auth, return `ActionResponse<T>`
- **UI Components:** presentation only, no business logic
- **Dashboard Components:** coordinate between actions and UI
- **Forms:** React Hook Form + Zod, dialog-based

## Checks

Run before commit:
```bash
pnpm check
```