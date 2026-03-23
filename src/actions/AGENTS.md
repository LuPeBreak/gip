# Server Actions Guidelines

This file defines patterns and conventions for Server Actions in `src/actions/`.

## Structure

Each domain has its own folder:
```
src/actions/
├── processes/
├── users/
└── sectors/
```

## Patterns

### Basic Action Structure
```typescript
"use server";

import { withPermissions } from "@/lib/actions/with-permissions";
import { createSuccessResponse, createErrorResponse } from "@/lib/actions/action-utils";
import { prisma } from "@/lib/prisma";

export const actionName = withPermissions(
  [{ resource: "resource", action: ["action"] }],
  async (session, data: InputType): Promise<ActionResponse<OutputType>> => {
    try {
      // logic here
      return createSuccessResponse(data);
    } catch (error) {
      console.error("Error message:", error);
      return createErrorResponse("User-facing error message");
    }
  },
);
```

### Always Use
- `"use server"` at top
- `withPermissions()` wrapper for authorization
- `ActionResponse<T>` return type
- `createSuccessResponse()` / `createErrorResponse()` helpers

### Error Handling
- Log errors with `console.error()`
- Return user-friendly messages
- Include error codes for form validation

### Naming
- Verb + resource: `createProcess`, `getUsers`, `deleteSector`
- One action per file
- Export as named export

### File Organization
- Schema: if shared between front and back, put in a separate file (ex: `process-schemas.ts`)
- Types: in same file or separate `-types.ts` if shared
- Actions: one per file, grouped by domain
