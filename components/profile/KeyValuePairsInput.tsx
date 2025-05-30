import { useState } from "react";

export function KeyValuePairsInput({ value, onChange, keyPlaceholder, valuePlaceholder, max = 5 }: {
  value: Record<string, string>;
  onChange: (val: Record<string, string>) => void;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
  max?: number;
}) {
  const [keyInput, setKeyInput] = useState("");
  const [valueInput, setValueInput] = useState("");

  const handleAdd = () => {
    if (keyInput.trim() && valueInput.trim() && Object.keys(value).length < max) {
      const newVal = { ...value, [keyInput.trim()]: valueInput.trim() };
      console.log('KeyValuePairsInput handleAdd:', newVal);
      onChange(newVal);
      setKeyInput("");
      setValueInput("");
    }
  };

  const handleRemove = (k: string) => {
    const newVal = { ...value };
    delete newVal[k];
    onChange(newVal);
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          className="border rounded px-2 py-1 flex-1"
          placeholder={keyPlaceholder || "Key"}
          value={keyInput}
          onChange={(e) => setKeyInput(e.target.value)}
        />
        <input
          className="border rounded px-2 py-1 flex-1"
          placeholder={valuePlaceholder || "Value"}
          value={valueInput}
          onChange={(e) => setValueInput(e.target.value)}
        />
        <button
          type="button"
          className="px-3 py-1 rounded bg-black text-white font-semibold"
          onClick={handleAdd}
          disabled={!keyInput.trim() || !valueInput.trim() || Object.keys(value).length >= max}
        >
          Add
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {Object.entries(value).map(([k, v]) => (
          <span key={k} className="bg-gray-200 rounded px-2 py-0.5 text-sm flex items-center">
            <span className="font-medium mr-1">{k}:</span> {v}
            <button
              type="button"
              className="ml-1 text-gray-500 hover:text-red-500"
              onClick={() => handleRemove(k)}
              aria-label={`Remove ${k}`}
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );
} 