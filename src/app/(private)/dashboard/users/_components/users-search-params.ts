import { createSearchParamsCache, parseAsString } from "nuqs/server";
import {
  orderByParser,
  orderParser,
  pageParser,
  pageSizeParser,
  searchParser,
} from "../../../../../components/data-table/data-table-base-search-params";

export const roleParser = parseAsString.withDefault("");

export const usersSearchParamsCache = createSearchParamsCache({
  page: pageParser,
  pageSize: pageSizeParser,
  search: searchParser,
  role: roleParser,
  orderBy: orderByParser,
  order: orderParser,
});

export { searchParser };
