"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../../_components/data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";

export type SectorColumn = {
  id: string;
  name: string;
  description: string | null;
  usersCount: number;
  createdAt: Date;
};

export const columns: ColumnDef<SectorColumn>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Setor" />
    ),
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Descrição" />
    ),
    cell: ({ row }) => {
      const desc = row.getValue("description") as string | null;
      return <span className="text-muted-foreground">{desc || "—"}</span>;
    },
  },
  {
    accessorKey: "usersCount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Funcionários" />
    ),
    cell: ({ row }) => {
      const count = row.getValue("usersCount") as number;
      return <span className="font-medium text-muted-foreground">{count}</span>;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Criado em" />
    ),
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as Date;
      return (
        <span>
          {new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(date)}
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions sector={row.original} />,
  },
];
