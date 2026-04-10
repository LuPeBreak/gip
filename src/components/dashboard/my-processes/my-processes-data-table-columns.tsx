"use client";

import type { ColumnDef } from "@tanstack/react-table";

import type { MyProcessItem } from "@/actions/processes/get-my-processes";
import { ProcessTransferBadge } from "@/components/processes/process-transfer-badge";
import { MyProcessesDataTableRowActions } from "./my-processes-data-table-row-actions";

export const myProcessesColumns: ColumnDef<MyProcessItem>[] = [
  {
    accessorKey: "number",
    header: "Número",
    size: 130,
    cell: ({ row }) => {
      const number = row.getValue("number") as string;
      return <span className="font-semibold">{number}</span>;
    },
  },
  {
    accessorKey: "description",
    header: "Descrição",
    size: 350,
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
    id: "emTramite",
    header: "Em Trâmite",
    size: 180,
    filterFn: (row) => {
      const pendingToUserId = row.original.pendingTransferToUserId;
      return pendingToUserId !== null && pendingToUserId !== undefined;
    },
    cell: ({ row }) => {
      const pendingToUserId = row.original.pendingTransferToUserId;
      const pendingToUserName = row.original.pendingTransferToUserName;
      if (!pendingToUserId) return null;

      return <ProcessTransferBadge userName={pendingToUserName ?? "Unknown"} />;
    },
  },
  {
    id: "actions",
    size: 50,
    cell: ({ row }) => (
      <MyProcessesDataTableRowActions processData={row.original} />
    ),
  },
];
