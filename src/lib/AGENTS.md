# Lib Guidelines

This file defines patterns for `src/lib/` - utilities, configurations, and library integrations.

## Structure

```
src/lib/
├── actions/        # Server Action utilities
│   ├── action-utils.ts    # Response helpers (ActionResponse, createSuccessResponse, etc.)
│   └── with-permissions.ts # Auth wrapper for actions
├── auth/          # Authentication (Better Auth)
│   ├── auth.ts            # Server config
│   ├── auth-client.ts     # Client hooks
│   └── permissions.ts     # Roles and permissions
├── prisma/        # Database
│   ├── index.ts           # Client export
│   └── generated/         # Auto-generated types
├── utils/         # General utilities
│   ├── utils.ts           # cn() helper
│   ├── formatters.ts      # Date/number formatters
│   └── password.ts        # Password utils
└── env.ts         # Environment variables
```

## Patterns

### Action Utils (`lib/actions/`)
- `ActionResponse<T>` - standard return type for all actions
- `createSuccessResponse(data)` - success helper
- `createErrorResponse(message, code?, field?)` - error helper

### Auth (`lib/auth/`)
- Server: use `auth` from `auth.ts`
- Client: use `authClient` from `auth-client.ts`
- Permissions: defined in `permissions.ts` using Better Auth's access control

### Prisma (`lib/prisma/`)
- Always import from `lib/prisma`, never from `lib/prisma/generated`
- Generated types are auto-created by Prisma

### Utils (`lib/utils/`)
- `cn()` - className merger (clsx + tailwind-merge)
- Use for shared utilities only

### Environment (`env.ts`)
- Use `@t3-oss/env-nextjs` for type-safe environment variables
- Define schema in `env.ts` using `z.object()`

## Related

- `src/lib/auth/AGENTS.md` - Authentication patterns