import { parseAsInteger, parseAsString } from "nuqs/server";

export const pageParser = parseAsInteger.withDefault(1);
export const pageSizeParser = parseAsInteger.withDefault(15);
export const searchParser = parseAsString.withDefault("");
export const orderByParser = parseAsString.withDefault("name");
export const orderParser = parseAsString.withDefault("asc");
