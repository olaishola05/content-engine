'use client';

import type { InputType } from '@/lib/actions/generate/client-validation';

export interface InputTypeConfig {
  value: InputType;
  label: string;
  description: string;
  icon: string; // emoji icon for lightweight rendering
}

/**
 * Ordered list of content input type configurations used to render
 * the selectable source cards on the /generate page.
 */
export const inputTypes: InputTypeConfig[] = [
  {
    value: 'LINKEDIN_POST',
    label: 'LinkedIn Post',
    description: 'Repurpose an existing LinkedIn post across platforms',
    icon: '💼',
  },
  {
    value: 'YOUTUBE_TRANSCRIPT',
    label: 'YouTube Transcript',
    description: 'Extract key ideas from a video transcript',
    icon: '🎬',
  },
  {
    value: 'BLOG_ARTICLE',
    label: 'Blog Article',
    description: 'Condense a long-form article into social content',
    icon: '📝',
  },
  {
    value: 'TOPIC_IDEA',
    label: 'Topic / Idea',
    description: 'Start from a raw idea or topic prompt',
    icon: '💡',
  },
  {
    value: 'DOCUMENT_UPLOAD',
    label: 'Document Upload',
    description: 'Upload a PDF or DOCX — coming in Phase 4',
    icon: '📄',
  },
];

/**
 * Returns whether a given input type is disabled in the current phase.
 * DOCUMENT_UPLOAD is gated until Phase 4.
 *
 * @param value The InputType value to check
 * @returns true if the input type should be non-selectable
 */
export function isInputTypeDisabled(value: InputType): boolean {
  return value === 'DOCUMENT_UPLOAD';
}

interface InputTypeSelectorProps {
  selected: InputType;
  onChange: (value: InputType) => void;
}

/**
 * Renders a grid of selectable content source cards.
 * Each card displays an icon, label, and short description.
 * DOCUMENT_UPLOAD is shown but non-interactive with a "Coming Soon" badge.
 */
export default function InputTypeSelector({ selected, onChange }: InputTypeSelectorProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {inputTypes.map((type) => {
        const disabled = isInputTypeDisabled(type.value);
        const isSelected = selected === type.value;

        return (
          <button
            key={type.value}
            id={`input-type-${type.value.toLowerCase().replace(/_/g, '-')}`}
            type="button"
            disabled={disabled}
            onClick={() => !disabled && onChange(type.value)}
            aria-pressed={isSelected}
            className={[
              'relative flex flex-col gap-2 p-4 rounded-xl text-left transition-all duration-200',
              'border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0068d6]',
              disabled
                ? 'opacity-40 cursor-not-allowed bg-[#fafafa] border-[#ebebeb]'
                : isSelected
                ? 'bg-[#171717] border-[#171717] text-white shadow-[0_2px_8px_rgba(0,0,0,0.12)]'
                : 'bg-white border-[#ebebeb] hover:border-[#171717]/20 hover:shadow-[0_1px_4px_rgba(0,0,0,0.06)]',
            ].join(' ')}
          >
            {disabled && (
              <span className="absolute top-2 right-2 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#fafafa] border border-[#ebebeb] text-[#888]">
                Soon
              </span>
            )}
            <span className="text-xl">{type.icon}</span>
            <span className={`text-xs font-semibold ${isSelected ? 'text-white' : 'text-[#171717]'}`}>
              {type.label}
            </span>
            <span className={`text-[10px] leading-relaxed ${isSelected ? 'text-white/70' : 'text-[#666]'}`}>
              {type.description}
            </span>
          </button>
        );
      })}
    </div>
  );
}
