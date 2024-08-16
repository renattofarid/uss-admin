import { DateTime } from "luxon";
export function formatDate(date: string) {
  console.log({date})
  return DateTime.fromISO(date).toLocaleString(DateTime.DATETIME_MED);
}

export function transformSecondsToMinutes(seconds: number) {
  return Math.floor(seconds / 60) + "m " + (seconds % 60) + "s";
}