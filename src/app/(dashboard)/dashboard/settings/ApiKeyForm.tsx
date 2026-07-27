'use client';

import { useState } from 'react';
import { saveUserApiKeyAction } from '@/lib/actions/brand/save-api-key';

interface ApiKeyFormProps {
  hasExistingKey: boolean;
}

export function ApiKeyForm({ hasExistingKey }: ApiKeyFormProps) {
  const [key, setKey] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim()) return;

    setStatus('saving');
    setErrorMsg('');

    const result = await saveUserApiKeyAction(key.trim());
    if (result.success) {
      setStatus('success');
      setKey('');
    } else {
      setStatus('error');
      setErrorMsg(result.error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-[#171717]">Anthropic API Key</h3>
        <p className="text-xs text-[#666666]">
          {hasExistingKey
            ? 'You already have a saved API key. Enter a new one below to rotate it.'
            : 'Enter your Anthropic API key to enable content generation.'}
        </p>
      </div>

      {hasExistingKey && (
        <div className="flex items-center gap-2 px-3 py-2 bg-[#f0fdf4] border border-[#bbf7d0] rounded-lg text-xs text-[#166534] font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] inline-block" />
          API key saved and active
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          id="api-key-input"
          type="password"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="sk-ant-..."
          autoComplete="off"
          className="w-full h-10 px-3 text-sm bg-white rounded-lg border border-[#ebebeb] focus:outline-none focus:border-[#171717] focus:shadow-[0_0_0_3px_rgba(23,23,23,0.06)] transition-all placeholder:text-[#a1a1a1] font-mono"
        />

        {status === 'error' && (
          <p className="text-xs text-[#dc2626]">{errorMsg}</p>
        )}
        {status === 'success' && (
          <p className="text-xs text-[#16a34a] font-medium">API key saved successfully.</p>
        )}

        <button
          id="save-api-key-btn"
          type="submit"
          disabled={status === 'saving' || !key.trim()}
          className="h-9 px-4 bg-[#171717] hover:bg-[#171717]/90 disabled:bg-[#e4e4e7] disabled:text-[#a1a1aa] text-white text-sm font-semibold rounded-lg transition-colors"
        >
          {status === 'saving' ? 'Saving…' : hasExistingKey ? 'Rotate Key' : 'Save Key'}
        </button>
      </form>
    </div>
  );
}
