"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
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
      <DataTableColumnHeader column={column} title="Usuários Vinculados" />
    ),
    cell: ({ row }) => {
      const count = row.getValue("usersCount") as number;
      return (
        <Badge variant={count > 0 ? "secondary" : "outline"}>
          {count} {count === 1 ? "Usuário" : "Usuários"}
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
