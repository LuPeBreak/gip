"use client";

import { Download, Loader2 } from "lucide-react";
import { useQueryState } from "nuqs";
import { useTransition } from "react";
import { toast } from "sonner";
import { exportProcesses } from "@/actions/processes/export-processes";
import { Button } from "@/components/ui/button";
import {
  locationFilterParser,
  ownerIdParser,
  searchParser,
  sectorIdParser,
  statusParser,
} from "./processes-search-params";

export function ExportProcessesButton() {
  const [isPending, startTransition] = useTransition();

  const [search] = useQueryState("search", searchParser);
  const [status] = useQueryState("status", statusParser);
  const [ownerId] = useQueryState("ownerId", ownerIdParser);
  const [location] = useQueryState("location", locationFilterParser);
  const [sectorId] = useQueryState("sectorId", sectorIdParser);

  const handleExport = () => {
    startTransition(async () => {
      const response = await exportProcesses({
        search: search || undefined,
        status: status || undefined,
        location: location || undefined,
        ownerId: ownerId || undefined,
        sectorId: sectorId || undefined,
      });

      if (!response.success || !response.data) {
        toast.error(response.error?.message ?? "Erro ao exportar processos.");
        return;
      }

      const { base64, filename } = response.data;

      const byteChars = atob(base64);
      const byteArray = new Uint8Array(byteChars.length);
      for (let i = 0; i < byteChars.length; i++) {
        byteArray[i] = byteChars.charCodeAt(i);
      }
      const blob = new Blob([byteArray], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Relatório exportado com sucesso!");
    });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      disabled={isPending}
      className="h-9"
    >
      {isPending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Download className="mr-2 h-4 w-4" />
      )}
      Exportar Excel
    </Button>
  );
}
