import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsString,
} from "nuqs/server";

// 1. Define the parsers (with their defaults)
export const pageParser = parseAsInteger.withDefault(1);
export const pageSizeParser = parseAsInteger.withDefault(15);
export const searchParser = parseAsString.withDefault("");
export const roleParser = parseAsString.withDefault("");
export const orderByParser = parseAsString.withDefault("name");
export const orderParser = parseAsString.withDefault("asc");

// 2. Create the server cache using the shared parsers
export const usersSearchParamsCache = createSearchParamsCache({
  page: pageParser,
  pageSize: pageSizeParser,
  search: searchParser,
  role: roleParser,
  orderBy: orderByParser,
  order: orderParser,
});
