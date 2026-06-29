import {
  format,
  parseISO,
  startOfDay,
  subDays,
  differenceInCalendarDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import type { FirstDayOfWeek } from "@/types";

/** Local-timezone YYYY-MM-DD key. Never use toISOString() (UTC) for this. */
export function toDateKey(date: Date = new Date()): string {
  return format(date, "yyyy-MM-dd");
}

export function fromDateKey(key: string): Date {
  return parseISO(key); // local midnight
}

export function isToday(key: string): boolean {
  return key === toDateKey();
}

export function isPast(key: string): boolean {
  return fromDateKey(key) < startOfDay(new Date());
}

export function dayOfYear(date: Date = new Date()): number {
  return differenceInCalendarDays(date, new Date(date.getFullYear(), 0, 0));
}

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function daysInYear(year: number): number {
  return isLeapYear(year) ? 366 : 365;
}

export function daysAgoKey(n: number, from: Date = new Date()): string {
  return toDateKey(subDays(from, n));
}

function weekStartsOn(firstDayOfWeek: FirstDayOfWeek): 0 | 1 {
  return firstDayOfWeek === "sunday" ? 0 : 1;
}

export function getWeekStart(firstDayOfWeek: FirstDayOfWeek, date: Date = new Date()): Date {
  return startOfWeek(date, { weekStartsOn: weekStartsOn(firstDayOfWeek) });
}

export function getWeekEnd(firstDayOfWeek: FirstDayOfWeek, date: Date = new Date()): Date {
  return endOfWeek(date, { weekStartsOn: weekStartsOn(firstDayOfWeek) });
}

export function getMonthStart(date: Date = new Date()): Date {
  return startOfMonth(date);
}

export function getMonthEnd(date: Date = new Date()): Date {
  return endOfMonth(date);
}

export function formatDisplayDate(key: string): string {
  return format(fromDateKey(key), "MMM d, yyyy");
}

export function formatTime(date: Date): string {
  return format(date, "h:mm a");
}

const WEEKDAY_LABELS_MON = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const WEEKDAY_LABELS_SUN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function getWeekdayLabels(firstDayOfWeek: FirstDayOfWeek): string[] {
  return firstDayOfWeek === "sunday" ? WEEKDAY_LABELS_SUN : WEEKDAY_LABELS_MON;
}
