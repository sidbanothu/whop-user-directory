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
                  {section.fields.map((fieldConfig) => (
                    <div key={fieldConfig.name}>
                      <label className="block font-medium mb-1">{fieldConfig.label}</label>
                      <Controller
                        control={control}
                        name={`sections.${section.key}.${fieldConfig.name}`}
                        defaultValue={fieldConfig.type === "tags" ? [] : fieldConfig.type === "key-value" ? {} : ""}
                        render={({ field }) => {
                          if (fieldConfig.type === "tags") {
                            console.log('Rendering TagsInput for', section.key, fieldConfig.name, field.value);
                            return (
                              <TagsInput
                                value={field.value || []}
                                onChange={field.onChange}
                                placeholder={fieldConfig.placeholder}
                                max={fieldConfig.max}
                              />
                            );
                          }
                          if (fieldConfig.type === "key-value") {
                            return (
                              <KeyValuePairsInput
                                value={field.value || {}}
                                onChange={field.onChange}
                                keyPlaceholder="Key"
                                valuePlaceholder="Value"
                                max={fieldConfig.max}
                              />
                            );
                          }
                          return (
                            <input
                              type="text"
                              className="w-full border rounded px-3 py-2"
                              value={field.value || ""}
                              onChange={(e) => field.onChange(e.target.value)}
                              placeholder={fieldConfig.placeholder}
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