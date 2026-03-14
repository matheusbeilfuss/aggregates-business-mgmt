"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field } from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useId, useState } from "react";

interface DatePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  disabled?: boolean;
  id?: string;
}

export function DatePicker({ value, onChange, disabled, id }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const reactId = useId();
  const buttonId = id ?? reactId;

  return (
    <Field className="mx-auto w-min">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id={buttonId}
            className="justify-start font-normal"
            disabled={disabled}
          >
            {value.toLocaleDateString("pt-BR")}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="center">
          <Calendar
            mode="single"
            selected={value}
            defaultMonth={value}
            captionLayout="dropdown"
            onSelect={(date) => {
              if (date) {
                onChange(date);
                setOpen(false);
              }
            }}
          />
        </PopoverContent>
      </Popover>
    </Field>
  );
}
