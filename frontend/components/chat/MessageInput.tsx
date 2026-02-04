"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface MessageInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function MessageInput({
  onSend,
  disabled = false,
  placeholder = "Ask me to manage your tasks...",
}: MessageInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage("");
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    // Auto-resize textarea
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  return (
    <div className="p-4">
      <div className="relative flex items-end gap-2 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-purple-500/30 focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-500/20 focus-within:shadow-lg focus-within:shadow-purple-500/20 transition-all">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={placeholder}
          rows={1}
          className="flex-1 bg-transparent px-4 py-3 text-sm text-cyan-100 placeholder:text-purple-300/40 resize-none focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed max-h-[120px]"
        />
        <button
          onClick={handleSubmit}
          disabled={disabled || !message.trim()}
          className={cn(
            "flex-shrink-0 m-2 p-2 rounded-xl transition-all duration-200",
            message.trim() && !disabled
              ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:scale-105 active:scale-95 border border-purple-400/30"
              : "bg-slate-700 text-slate-500 cursor-not-allowed"
          )}
          aria-label="Send message"
        >
          {disabled ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </button>
      </div>
      <p className="mt-2 text-xs text-purple-300/40 text-center">
        Press Enter to send, Shift+Enter for new line
      </p>
    </div>
  );
}
