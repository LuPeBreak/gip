# App Router Guidelines

This file defines general patterns for Next.js App Router in `src/app/`.

## Structure

```
src/app/
├── (private)/          # Protected routes (requires auth)
│   └── dashboard/      # Dashboard pages
└── (public)/           # Public routes
    └── login/          # Login page
```

## Route Groups

Use route groups `(private)` and `(public)` to organize:
- **Private:** Requires authentication, uses dashboard layout
- **Public:** No auth required, uses public layout

## Layouts

- Define layouts at the route group level
- Use layouts for shared UI (sidebar, header)
- Auth checks should be in layouts for protected routes
- Sessions are checked once in the layout, not in every page

## Pages

- Pages are Server Components by default
- Fetch data directly in the page
- Use `searchParams` as a Promise (Next.js 16)

## API Routes

For API routes, use:
```
src/app/api/[route]/route.ts
```

## Related

- `src/app/(private)/dashboard/AGENTS.md` - Dashboard pages patterns
