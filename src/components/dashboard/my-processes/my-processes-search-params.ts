import { createSearchParamsCache, parseAsBoolean } from "nuqs/server";
import {
  orderByParser,
  orderParser,
  pageParser,
  pageSizeParser,
  searchParser,
} from "@/components/data-table/data-table-base-search-params";

export const inTransferParser = parseAsBoolean.withDefault(false);

export const processesSearchParamsCache = createSearchParamsCache({
  page: pageParser,
  pageSize: pageSizeParser,
  search: searchParser,
  orderBy: orderByParser,
  order: orderParser,
  inTransfer: inTransferParser,
});

export { searchParser };
