# Auth Guidelines

This file defines patterns for authentication using Better Auth.

## Structure

```
src/lib/auth/
├── auth.ts            # Server config (better-auth instance)
├── auth-client.ts    # Client hooks and utilities
└── permissions.ts    # Roles and access control
```

## Usage

### Server Actions
```typescript
import { withPermissions } from "@/lib/actions/with-permissions";
import { auth } from "@/lib/auth/auth";

export const action = withPermissions(
  [{ resource: "process", action: ["create"] }],
  async (session, data) => {
    // session contains user info
    // session.user.id - user ID
    // session.user.role - user role
  },
);
```

### Client Components
```typescript
import { authClient } from "@/lib/auth/auth-client";

export function Component() {
  const { data: session } = authClient.useSession();
  
  if (!session) return <LoginButton />;
  
  return <span>Welcome, {session.user.name}</span>;
}
```

### Checking Permissions (Client)
```typescript
import { authClient } from "@/lib/auth/auth-client";
import type { RoleKey } from "@/lib/auth/permissions";

const userRole = (session?.user.role as RoleKey) ?? "user";

const canEdit = authClient.admin.checkRolePermission({
  permissions: { process: ["update"] },
  role: userRole,
});
```

## Permissions

Permissions are defined in `permissions.ts` using Better Auth's access control:
- `admin` - full access to all resources
- `user` - limited access based on resource

## Roles

Two roles:
- `admin` - Can manage users, sectors, and perform interventions
- `user` - Standard access to processes and own data

## Extending Permissions

When adding new features, you may need new permissions:
1. Define new resources/actions in `permissions.ts`
2. Add to appropriate roles (admin gets all by default)
3. Use `withPermissions()` in actions to enforce

Example:
```typescript
const statement = {
  ...defaultStatements,
  newResource: ["create", "list", "update", "delete"],
} as const;
```

### Custom Actions

For limited data access (e.g., listing only names without sensitive data), create custom actions:

```typescript
// permissions.ts
const statement = {
  ...defaultStatements,
  user: [...defaultStatements.user, "list_minimal"],
} as const;

// In role definition
user: ac.newRole({
  user: ["list_minimal"], // only lists minimal user data
});
```

Then use in action:
```typescript
export const getUserOptions = withPermissions(
  [{ resource: "user", action: ["list_minimal"] }],
  async () => { /* returns only id + name */ },
);
```