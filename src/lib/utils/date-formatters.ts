const BRAZIL_TIMEZONE = "America/Sao_Paulo";

interface FormatDateOptions {
  dateStyle?: "short" | "medium" | "long" | "full";
  timeStyle?: "short" | "medium" | "long" | "full";
}

/**
 * Format date for Brazil timezone (GMT-3)
 * Uses America/Sao_Paulo timezone to ensure consistent display
 * regardless of server location
 */
export function formatDate(date: Date, options: FormatDateOptions = {}) {
  const { dateStyle = "medium", timeStyle = "short" } = options;

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle,
    timeStyle,
    timeZone: BRAZIL_TIMEZONE,
  }).format(date);
}

/**
 * Format date for short display (e.g., "01/04/2026, 14:30")
 */
export function formatDateShort(date: Date) {
  return formatDate(date, { dateStyle: "short", timeStyle: "short" });
}

/**
 * Format date for medium display (e.g., "1 de abr. de 2026, 14:30")
 */
export function formatDateMedium(date: Date) {
  return formatDate(date, { dateStyle: "medium", timeStyle: "short" });
}

/**
 * Format date for long display (e.g., "1 de abril de 2026")
 */
export function formatDateLong(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
    timeZone: BRAZIL_TIMEZONE,
  }).format(date);
}

/**
 * Format date for Excel export (e.g., "01/04/2026 14:30")
 */
export function formatDateForExcel(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: BRAZIL_TIMEZONE,
    hour12: false,
  }).format(date);
}
