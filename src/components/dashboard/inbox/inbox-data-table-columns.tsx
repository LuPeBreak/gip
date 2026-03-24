"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import type { InboxTransferItem } from "@/actions/processes/get-inbox-transfers";
import { Button } from "@/components/ui/button";
import { AcceptTransferDialog } from "./accept-transfer-dialog";
import { RejectTransferDialog } from "./reject-transfer-dialog";

interface InboxTransferActionsProps {
  transfer: InboxTransferItem;
}

export function InboxTransferActions({ transfer }: InboxTransferActionsProps) {
  const [isPending, _startTransition] = useTransition();
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showAcceptDialog, setShowAcceptDialog] = useState(false);

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowRejectDialog(true)}
          disabled={isPending}
        >
          <XCircle className="mr-1 h-3 w-3" />
          Rejeitar
        </Button>
        <Button
          size="sm"
          onClick={() => setShowAcceptDialog(true)}
          disabled={isPending}
        >
          <CheckCircle2 className="mr-1 h-3 w-3" />
          Aceitar
        </Button>
      </div>

      <RejectTransferDialog
        transfer={transfer}
        open={showRejectDialog}
        onOpenChange={setShowRejectDialog}
      />

      <AcceptTransferDialog
        transfer={transfer}
        open={showAcceptDialog}
        onOpenChange={setShowAcceptDialog}
      />
    </>
  );
}

export const inboxColumns = [
  {
    accessorKey: "processNumber",
    header: "Número do Processo",
    cell: ({ row }: { row: { original: InboxTransferItem } }) => {
      const transfer = row.original;
      return (
        <Link
          href={`/dashboard/processes/${transfer.processId}`}
          className="font-medium hover:underline"
        >
          {transfer.processNumber}
        </Link>
      );
    },
  },
  {
    accessorKey: "processDescription",
    header: "Descrição",
    cell: ({ row }: { row: { original: InboxTransferItem } }) => {
      return row.original.processDescription;
    },
  },
  {
    accessorKey: "fromUserName",
    header: "De",
    cell: ({ row }: { row: { original: InboxTransferItem } }) => {
      return row.original.fromUserName;
    },
  },
  {
    accessorKey: "observation",
    header: "Observação",
    cell: ({ row }: { row: { original: InboxTransferItem } }) => {
      return row.original.observation || "-";
    },
  },
  {
    accessorKey: "createdAt",
    header: "Data",
    cell: ({ row }: { row: { original: InboxTransferItem } }) => {
      return new Date(row.original.createdAt).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }: { row: { original: InboxTransferItem } }) => {
      return <InboxTransferActions transfer={row.original} />;
    },
  },
];
