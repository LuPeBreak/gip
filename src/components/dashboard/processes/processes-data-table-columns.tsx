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
    size: 350,
    cell: ({ row }) => {
      const description = row.getValue("description") as string;
      return (
        <span className="block truncate" title={description}>
          {description}
        </span>
      );
    },
  },
  {
    accessorKey: "ownerName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Posse Atual" />
    ),
    size: 150,
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
    accessorKey: "location",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Externo" />
    ),
    size: 150,
    cell: ({ row }) => {
      const location = row.original.location;
      if (!location) {
        return <span className="text-muted-foreground">—</span>;
      }
      return (
        <span className="block truncate" title={location}>
          {location}
        </span>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cadastrado em" />
    ),
    size: 120,
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
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    size: 100,
    cell: ({ row }) => <ProcessStatusBadge status={row.original.status} />,
  },
  {
    id: "actions",
    size: 50,
    cell: ({ row }) => (
      <ProcessesDataTableRowActions processData={row.original} />
    ),
  },
];
