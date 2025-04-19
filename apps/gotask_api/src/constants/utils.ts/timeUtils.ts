// timeUtil.ts
import { ITimeSpentEntry } from "../../domain/model/task/task";

export class TimeUtil {
  /**
   * Parse time string in format "XdYh" to total hours
   * @param timeString Time string in format "XdYh", "Xd", or "Yh"
   * @returns Total hours
   *
   */
  static parseTimeString(timeString: string): number {
    if (!timeString) return 0;

    const daysMatch = timeString.match(/(\d+)d/);
    const hoursMatch = timeString.match(/(\d+)h/);

    const days = daysMatch ? parseInt(daysMatch[1], 10) : 0;
    const hours = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;

    return days * 8 + hours; // Assuming 1 day = 8 hours
  }
  /**
   * Convert "H:MM" time format (e.g. "1:30") to total hours
   * @param timeStr Time string like "1:30"
   * @returns Total hours as number
   */
  static parseHourMinuteString(timeStr: string): number {
    const [hours, minutes] = timeStr.split(":").map(Number);
    const totalMinutes = (hours || 0) * 60 + (minutes || 0);
    return totalMinutes / 60;
  }

  /**
   * Convert hours to "XdYh" format
   * @param totalHours Total hours to convert
   * @returns Formatted time string "XdYh"
   */
  static formatHoursToTimeString(totalHours: number): string {
    const days = Math.floor(totalHours / 8);
    const hours = totalHours % 8;
    return `${days}d${hours}h`;
  }

  /**
   * Calculate total time from time entries
   * @param timeEntries Array of time entries
   * @returns Total hours
   */
  static calculateTotalTime(timeEntries: ITimeSpentEntry[]): number {
    if (!timeEntries || !Array.isArray(timeEntries)) return 0;

    return timeEntries.reduce((total, entry) => {
      return total + TimeUtil.parseTimeString(entry.time_logged);
    }, 0);
  }

  /**
   * Calculate remaining time from estimated and spent time
   * @param estimatedTime Estimated time string
   * @param spentTime Spent time string
   * @returns Remaining time string in format "XdYh"
   */
  static calculateRemainingTime(estimatedTime: string, spentTime: string): string {
    const estimatedHours = TimeUtil.parseTimeString(estimatedTime);
    const spentHours = TimeUtil.parseTimeString(spentTime);
    const remainingHours = Math.max(0, estimatedHours - spentHours);

    return TimeUtil.formatHoursToTimeString(remainingHours);
  }

  /**
   * Validate time string format
   * @param timeString Time string to validate
   * @returns Boolean indicating if format is valid
   */
  static isValidTimeFormat(timeString: string): boolean {
    // Valid formats: "2d4h", "3d", "6h"
    return /^(\d+d)?(\d+h)?$/.test(timeString) && timeString.length > 0;
  }
}

