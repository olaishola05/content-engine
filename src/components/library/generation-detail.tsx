/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { updateOutputAction } from '@/lib/actions/history/update';
import { regenerateGenerationAction } from '@/lib/actions/history/regenerate';
import RegenerateOptions from './regenerate-options';

interface GenerationDetailProps {
  generation: any;
  outputs: any[];
  visuals?: any[];
  brand?: any;
}

export default function GenerationDetail({ 
  generation, 
  outputs: initialOutputs, 
  visuals = [], 
}: GenerationDetailProps) {
  const [outputs, setOutputs] = useState(initialOutputs);
  const [editing, setEditing] = useState<{ outputId: string; varIdx: number; value: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [showRegenerateOptions, setShowRegenerateOptions] = useState(false);

  if (!generation) return <div>No generation data.</div>;

  const startEdit = (outputId: string, varIdx: number, current: string) => {
    setEditing({ outputId, varIdx, value: current });
  };

  const cancelEdit = () => setEditing(null);

  const saveEdit = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      const res = await updateOutputAction(editing.outputId, editing.varIdx, editing.value);
      if (res.success) {
        // Update local state
        setOutputs(prev => prev.map(o => {
          if (o.id !== editing.outputId) return o;
          const newVars = [...(o.variations || [])];
          if (typeof newVars[editing.varIdx] === 'string') {
            newVars[editing.varIdx] = editing.value;
          } else {
            newVars[editing.varIdx] = { ...(newVars[editing.varIdx] || {}), content: editing.value };
          }
          return { ...o, variations: newVars };
        }));
        setEditing(null);
      } else {
        alert(res.error || 'Failed to save');
      }
    } catch {
      alert('Error saving edit');
    }
    setSaving(false);
  };

  const handleRegenerate = async (opts: { tone?: string }) => {
    setShowRegenerateOptions(false);
    try {
      const res = await regenerateGenerationAction(generation.id, opts);
      if (res.success) {
        alert(`Regenerated! New ID: ${res.newGenerationId}. (In real app, would navigate or refresh.)`);
      } else {
        alert(res.error || 'Regenerate failed');
      }
    } catch {
      alert('Error during regenerate');
    }
  };

  return (
    <div data-testid="generation-detail" className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Input (ID: {generation.id})</h2>
        <p className="text-sm text-gray-600">{new Date(generation.createdAt).toLocaleString()}</p>
        <p className="mt-2 p-3 bg-gray-50 rounded">{generation.inputText}</p>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Outputs ({outputs.length})</h2>
        {outputs.map((output, idx) => (
          <div key={idx} className="mb-4 border p-4 rounded">
            <div className="font-medium mb-1 flex items-center gap-2">
              {output.platform}
              {output.recommendedIndex !== undefined && (
                <span className="text-xs bg-green-100 px-1">Recommended: {output.recommendedIndex + 1}</span>
              )}
            </div>
            <div className="text-xs text-gray-500 mb-2">{output.recommendationReason}</div>
            
            <div className="space-y-2">
              {(output.variations || []).map((v: any, vIdx: number) => {
                const content = typeof v === 'string' ? v : (v.content || JSON.stringify(v));
                const isEditingThis = editing?.outputId === output.id && editing?.varIdx === vIdx;
                return (
                  <div key={vIdx} className="p-2 bg-white border rounded">
                    <div className="text-xs text-gray-500">Variation {vIdx + 1}</div>
                    {isEditingThis ? (
                      <>
                        <textarea
                          className="w-full border p-1 text-sm"
                          value={editing.value}
                          onChange={(e) => setEditing({ ...editing, value: e.target.value })}
                          rows={3}
                        />
                        <div className="mt-1 flex gap-2">
                          <button onClick={saveEdit} disabled={saving} className="text-xs px-2 py-0.5 bg-green-600 text-white rounded">
                            {saving ? 'Saving...' : 'Save'}
                          </button>
                          <button onClick={cancelEdit} className="text-xs px-2 py-0.5 border rounded">Cancel</button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="whitespace-pre-wrap">{content}</div>
                        <button 
                          onClick={() => startEdit(output.id, vIdx, content)}
                          className="text-xs text-blue-600 mt-1"
                        >
                          Re-edit
                        </button>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {visuals.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Visual Assets</h2>
          <div className="grid grid-cols-2 gap-4">
            {visuals.map((v, i) => (
              <div key={i} className="border p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={v.url} alt={v.type} className="max-w-full" />
                <div className="text-xs mt-1">{v.type} {v.dimensions && `(${v.dimensions.width}x${v.dimensions.height})`}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <button 
        onClick={() => setShowRegenerateOptions(true)}
        className="px-4 py-2 bg-purple-600 text-white rounded"
      >
        Regenerate
      </button>

      {showRegenerateOptions && (
        <RegenerateOptions
          currentTone={generation.tone || 'educational'}
          onRegenerate={handleRegenerate}
          onClose={() => setShowRegenerateOptions(false)}
        />
      )}
    </div>
  );
}

