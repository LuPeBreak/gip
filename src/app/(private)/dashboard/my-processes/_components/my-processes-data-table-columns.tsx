"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ProcessStatusBadge } from "@/components/processes/process-status-badge";
import { DataTableColumnHeader } from "../../../../../components/data-table/data-table-column-header";
import type { MyProcessItem } from "../_actions/get-my-processes";
import { MyProcessesDataTableRowActions } from "./my-processes-data-table-row-actions";

export const myProcessesColumns: ColumnDef<MyProcessItem>[] = [
  {
    accessorKey: "number",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Número" />
    ),
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
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => <ProcessStatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Criado em" />
    ),
    cell: ({ row }) => {
      const date = row.original.createdAt;
      return (
        <span>
          {new Intl.DateTimeFormat("pt-BR", {
            dateStyle: "short",
            timeStyle: "short",
          }).format(date)}
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <MyProcessesDataTableRowActions processData={row.original} />
    ),
  },
];
