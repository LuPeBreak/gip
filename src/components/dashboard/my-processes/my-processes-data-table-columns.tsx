"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { MyProcessItem } from "@/actions/processes/get-my-processes";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { ProcessStatusBadge } from "@/components/processes/process-status-badge";
import { MyProcessesDataTableRowActions } from "./my-processes-data-table-row-actions";

export const myProcessesColumns: ColumnDef<MyProcessItem>[] = [
  {
    accessorKey: "number",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Número" />
    ),
    size: 130,
    cell: ({ row }) => {
      const number = row.getValue("number") as string;
      return <span className="font-semibold">{number}</span>;
    },
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Descrição" />
    ),
    size: 400,
    cell: ({ row }) => {
      const description = row.original.description;
      return (
        <span className="block truncate" title={description}>
          {description}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    size: 80,
    cell: ({ row }) => <ProcessStatusBadge status={row.original.status} />,
  },
  {
    id: "actions",
    size: 50,
    cell: ({ row }) => (
      <MyProcessesDataTableRowActions processData={row.original} />
    ),
  },
];
