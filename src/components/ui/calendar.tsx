import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 pointer-events-auto", className)}
      classNames={{
        months: "flex flex-col w-full",
        month: "space-y-2 w-full",
        caption: "flex justify-center pt-1 relative items-center h-12",
        caption_label: "text-base font-semibold text-foreground",
        nav: "flex items-center",
        nav_button: cn(
          "h-10 w-10 bg-secondary rounded-full flex items-center justify-center hover:bg-secondary/80 transition-colors",
        ),
        nav_button_previous: "absolute left-0",
        nav_button_next: "absolute right-0",
        table: "w-full border-collapse",
        head_row: "flex w-full",
        head_cell: "text-muted-foreground flex-1 font-medium text-xs text-center py-3",
        row: "flex w-full",
        cell: "flex-1 p-1 text-center relative focus-within:z-20",
        day: "h-10 w-full rounded-xl font-normal text-sm text-foreground bg-muted/50 hover:bg-muted transition-colors flex items-center justify-center",
        day_range_end: "day-range-end",
        day_selected: "!bg-primary !text-primary-foreground hover:!bg-primary font-semibold shadow-[0_0_12px_hsl(var(--primary)/0.5)]",
        day_today: "ring-2 ring-primary/60 font-bold text-primary",
        day_outside: "text-muted-foreground/40",
        day_disabled: "text-muted-foreground/30",
        day_range_middle: "aria-selected:bg-accent",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ..._props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ..._props }) => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
