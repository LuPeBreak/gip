"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SectorDialog } from "./sector-dialog";

export function CreateSectorButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        className="h-9 px-4"
        onClick={() => setOpen(true)}
      >
        <Plus className="mr-2 h-4 w-4" />
        Novo Setor
      </Button>

      <SectorDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
