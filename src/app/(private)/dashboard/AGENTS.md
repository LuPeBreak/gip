# Dashboard Pages Guidelines

This file defines patterns for dashboard pages in `src/app/(private)/dashboard/`.

## Structure

```
src/app/(private)/dashboard/
├── page.tsx                # Dashboard home
├── processes/              # Processes domain
│   ├── page.tsx
│   └── [id]/page.tsx       # Detail page
├── users/                  # Users domain (admin only)
├── sectors/                # Sectors domain
└── inbox/                  # User's inbox
```

## Page Pattern

```typescript
import type { SearchParams } from "nuqs/server";
import { DataTable } from "@/components/data-table/data-table";
import { DashboardPageWrapper } from "@/components/layout/dashboard-page-wrapper";
import { yourColumns } from "./your-data-table-columns";
import { YourToolbar } from "./your-data-table-toolbar";
import { yourSearchParamsCache } from "./your-search-params";
import { yourAction } from "@/actions/your-domain/your-action";

interface PageProps {
  searchParams: Promise<SearchParams>;
}

export default async function Page({ searchParams }: PageProps) {
  const sp = await searchParams;
  const { page, pageSize, search, orderBy, order } =
    yourSearchParamsCache.parse(sp);

  const response = await yourAction({ page, pageSize, search, orderBy, order });

  const data = response.success ? response.data : null;

  return (
    <DashboardPageWrapper title="Title" description="Description">
      <DataTable
        columns={yourColumns}
        data={data?.data ?? []}
        pageCount={data?.pageCount ?? 0}
        totalCount={data?.totalCount ?? 0}
        toolbar={<YourToolbar />}
      />
    </DashboardPageWrapper>
  );
}
```

## Key Points

- Session check is done in the layout, not in each page
- Use `SearchParams` type from `nuqs/server`
- Parse search params using the cache
- Fetch data server-side using actions
- Use `DashboardPageWrapper` for consistent layout

### Handling Failed Responses

Always check `response.success` before using data:

```typescript
const response = await yourAction({ /* params */ });

// Safe access pattern
const data = response.success ? response.data : null;

// Then use nullish coalescing for table
data={data?.data ?? []}
pageCount={data?.pageCount ?? 0}
totalCount={data?.totalCount ?? 0}
```

## Related

- `src/components/data-table/AGENTS.md` - Data table patterns
- `src/actions/AGENTS.md` - Server actions patterns
