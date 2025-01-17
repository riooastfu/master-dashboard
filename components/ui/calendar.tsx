"use client"

import * as React from "react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons"

import { Calendar as Cal, CalendarProps as ReactCalendarProps } from "react-calendar";
import "react-calendar/dist/Calendar.css";

export type CalendarProps = ReactCalendarProps & {
  className?: string;
};

function Calendar({
  className,
  ...props
}: CalendarProps) {
  return (
    <Cal className="rounded-lg" {...props} />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
