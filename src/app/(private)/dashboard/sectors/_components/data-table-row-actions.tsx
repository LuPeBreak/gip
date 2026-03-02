"use client";

import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { SectorColumn } from "./data-table-columns";

interface DataTableRowActionsProps {
  sector: SectorColumn;
}

export function DataTableRowActions({
  sector: _sector,
}: DataTableRowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Abrir menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem
          onClick={() => toast.info("A ser implementado (Etapa 3)")}
        >
          <Edit className="mr-2 h-4 w-4" />
          Editar
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => {
            toast.info("A ser implementado (Etapa 3)");
          }}
          className="text-destructive focus:bg-destructive focus:text-destructive-foreground focus:outline-none"
        >
          <Trash className="mr-2 h-4 w-4" />
          Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>

      {/* 
        Os modais de Excluir e Editar (Etapa 3) entrarão aqui assim 
        que avançarmos. Por enquanto deixamos o state pronto.
      */}
    </DropdownMenu>
  );
}
