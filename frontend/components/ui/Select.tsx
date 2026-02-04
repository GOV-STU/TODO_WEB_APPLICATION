"use client";

import * as React from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      options,
      value,
      onChange,
      placeholder = "Select an option",
      label,
      error,
      disabled,
      className,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [selectedValue, setSelectedValue] = React.useState(value);
    const selectRef = React.useRef<HTMLDivElement>(null);

    React.useImperativeHandle(ref, () => selectRef.current!);

    const selectedOption = options.find((opt) => opt.value === selectedValue);

    const handleSelect = (optionValue: string) => {
      setSelectedValue(optionValue);
      onChange?.(optionValue);
      setIsOpen(false);
    };

    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          selectRef.current &&
          !selectRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    React.useEffect(() => {
      setSelectedValue(value);
    }, [value]);

    return (
      <div ref={selectRef} className={cn("relative w-full", className)}>
        {label && (
          <label className="block text-sm font-medium text-cyan-300 mb-1.5">
            {label}
          </label>
        )}
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={cn(
            "w-full h-11 px-4 rounded-md border transition-all duration-200 ease-premium",
            "bg-slate-800/50",
            "text-cyan-100",
            "flex items-center justify-between",
            "focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400/50",
            error
              ? "border-red-500 focus:ring-red-500"
              : "border-cyan-500/30",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            isOpen && "ring-2 ring-cyan-500/50"
          )}
        >
          <span
            className={cn(
              "text-base",
              !selectedOption && "text-cyan-300/40"
            )}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-cyan-400 transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-slate-900 border border-cyan-500/30 rounded-md shadow-lg shadow-cyan-500/20 max-h-60 overflow-auto">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={cn(
                  "w-full px-4 py-2 text-left text-base transition-colors duration-150",
                  "hover:bg-cyan-500/10",
                  "flex items-center justify-between",
                  selectedValue === option.value &&
                    "bg-cyan-500/20 text-cyan-300"
                )}
              >
                <span className="text-cyan-100">{option.label}</span>
                {selectedValue === option.value && (
                  <Check className="h-4 w-4 text-cyan-400" />
                )}
              </button>
            ))}
          </div>
        )}

        {error && (
          <p className="mt-1.5 text-sm text-red-400">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export { Select };
