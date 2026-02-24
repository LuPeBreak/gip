"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

// This type is used to define the shape of our data.
export type UserColumn = {
  id: string;
  name: string;
  email: string;
  role: string | null;
  banned?: boolean | null;
  banReason?: string | null;
};

export const columns: ColumnDef<UserColumn>[] = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Cargo",
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
];
