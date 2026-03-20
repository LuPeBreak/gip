"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { ProcessItem } from "@/actions/processes/get-processes";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { ProcessStatusBadge } from "@/components/processes/process-status-badge";
import { ProcessesDataTableRowActions } from "./processes-data-table-row-actions";

export const processesColumns: ColumnDef<ProcessItem>[] = [
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
    accessorKey: "ownerName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Posse Atual" />
    ),
    cell: ({ row }) => {
      const ownerName = row.original.ownerName;
      const sectorName = row.original.ownerSectorName;

      if (!ownerName) {
        return (
          <span className="italic text-muted-foreground">
            Arquivo / Sem posse
          </span>
        );
      }

      return (
        <div className="flex flex-col gap-0.5">
          <span>{ownerName}</span>
          {sectorName && (
            <span className="text-xs text-muted-foreground">{sectorName}</span>
          )}
        </div>
      );
    },
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
      <ProcessesDataTableRowActions processData={row.original} />
    ),
  },
];
