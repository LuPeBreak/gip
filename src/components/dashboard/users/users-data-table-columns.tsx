"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { UsersDataTableRowActions } from "./users-data-table-row-actions";

// This type is used to define the shape of our data.
export type UserColumn = {
  id: string;
  name: string;
  email: string;
  role: string | null;
  banned?: boolean | null;
  banReason?: string | null;
  sectorId?: string | null;
  sectorName?: string | null;
};

export const usersColumns: ColumnDef<UserColumn>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nome" />
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Cargo" />
    ),
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      return (
        <Badge variant={role === "admin" ? "default" : "secondary"}>
          {role || "user"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "sectorName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Setor" />
    ),
    cell: ({ row }) => {
      const sectorName = row.getValue("sectorName") as string | undefined;
      return <span className="text-muted-foreground">{sectorName || "—"}</span>;
    },
  },
  {
    accessorKey: "banned",
    header: "Status",
    cell: ({ row }) => {
      const isBanned = row.getValue("banned") as boolean;
      return (
        <Badge variant={isBanned ? "destructive" : "outline"}>
          {isBanned ? "Banido" : "Ativo"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    size: 50,
    cell: ({ row }) => <UsersDataTableRowActions user={row.original} />,
  },
];
