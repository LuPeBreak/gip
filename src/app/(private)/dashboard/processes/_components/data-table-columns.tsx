"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "../../_components/data-table-column-header";
import {
  DataTableRowActions,
  type ProcessColumn,
} from "./data-table-row-actions";

export const columns: ColumnDef<ProcessColumn>[] = [
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
      if (!ownerName) {
        return (
          <span className="italic text-muted-foreground">
            Arquivo / Sem posse
          </span>
        );
      }
      return <span>{ownerName}</span>;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.original.status;

      if (status === "FINISHED") {
        return <Badge variant="secondary">Arquivado</Badge>;
      }

      if (status === "EXTERNAL") {
        return (
          <Badge
            variant="outline"
            className="border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/50 dark:bg-blue-900/20 dark:text-blue-400"
          >
            Externo
          </Badge>
        );
      }

      return (
        <Badge className="bg-emerald-500 text-white hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700">
          Aberto
        </Badge>
      );
    },
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
    cell: ({ row }) => <DataTableRowActions processData={row.original} />,
  },
];
