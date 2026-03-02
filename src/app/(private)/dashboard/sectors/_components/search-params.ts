import { createSearchParamsCache } from "nuqs/server";
import {
  orderByParser,
  orderParser,
  pageParser,
  pageSizeParser,
  searchParser,
} from "../../_components/search-params";

export const sectorsSearchParamsCache = createSearchParamsCache({
  page: pageParser,
  pageSize: pageSizeParser,
  search: searchParser,
  orderBy: orderByParser,
  order: orderParser,
});

export { searchParser };
