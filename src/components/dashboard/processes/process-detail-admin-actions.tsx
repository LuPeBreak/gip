"use client";

import { ArrowRightLeft, Shield } from "lucide-react";
import { useState } from "react";
import type { ProcessBase } from "@/actions/processes/process-types";
import { AdminForceTransferDialog } from "@/components/dashboard/processes/admin-force-transfer-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface ProcessDetailAdminActionsProps {
  process: ProcessBase;
}

export function ProcessDetailAdminActions({
  process,
}: ProcessDetailAdminActionsProps) {
  const [showForceTransfer, setShowForceTransfer] = useState(false);
  const isFinished = process.status === "FINISHED";

  return (
    <>
      <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/20">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            <CardTitle className="text-base">
              Intervenção Administrativa
            </CardTitle>
          </div>
          <CardDescription>
            Ações para destravar ou transferir este processo.
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-4">
          <Button
            variant="outline"
            className="w-full"
            disabled={isFinished}
            onClick={() => setShowForceTransfer(true)}
          >
            <ArrowRightLeft className="mr-2 h-4 w-4" />
            Transferência Forçada
          </Button>
        </CardContent>
      </Card>

      <AdminForceTransferDialog
        process={process}
        open={showForceTransfer}
        onOpenChange={setShowForceTransfer}
      />
    </>
  );
}
