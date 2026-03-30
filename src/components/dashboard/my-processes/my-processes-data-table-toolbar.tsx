"use client";

import { X } from "lucide-react";
import { useQueryState } from "nuqs";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { inTransferParser, searchParser } from "./my-processes-search-params";

export function MyProcessesDataTableToolbar() {
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useQueryState(
    "search",
    searchParser.withOptions({ shallow: false, startTransition }),
  );

  const [showInTransfer, setShowInTransfer] = useQueryState(
    "inTransfer",
    inTransferParser.withOptions({ shallow: false, startTransition }),
  );

  const isFiltered = search !== "" || showInTransfer;

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

        <Button
          variant={showInTransfer ? "secondary" : "outline"}
          size="sm"
          onClick={() => setShowInTransfer(!showInTransfer)}
        >
          Em Trâmite
        </Button>

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              setSearch("");
              setShowInTransfer(false);
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
