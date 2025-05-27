"use client";

import { useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { TagsInput } from "./TagsInput";
import { KeyValuePairsInput } from "./KeyValuePairsInput";
import { OPTIONAL_SECTIONS, OptionalSectionKey } from "./optionalSectionsConfig";

export function OptionalSections() {
  const { control } = useFormContext();
  const [expanded, setExpanded] = useState<OptionalSectionKey[]>([]);

  const toggleSection = (key: OptionalSectionKey) => {
    setExpanded(prev => 
      prev.includes(key) 
        ? prev.filter(k => k !== key)
        : [...prev, key]
    );
  };

  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Optional Sections</h2>
      <div className="space-y-4">
        {OPTIONAL_SECTIONS.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.key} className="border rounded-lg bg-white shadow-sm overflow-hidden">
              <button
                type="button"
                className="flex items-center w-full px-4 py-3 focus:outline-none hover:bg-gray-50 transition"
                onClick={() => toggleSection(section.key)}
              >
                <span className={`mr-3 ${section.iconColor}`}>
                  <Icon className="h-5 w-5" />
                </span>
                <span className="flex-1 text-left">
                  <span className="font-medium">{section.label}</span>
                  <span className="block text-gray-500 text-sm">{section.description}</span>
                </span>
                <span className="ml-2 text-gray-400">
                  {expanded.includes(section.key) ? "−" : "+"}
                </span>
              </button>

              {expanded.includes(section.key) && (
                <div className="px-6 py-4 space-y-4 border-t bg-gray-50">
                  {section.fields.map((field) => (
                    <div key={field.name}>
                      <label className="block font-medium mb-1">{field.label}</label>
                      <Controller
                        control={control}
                        name={`sections.${section.key}.${field.name}`}
                        defaultValue={field.type === "tags" ? [] : field.type === "key-value" ? {} : ""}
                        render={({ field: { value, onChange } }) => {
                          if (field.type === "tags") {
                            return (
                              <TagsInput
                                value={value || []}
                                onChange={onChange}
                                placeholder={field.placeholder}
                                max={field.max}
                              />
                            );
                          }
                          if (field.type === "key-value") {
                            return (
                              <KeyValuePairsInput
                                value={value || {}}
                                onChange={onChange}
                                keyPlaceholder="Key"
                                valuePlaceholder="Value"
                                max={field.max}
                              />
                            );
                          }
                          return (
                            <input
                              type="text"
                              className="w-full border rounded px-3 py-2"
                              value={value || ""}
                              onChange={(e) => onChange(e.target.value)}
                              placeholder={field.placeholder}
                            />
                          );
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
} 