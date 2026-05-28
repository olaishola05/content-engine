'use client';

import type { Platform } from '@/lib/actions/generate/client-validation';

export interface PlatformConfig {
  value: Platform;
  label: string;
  icon: string;
}

/**
 * Ordered list of supported social platforms with display metadata.
 */
export const platforms: PlatformConfig[] = [
  { value: 'X', label: 'X (Twitter)', icon: '𝕏' },
  { value: 'INSTAGRAM', label: 'Instagram', icon: '📸' },
  { value: 'TIKTOK', label: 'TikTok', icon: '🎵' },
  { value: 'YOUTUBE', label: 'YouTube', icon: '▶️' },
  { value: 'LINKEDIN', label: 'LinkedIn', icon: '💼' },
];

/**
 * Toggles a platform in/out of the selected platforms array.
 * Enforces a minimum of 1 selected platform — will not remove the last one.
 *
 * @param current The currently selected platform values
 * @param value The platform being toggled
 * @returns The updated platforms array
 */
export function togglePlatform(current: Platform[], value: Platform): Platform[] {
  const isSelected = current.includes(value);

  // Guard: never drop below 1 platform
  if (isSelected && current.length === 1) {
    return current;
  }

  // Toggle: remove if selected, add if not
  return isSelected
    ? current.filter((p) => p !== value)
    : [...current, value];
}

interface PlatformSelectorProps {
  selected: Platform[];
  onChange: (platforms: Platform[]) => void;
}

/**
 * Renders a row of toggleable platform pill buttons.
 * At least one platform must remain selected at all times.
 */
export default function PlatformSelector({ selected, onChange }: PlatformSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {platforms.map((platform) => {
        const isSelected = selected.includes(platform.value);
        return (
          <button
            key={platform.value}
            id={`platform-${platform.value.toLowerCase()}`}
            type="button"
            onClick={() => onChange(togglePlatform(selected, platform.value))}
            aria-pressed={isSelected}
            className={[
              'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200',
              'border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0068d6]',
              isSelected
                ? 'bg-[#171717] border-[#171717] text-white'
                : 'bg-white border-[#ebebeb] text-[#4d4d4d] hover:border-[#171717]/30',
            ].join(' ')}
          >
            <span>{platform.icon}</span>
            <span>{platform.label}</span>
          </button>
        );
      })}
    </div>
  );
}
