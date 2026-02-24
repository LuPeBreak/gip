"use client";

import type { Table } from "@tanstack/react-table";
import { X } from "lucide-react";
import { useQueryState } from "nuqs";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { roleParser, searchParser } from "../users/_components/search-params";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table: _table,
}: DataTableToolbarProps<TData>) {
  const [isPending, startTransition] = useTransition();

  // Debounced input setup using nuqs for standard React Server Components
  const [search, setSearch] = useQueryState(
    "search",
    searchParser.withOptions({ shallow: false, startTransition }),
  );

  // Debounced input setup using nuqs for standard React Server Components
  const [role, setRole] = useQueryState(
    "role",
    roleParser.withOptions({ shallow: false, startTransition }),
  );

  const isFiltered = search !== "" || role !== "";

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          type="search"
          name="table_search_query"
          autoComplete="off"
          data-lpignore="true"
          data-1p-ignore="true"
          data-kpm-ignore="true"
          placeholder="Procurar registro..."
          value={search ?? ""}
          onChange={(event) => setSearch(event.target.value)}
          className="h-9 w-[150px] lg:w-[250px]"
          data-pending={isPending ? "" : undefined}
        />

        <Select
          value={role ?? ""}
          onValueChange={(value) => setRole(value === "all" ? "" : value)}
        >
          <SelectTrigger className="h-9 w-[150px]">
            <SelectValue placeholder="Cargo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Cargos</SelectItem>
            <SelectItem value="admin">Administrador</SelectItem>
            <SelectItem value="user">Usuário</SelectItem>
          </SelectContent>
        </Select>

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              setSearch("");
              setRole("");
            }}
            className="h-8 px-2 lg:px-3"
          >
            Limpar
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
