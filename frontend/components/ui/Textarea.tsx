import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  success?: boolean;
  autoResize?: boolean;
  maxLength?: number;
  showCount?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      error,
      success,
      autoResize = true,
      maxLength,
      showCount = false,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(false);
    const [charCount, setCharCount] = React.useState(0);
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(false);
      setHasValue(e.target.value !== "");
      props.onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length);
      if (autoResize && textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
      props.onChange?.(e);
    };

    React.useImperativeHandle(ref, () => textareaRef.current!);

    return (
      <div className="relative w-full">
        <textarea
          className={cn(
            "peer w-full min-h-[88px] px-4 pt-5 pb-1 rounded-md border transition-all duration-200 ease-premium resize-none",
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
          ref={textareaRef}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          placeholder={label || props.placeholder}
          maxLength={maxLength}
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
        {showCount && maxLength && (
          <p className="mt-1.5 text-xs text-cyan-300/60 text-right">
            {charCount} / {maxLength}
          </p>
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

Textarea.displayName = "Textarea";

export { Textarea };
