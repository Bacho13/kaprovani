"use client";
import React, { useState, useEffect } from "react";
import styles from "./UIStyles/Calendar.module.css";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  startOfToday,
  isBefore,
} from "date-fns";

interface MyDateRange {
  checkIn: Date | null;
  checkOut: Date | null;
}

interface CalendarProps {
  month: Date;
  dateRange: MyDateRange;
  handleDateClick: (day: Date) => void;
}

function Calendar({ month, dateRange, handleDateClick }: CalendarProps) {
  const [calendarDays, setCalendarDays] = useState<Date[]>([]);
  const { checkIn, checkOut } = dateRange;
  const today = startOfToday();

  useEffect(() => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    setCalendarDays(days);
  }, [month]);

  const isDaySelected = (day: Date) => {
    return (
      (checkIn && isSameDay(day, checkIn)) ||
      (checkOut && isSameDay(day, checkOut))
    );
  };

  const isDayInRange = (day: Date) => {
    if (checkIn && checkOut) {
      return day > checkIn && day < checkOut;
    }
    return false;
  };

  const isDayDisabled = (day: Date) => {
    return isBefore(day, today) || isSameDay(day, today);
  };

  return (
    <div className={styles.calendarWrapper}>
      <table className={styles.calendar}>
        <thead>
          <tr>
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 6 }).map((_, weekIndex) => (
            <tr key={weekIndex}>
              {Array.from({ length: 7 }).map((_, dayIndex) => {
                const day = calendarDays[weekIndex * 7 + dayIndex];
                const isSelected = isDaySelected(day);
                const isInRange = isDayInRange(day);
                const isCurrentMonth =
                  day && day.getMonth() === month.getMonth();
                const isDisabled = day && isDayDisabled(day);

                return (
                  <td
                    key={dayIndex}
                    className={`${styles.day} ${
                      isSelected ? styles.selected : ""
                    } ${isInRange ? styles.inRange : ""} ${
                      !isCurrentMonth ? styles.notCurrentMonth : ""
                    } ${isDisabled ? styles.disabled : ""}`}
                    onClick={() => !isDisabled && day && handleDateClick(day)}
                  >
                    {day ? format(day, "d") : ""}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Calendar;
