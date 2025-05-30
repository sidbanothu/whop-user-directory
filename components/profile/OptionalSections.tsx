"use client";

import { useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { TagsInput } from "./TagsInput";
import { KeyValuePairsInput } from "./KeyValuePairsInput";
import { OPTIONAL_SECTIONS, OptionalSectionKey } from "./optionalSectionsConfig";

export function OptionalSections({ enabledSections }: { enabledSections: string[] }) {
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
      <div className="space-y-6">
        {OPTIONAL_SECTIONS
          .filter(section => enabledSections.includes(section.key))
          .map((section) => {
            const Icon = section.icon;
            return (
              <div key={section.key} className="rounded-2xl bg-[#f4f7fd] border border-[#e3e8f0] shadow-sm overflow-hidden">
                <button
                  type="button"
                  className="flex items-center w-full px-6 py-5 focus:outline-none hover:bg-[#f0f4fa] transition"
                  onClick={() => toggleSection(section.key)}
                >
                  <span className={`mr-4 text-3xl bg-white rounded-full p-2 shadow-sm ${section.iconColor}`}>
                    <Icon className="h-7 w-7" />
                  </span>
                  <span className="flex-1 text-left">
                    <span className="font-bold text-lg">{section.label}</span>
                    <span className="block text-gray-500 text-sm">{section.description}</span>
                  </span>
                  <span className="ml-2 text-gray-400 text-2xl">
                    {expanded.includes(section.key) ? "−" : "+"}
                  </span>
                </button>

                {expanded.includes(section.key) && (
                  <div className="px-8 py-6 space-y-6 border-t bg-white">
                    {section.fields.map((fieldConfig) => (
                      <div key={fieldConfig.name} className="mb-4">
                        <label className="block font-semibold mb-1 text-gray-700">{fieldConfig.label}</label>
                        <div className="mb-1">
                        <Controller
                          control={control}
                          name={`sections.${section.key}.${fieldConfig.name}`}
                          render={({ field }) => {
                            if (fieldConfig.type === "tags") {
                              return (
                                <>
                                  <TagsInput
                                    value={Array.isArray(field.value) ? field.value : []}
                                    onChange={field.onChange}
                                    placeholder={fieldConfig.placeholder}
                                    max={fieldConfig.max}
                                  />
                                  <p className="text-xs text-gray-400 mt-1">Type a value and press Enter to add it as a tag</p>
                                </>
                              );
                            }
                            if (fieldConfig.type === "key-value") {
                              return (
                                <>
                                  <KeyValuePairsInput
                                    value={typeof field.value === 'object' && !Array.isArray(field.value) && field.value ? field.value : {}}
                                    onChange={(val) => {
                                      console.log('KeyValuePairsInput onChange for', fieldConfig.name, 'val:', val);
                                      field.onChange(val);
                                    }}
                                    keyPlaceholder="Platform (e.g. Steam)"
                                    valuePlaceholder="Username or URL"
                                    max={fieldConfig.max}
                                  />
                                  <p className="text-xs text-gray-400 mt-1">Enter both fields and click <span className='font-semibold'>Add</span> to save each entry</p>
                                </>
                              );
                            }
                            return (
                              <input
                                type="text"
                                className="w-full border rounded-lg px-4 py-2"
                                value={typeof field.value === 'string' ? field.value : ''}
                                onChange={(e) => field.onChange(e.target.value)}
                                placeholder={fieldConfig.placeholder}
                              />
                            );
                          }}
                        />
                        </div>
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