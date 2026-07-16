import { z } from "zod";

/**
 * Shared zod helpers used across feature schemas.
 */

// Empty date inputs submit "" — treat that as "not set".
// Bare yyyy-mm-dd strings (from <input type="date">) would otherwise parse
// as UTC midnight and display as the previous day in western timezones, so
// pin them to local midnight instead.
export const optionalDate = z.preprocess((value) => {
  if (value === "" || value === null) return undefined;
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return `${value}T00:00:00`;
  }
  return value;
}, z.coerce.date().optional());

// Number inputs submit "" when cleared; garbage becomes undefined.
export const optionalInt = z.preprocess((value) => {
  if (value === "" || value === null || value === undefined) return undefined;
  const n = Number(value);
  return Number.isNaN(n) ? undefined : n;
}, z.number().int().min(0).optional());
