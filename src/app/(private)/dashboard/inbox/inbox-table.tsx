"use client";

import type { InboxTransferItem } from "@/actions/processes/get-inbox-transfers";
import { inboxColumns } from "@/components/dashboard/inbox/inbox-data-table-columns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateShort } from "@/lib/utils/date-formatters";

interface InboxTableProps {
  transfers: InboxTransferItem[];
}

export function InboxTable({ transfers }: InboxTableProps) {
  if (transfers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border-dashed border-2 rounded-lg text-muted-foreground">
        <p>
          Nenhuma transferência pendente. Aqui aparecerão os processos que foram
          tramitados para você.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {inboxColumns.map((column) => (
              <TableHead key={column.accessorKey || column.id}>
                {column.header as string}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {transfers.map((transfer) => (
            <TableRow key={transfer.id}>
              <TableCell className="font-medium">
                {transfer.processNumber}
              </TableCell>
              <TableCell>{transfer.processDescription}</TableCell>
              <TableCell>{transfer.fromUserName}</TableCell>
              <TableCell>{transfer.observation || "-"}</TableCell>
              <TableCell>
                {formatDateShort(new Date(transfer.createdAt))}
              </TableCell>
              <TableCell>
                {inboxColumns[5].cell?.({ row: { original: transfer } })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
