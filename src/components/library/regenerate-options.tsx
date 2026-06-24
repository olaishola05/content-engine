'use client';

import React, { useState } from 'react';

interface RegenerateOptionsProps {
  currentTone?: string;
  onRegenerate: (options: { tone?: string; other?: string }) => void;
  onClose: () => void;
  brand?: { primaryColor?: string };
}

export default function RegenerateOptions({ 
  currentTone = 'educational', 
  onRegenerate, 
  onClose,
}: RegenerateOptionsProps) {
  const [selectedTone, setSelectedTone] = useState(currentTone);

  const tones = ['educational', 'storytelling', 'promotional', 'vulnerable', 'direct'];

  const handleRegenerate = () => {
    onRegenerate({ tone: selectedTone });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" data-testid="regenerate-options">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h3 className="text-lg font-semibold mb-4">Regenerate Options</h3>
        
        <div className="mb-4">
          <label className="block text-sm mb-1">Tone</label>
          <select 
            value={selectedTone} 
            onChange={(e) => setSelectedTone(e.target.value)}
            className="w-full border p-2 rounded"
          >
            {tones.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-2 justify-end">
          <button onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
          <button 
            onClick={handleRegenerate}
            className="px-4 py-2 bg-purple-600 text-white rounded"
          >
            Regenerate
          </button>
        </div>
      </div>
    </div>
  );
}
