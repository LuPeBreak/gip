# Components Guidelines

This file defines patterns and conventions for React components in `src/components/`.

## Structure

```
src/components/
├── ui/           # Base UI (shadcn)
├── dashboard/    # Dashboard-specific components
├── data-table/   # Reusable data table
└── processes/    # Domain-specific components
```

## Conventions

- **Naming:** PascalCase, prefix with domain (ex: `ProcessStatusBadge`)
- **Presentation:** UI components should be pure presentation, no business logic
- **Composition:** Use composition pattern for complex components
- **Props:** Extend native HTML props via `ComponentProps<"element">`

## Organization

- Components that are reused across multiple pages go in shared folders
- Domain-specific components stay with their domain
- UI base components in `ui/`

## Related

- `src/components/ui/AGENTS.md` - Shadcn/ui patterns
- `src/components/data-table/AGENTS.md` - Data table patterns
