# Data Table Guidelines

This file defines patterns for the reusable data table component.

## Component

The data table is built with `@tanstack/react-table` and located in `src/components/data-table/`.

## Structure

```
src/components/data-table/
├── data-table.tsx                 # Main component
├── data-table-pagination.tsx     # Pagination
├── data-table-column-header.tsx  # Column header with sorting
└── data-table-base-search-params.ts # Base parsers for search params
```

## How to Create a New Table

Each table needs these files in the domain folder (e.g., `src/components/dashboard/processes/`):

### 1. Search Params (`*-search-params.ts`)
```typescript
import { createSearchParamsCache, parseAsString } from "nuqs/server";
import { orderByParser, orderParser, pageParser, pageSizeParser, searchParser } from "@/components/data-table/data-table-base-search-params";

export const statusParser = parseAsString.withDefault("");
export const yourParamParser = parseAsString.withDefault("");

export const yourSearchParamsCache = createSearchParamsCache({
  page: pageParser,
  pageSize: pageSizeParser,
  search: searchParser,
  status: statusParser,
  yourParam: yourParamParser,
  orderBy: orderByParser,
  order: orderParser,
});
```

### 2. Columns (`*-data-table-columns.tsx`)
```typescript
"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { YourDomainDataTableRowActions } from "./your-domain-data-table-row-actions";

export const yourColumns: ColumnDef<YourItemType>[] = [
  {
    accessorKey: "field",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <YourDomainDataTableRowActions item={row.original} />
    ),
  },
];
```

### 3. Toolbar (`*-data-table-toolbar.tsx`)
```typescript
"use client";

import { X } from "lucide-react";
import { useQueryState } from "nuqs";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { searchParser } from "./your-search-params";

export function YourDomainDataTableToolbar() {
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useQueryState(
    "search",
    searchParser.withOptions({ shallow: false, startTransition }),
  );

  const isFiltered = search !== "";

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Search..."
          value={search ?? ""}
          onChange={(e) => setSearch(e.target.value)}
          className="h-9 w-[250px]"
          data-pending={isPending ? "" : undefined}
        />
        {isFiltered && (
          <Button variant="ghost" onClick={() => setSearch("")}>
            Limpar <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
```

### 4. Row Actions (`*-data-table-row-actions.tsx`)
```typescript
"use client";

import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth/auth-client";
import type { RoleKey } from "@/lib/auth/permissions";
import { YourDialog } from "./your-dialog";

export function YourDomainDataTableRowActions({ item }: { item: YourItemType }) {
  const { data: session } = authClient.useSession();
  const userRole = (session?.user.role as RoleKey) ?? "user";

  // Check permissions using better-auth
  const canEdit = authClient.admin.checkRolePermission({
    permissions: { yourResource: ["update"] },
    role: userRole,
  });

  const canDelete = authClient.admin.checkRolePermission({
    permissions: { yourResource: ["delete"] },
    role: userRole,
  });

  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {canEdit && (
            <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
          )}
          {canDelete && (
            <DropdownMenuItem
              onClick={() => setShowDeleteDialog(true)}
              className="text-destructive"
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {canEdit && (
        <YourDialog item={item} open={showEditDialog} onOpenChange={setShowEditDialog} />
      )}
      {canDelete && (
        <YourDeleteDialog item={item} open={showDeleteDialog} onOpenChange={setShowDeleteDialog} />
      )}
    </>
  );
}
```

**Key points:**
- Always check permissions before showing actions
- Use `authClient.useSession()` to get current user
- Use `authClient.admin.checkRolePermission()` to check permissions
- Only render dialogs if user has permission

## Usage in Page

```typescript
import { DataTable } from "@/components/data-table/data-table";
import { yourColumns } from "./your-data-table-columns";
import { yourSearchParamsCache } from "./your-search-params";

export default async function Page({ searchParams }: { searchParams: yourSearchParamsCache }) {
  const data = await fetchYourData(searchParams);
  
  return (
    <DataTable
      columns={yourColumns}
      data={data.data}
      pageCount={data.pageCount}
      totalCount={data.totalCount}
      toolbar={<YourDomainDataTableToolbar />}
    />
  );
}
```

## Search Params Parsers

Each page should have its own search params cache using nuqs.

## Forms and Dialogs

Dialogs are typically in the domain folder alongside row actions.

### Create Button (`create-*-button.tsx`)
```typescript
"use client";

import { FilePlus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { YourDialog } from "./your-dialog";

export function CreateYourEntityButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        <FilePlus className="mr-2 h-4 w-4" />
        New Entity
      </Button>

      <YourDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
```

### Dialog with React Hook Form + Zod
```typescript
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { createYourEntity } from "@/actions/your-domain/create-your-entity";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { ActionResponse } from "@/lib/actions/action-utils";
import { yourSchema, type YourFormData } from "./your-schema";

interface YourDialogProps {
  entity?: YourEntityType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function YourDialog({ entity, open, onOpenChange }: YourDialogProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const isEdit = !!entity;

  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isDirty },
  } = useForm<YourFormData>({
    resolver: zodResolver(yourSchema),
    defaultValues: { field1: "", field2: "" },
  });

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      if (isEdit && entity) {
        reset({ field1: entity.field1, field2: entity.field2 });
      } else {
        reset({ field1: "", field2: "" });
      }
    }
  }, [open, isEdit, entity, reset]);

  const onSubmit = (data: YourFormData) => {
    startTransition(async () => {
      const response = isEdit
        ? await updateEntity({ ...data, id: entity.id })
        : await createEntity(data);

      if (response.success) {
        toast.success(isEdit ? "Updated" : "Created");
        onOpenChange(false);
        router.refresh();
      } else {
        toast.error(response.error?.message);
        if (response.error?.field) {
          setError(response.error.field as keyof YourFormData, {
            type: "server",
            message: response.error.message,
          });
        }
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit" : "Create"} Entity
          </DialogTitle>
          <DialogDescription>
            {isEdit ? "Update the entity." : "Create a new entity."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup className="gap-4">
            <Controller
              name="field1"
              control={control}
              render={({ field }) => (
                <Field data-invalid={!!errors.field1}>
                  <FieldLabel>Label</FieldLabel>
                  <Input {...field} disabled={isPending} />
                  {errors.field1?.message && (
                    <FieldError>{errors.field1.message}</FieldError>
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending || (isEdit && !isDirty)}
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? "Save" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

**Key points:**
- Use `zodResolver` from `@hookform/resolvers/zod`
- Use `Controller` for controlled inputs
- Reset form on dialog open/close
- Handle server errors with `setError` and show toast
- Use `router.refresh()` to refresh data after success
- Disable submit when pending or (edit mode + no changes)
