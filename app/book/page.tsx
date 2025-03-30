// book/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import styles from "./book.module.css";
import MainText from "../UIComponents/MainText";
import { format, addMonths, isSameMonth, startOfToday } from "date-fns";
import Calendar from "../UIComponents/Calendar";
import { CircleX } from "lucide-react";
import { useRouter } from "next/navigation";
import CottagesSmallList from "../UIComponents/CottagesSmallList";

interface MyDateRange {
  checkIn: Date | null;
  checkOut: Date | null;
}

function Book() {
  const [dateRange, setDateRange] = useState<MyDateRange>({
    checkIn: null,
    checkOut: null,
  });
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(true);
  const [selectedCottage, setSelectedCottage] = useState<{
    id: number | null;
    name: string | null;
  }>({ id: null, name: null }); // New state for selected cottage
  const router = useRouter();

  const { checkIn, checkOut } = dateRange;

  const handleDateClick = (day: Date) => {
    setDateRange((prev) => {
      if (prev.checkIn && prev.checkOut) {
        return { checkIn: day, checkOut: null };
      } else if (prev.checkIn && day > prev.checkIn) {
        return { ...prev, checkOut: day };
      } else {
        return { checkIn: day, checkOut: null };
      }
    });
  };

  const handleMonthChange = (change: number) => {
    setCurrentMonth(addMonths(currentMonth, change));
  };

  const isCurrentMonth = isSameMonth(currentMonth, startOfToday());

  const handlePrevMonthClick = () => {
    if (!isCurrentMonth) {
      handleMonthChange(-1);
    }
  };

  const handleCloseClick = () => {
    router.back();
  };

  const clickOnDate = () => {
    setIsCalendarOpen(true);
    console.log("cliked on date container and calendar is :");
  };

  const clickOnCottage = () => {
    setIsCalendarOpen(false);
    console.log("cliked on cottage container and calendar is :");
  };

  const handleCottageSelect = (cottageId: number, cottageName: string) => {
    setSelectedCottage({ id: cottageId, name: cottageName });
    console.log("Selected cottage:", cottageId, cottageName);
  };

  // Check if both dates and cottage are selected
  const isReservationButtonDisabled = !(
    checkIn &&
    checkOut &&
    selectedCottage.id
  );

  return (
    <div className={styles.mainContainer}>
      <div className={styles.paper}>
        <div className={styles.imageContainer}>
          <MainText />
        </div>
        <CircleX className={styles.closeIcon} onClick={handleCloseClick} />

        {/* Calendar */}
        {isCalendarOpen ? (
          <div className={styles.calendarContainer}>
            <div className={styles.monthContainer}>
              <div className={styles.monthNavigation}>
                <button
                  className={`${styles.navButtton} ${
                    isCurrentMonth ? styles.disabled : ""
                  }`}
                  onClick={handlePrevMonthClick}
                >
                  &lt;
                </button>
                <span className={styles.monthName}>
                  {format(currentMonth, "MMMM yyyy")}
                </span>
                <button
                  className={`${styles.navButtton} ${
                    isCurrentMonth ? styles.disabled : ""
                  }`}
                  onClick={handlePrevMonthClick}
                  style={{ visibility: "hidden" }}
                ></button>
              </div>
              <Calendar
                month={currentMonth}
                dateRange={dateRange}
                handleDateClick={handleDateClick}
              />
            </div>
            <div className={styles.monthContainer}>
              <div className={styles.monthNavigation}>
                <button
                  className={styles.navButtton}
                  onClick={() => handleMonthChange(1)}
                  style={{ visibility: "hidden" }}
                >
                  &gt;
                </button>
                <span className={styles.monthName}>
                  {format(addMonths(currentMonth, 1), "MMMM yyyy")}
                </span>

                <button
                  className={styles.navButtton}
                  onClick={() => handleMonthChange(1)}
                >
                  &gt;
                </button>
              </div>
              <Calendar
                month={addMonths(currentMonth, 1)}
                dateRange={dateRange}
                handleDateClick={handleDateClick}
              />
            </div>
          </div>
        ) : (
          <CottagesSmallList onCottageSelect={handleCottageSelect} /> // Pass the callback here
        )}
        {/* ----------------------- date display */}
        <div className={styles.dateAndCottage}>
          <div className={styles.dateDisplayContainer} onClick={clickOnDate}>
            <div className={styles.displayLabel}>
              <p className={styles.displayLabel}>DATES</p>
              {isCalendarOpen ? <div className={styles.labelLine}></div> : ""}
            </div>
            <div className={styles.dateDsiplay}>
              {checkIn && checkOut ? (
                <>
                  <div className={styles.dateItem}>
                    <span className={styles.dateLabel}>Check-in:</span>
                    <span className={styles.dateValue}>
                      {format(checkIn, "dd/MM/yyyy")}
                    </span>
                  </div>
                  <div className={styles.dateItem}>
                    <span className={styles.dateLabel}>Check-out:</span>
                    <span className={styles.dateValue}>
                      {format(checkOut, "dd/MM/yyyy")}
                    </span>
                  </div>
                </>
              ) : (
                <span>Please select check-in and check-out dates.</span>
              )}
            </div>
          </div>
          {/* ----------------------- cottage display--------------- */}
          <div className={styles.dateDisplayContainer} onClick={clickOnCottage}>
            <div className={styles.displayLabel}>
              <p className={styles.displayLabel}>COTTAGE</p>
              {!isCalendarOpen ? <div className={styles.labelLine}></div> : ""}
            </div>
            <div className={styles.dateDsiplay}>
              {selectedCottage.name ? (
                <span className={styles.dateValue}>{selectedCottage.name}</span>
              ) : (
                <span>Please select a cottage.</span>
              )}
            </div>
          </div>
        </div>
        <button
          className={styles.resrvationButton}
          disabled={isReservationButtonDisabled}
          style={{
            backgroundColor: isReservationButtonDisabled
              ? "gray"
              : "var(--green)",
            cursor: isReservationButtonDisabled ? "not-allowed" : "pointer",
            border: isReservationButtonDisabled
              ? "1px solid gray"
              : "1px solid var(--white)",
          }}
        >
          reservation
        </button>
      </div>
    </div>
  );
}

export default Book;
