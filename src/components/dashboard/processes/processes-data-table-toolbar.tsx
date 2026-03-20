"use client";

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
import { searchParser, statusParser } from "./processes-search-params";

export function ProcessesDataTableToolbar() {
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useQueryState(
    "search",
    searchParser.withOptions({ shallow: false, startTransition }),
  );

  const [status, setStatus] = useQueryState(
    "status",
    statusParser.withOptions({ shallow: false, startTransition }),
  );

  const isFiltered = search !== "" || status !== "";

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
          placeholder="Procurar processo..."
          value={search ?? ""}
          onChange={(event) => setSearch(event.target.value)}
          className="h-9 w-[250px] lg:w-[350px]"
          data-pending={isPending ? "" : undefined}
        />

        <Select
          value={status || "all"}
          onValueChange={(value) => setStatus(value === "all" ? "" : value)}
        >
          <SelectTrigger className="h-9 w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Status</SelectItem>
            <SelectItem value="OPEN">Aberto</SelectItem>
            <SelectItem value="FINISHED">Finalizado / Arquivado</SelectItem>
            <SelectItem value="EXTERNAL">Externo</SelectItem>
          </SelectContent>
        </Select>

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              setSearch("");
              setStatus("");
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
