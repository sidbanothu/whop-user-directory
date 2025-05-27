import { useState } from "react";

export function TagsInput({ value, onChange, placeholder, max = 8 }: {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  max?: number;
}) {
  const [input, setInput] = useState("");

  const safeValue = Array.isArray(value) ? value : [];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && input.trim()) {
      e.preventDefault();
      if (safeValue.length < max && !safeValue.includes(input.trim())) {
        const newTags = [...safeValue, input.trim()];
        console.log('TagsInput handleKeyDown onChange:', newTags);
        onChange(newTags);
        setInput("");
      }
    } else if (e.key === "Backspace" && !input && safeValue.length) {
      onChange(safeValue.slice(0, -1));
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 border rounded px-2 py-1 bg-white">
      {safeValue.map((tag, i) => (
        <span key={i} className="bg-gray-200 rounded px-2 py-0.5 text-sm flex items-center">
          {tag}
          <button
            type="button"
            className="ml-1 text-gray-500 hover:text-red-500"
            onClick={() => onChange(safeValue.filter((t) => t !== tag))}
            aria-label={`Remove ${tag}`}
          >
            ×
          </button>
        </span>
      ))}
      <input
        className="flex-1 min-w-[120px] border-none outline-none py-1"
        type="text"
        value={input}
        onChange={(e) => {
          console.log('TagsInput input onChange:', e.target.value);
          setInput(e.target.value);
        }}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        maxLength={32}
        disabled={safeValue.length >= max}
      />
    </div>
  );
} 