"use client";

import { Check, ChevronDown, Search } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

export interface ComboboxProps<T> extends React.HTMLAttributes<HTMLDivElement> {
  items: T[];
  itemToStringValue?: (item: T) => string;
  itemToLabel?: (item: T) => string;
  value?: T | null;
  onValueChange?: (value: T | null) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  disabled?: boolean;
}

export function Combobox<T>({
  items,
  itemToStringValue = (item) => String(item),
  itemToLabel = (item) => String(item),
  value,
  onValueChange,
  placeholder = "Select an item",
  searchPlaceholder = "Search...",
  emptyText = "No items found.",
  disabled = false,
  className,
  ...props
}: ComboboxProps<T>) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const selectedValue = value ? itemToStringValue(value) : "";

  const filteredItems = React.useMemo(() => {
    if (!search) return items;
    const lowerSearch = search.toLowerCase();
    return items.filter((item) =>
      itemToLabel(item).toLowerCase().includes(lowerSearch),
    );
  }, [items, search, itemToLabel]);

  const handleSelect = (item: T) => {
    onValueChange?.(item);
    setOpen(false);
    setSearch("");
  };

  return (
    <div className={cn("relative", className)} {...props}>
      <div
        className={cn(
          "flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          open && "ring-[3px] ring-ring/20",
        )}
        onClick={() => !disabled && setOpen(!open)}
        role="combobox"
        aria-expanded={open}
        tabIndex={disabled ? -1 : 0}
      >
        <span className={cn(!selectedValue && "text-muted-foreground")}>
          {value ? itemToLabel(value) : placeholder}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 opacity-50 transition-transform",
            open && "rotate-180",
          )}
        />
      </div>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md">
          <div className="flex items-center border-b px-2 py-1.5">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <input
              className="flex h-8 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              autoFocus
            />
          </div>

          {filteredItems.length === 0 ? (
            <div className="p-2 text-sm text-muted-foreground">{emptyText}</div>
          ) : (
            <div className="max-h-60 overflow-y-auto p-1">
              {filteredItems.map((item, index) => {
                const itemValue = itemToStringValue(item);
                const isSelected = itemValue === selectedValue;

                return (
                  <div
                    key={`${itemValue}-${index}`}
                    className={cn(
                      "relative flex cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none",
                      "hover:bg-accent hover:text-accent-foreground",
                      isSelected && "bg-accent text-accent-foreground",
                    )}
                    onClick={() => handleSelect(item)}
                    role="option"
                    aria-selected={isSelected}
                  >
                    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                      {isSelected && <Check className="h-4 w-4" />}
                    </span>
                    <span>{itemToLabel(item)}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
