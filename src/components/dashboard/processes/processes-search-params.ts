import { createSearchParamsCache, parseAsString } from "nuqs/server";
import {
  orderByParser,
  orderParser,
  pageParser,
  pageSizeParser,
  searchParser,
} from "@/components/data-table/data-table-base-search-params";

export const statusParser = parseAsString.withDefault("");

export const processesSearchParamsCache = createSearchParamsCache({
  page: pageParser,
  pageSize: pageSizeParser,
  search: searchParser,
  status: statusParser,
  orderBy: orderByParser,
  order: orderParser,
});

export { searchParser };
