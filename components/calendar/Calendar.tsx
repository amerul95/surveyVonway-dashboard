// components/calendar.tsx
import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface CalendarProps {
    selectedDate: Date | null;
    onDateChange: (date: Date | null) => void;
}

export default function Calendar({ selectedDate, onDateChange }: CalendarProps) {
    return (
        <DatePicker
            selected={selectedDate}
            onChange={onDateChange}
            placeholderText="Select a date"
        />
    );
}
