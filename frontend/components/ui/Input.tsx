import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, success, type, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(false);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      setHasValue(e.target.value !== "");
      props.onBlur?.(e);
    };

    return (
      <div className="relative w-full">
        <input
          type={type}
          className={cn(
            "peer w-full h-11 px-4 pt-5 pb-1 rounded-md border transition-all duration-200 ease-premium",
            "bg-slate-800/50",
            "text-cyan-100",
            "placeholder-transparent",
            "focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400/50",
            error
              ? "border-red-500 focus:ring-red-500"
              : success
              ? "border-green-500 focus:ring-green-500"
              : "border-cyan-500/30",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            className
          )}
          ref={ref}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={label || props.placeholder}
          {...props}
        />
        {label && (
          <label
            className={cn(
              "absolute left-4 transition-all duration-200 ease-premium pointer-events-none",
              "text-cyan-300",
              isFocused || hasValue || props.value
                ? "top-1.5 text-xs font-medium"
                : "top-3 text-base",
              error
                ? "text-red-400"
                : success
                ? "text-green-400"
                : "peer-focus:text-cyan-400"
            )}
          >
            {label}
          </label>
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

Input.displayName = "Input";

export { Input };
