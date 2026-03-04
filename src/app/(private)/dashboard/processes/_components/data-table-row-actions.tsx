"use client";

import { Archive, Edit, MoreHorizontal, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type ProcessColumn = {
  id: string;
  number: string;
  description: string;
  status: "OPEN" | "FINISHED" | "EXTERNAL";
  ownerId: string | null;
  ownerName?: string | null;
  createdAt: Date;
};

interface DataTableRowActionsProps {
  processData: ProcessColumn;
  readonlyActions?: boolean;
}

export function DataTableRowActions({
  processData,
  readonlyActions,
}: DataTableRowActionsProps) {
  if (readonlyActions) {
    return (
      <Button variant="ghost" disabled className="flex h-8 w-8 p-0">
        <MoreHorizontal className="h-4 w-4 opacity-50" />
        <span className="sr-only">Ações Bloqueadas</span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Abrir menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        {processData.status === "OPEN" && (
          <DropdownMenuItem>
            <Archive className="mr-2 h-4 w-4" />
            Finalizar
          </DropdownMenuItem>
        )}

        <DropdownMenuItem>
          <Edit className="mr-2 h-4 w-4" />
          Editar
        </DropdownMenuItem>

        {processData.status === "OPEN" && (
          <DropdownMenuItem className="text-destructive">
            <Trash className="mr-2 h-4 w-4" />
            Excluir
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
