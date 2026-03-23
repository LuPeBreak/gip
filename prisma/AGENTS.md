# Prisma Guidelines

This file defines patterns for database schema and Prisma usage.

## Schema Location

```
prisma/
├── schema.prisma      # Database schema
└── migrations/        # Database migrations
```

## Pattern

### Models
- Use `@id` for primary key (cuid for new entities, String for auth tables)
- Use `@default(now())` for timestamps
- Use `@updatedAt` for auto-update timestamps
- Use `@unique` for unique constraints
- Use `@@map("table_name")` for custom table names

### Relations
- Always define `onDelete` for relations:
  - `Cascade` - delete related records
  - `Restrict` - prevent deletion if related records exist
  - `SetNull` - set to null on delete

### Enums
- Use enums for fixed values (status, roles, etc.)

## Conventions

- **Field naming:** camelCase
- **Table naming:** snake_case via `@@map`
- **Timestamps:** `createdAt` and `updatedAt`
- **Soft deletes:** Avoid, use status fields instead

## Running Migrations

**IMPORTANT:** Never run migrate commands automatically. The agent should never execute them.

Workflow:
1. Edit `schema.prisma`
2. Ask the user to validate the changes
3. If approved, tell the user to run:
   - `npx prisma migrate dev --name migration_name`
   - `npx prisma generate` (to update types)
4. Wait for user to run them and report back

## Generated Types

Types are auto-generated to `src/lib/prisma/generated/`. Import from `lib/prisma` only.
