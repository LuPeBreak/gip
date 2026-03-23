# UI Components (Shadcn)

This file defines patterns for base UI components from shadcn/ui.

## Rules

- **Install via CLI:** Use `npx shadcn@latest add <component>` to add new components
- **Do not create manually:** Always use shadcn CLI for base UI components
- **Do not modify source:** Avoid modifying components in `components/ui/` directly
- **Extend via className:** Use `className` prop to customize, or create wrapper components

## Structure

```
src/components/ui/
├── button.tsx
├── dialog.tsx
├── table.tsx
└── ...
```

## Customization

- For custom variants, create wrapper components or extend in place with `cva`
- Tailwind classes for styling, use `cn()` for conditional classes
