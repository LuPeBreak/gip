"use client";

import { FilePlus } from "lucide-react";
import { useState } from "react";
import { ProcessDialog } from "@/components/dashboard/processes/process-dialog";
import { Button } from "@/components/ui/button";

export function CreateProcessButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        className="h-9 px-4"
        onClick={() => setOpen(true)}
      >
        <FilePlus className="mr-2 h-4 w-4" />
        Novo Processo
      </Button>

      <ProcessDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
