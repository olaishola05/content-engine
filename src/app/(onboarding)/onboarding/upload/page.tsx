'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const ACCEPTED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/markdown',
  'text/plain',
];
const MAX_FILES = 7;
const MAX_SIZE_MB = 10;

type FileEntry = { file: File; id: string };
type Status = 'idle' | 'uploading' | 'extracting' | 'error';

export default function UploadPage() {
  const router = useRouter();
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((incoming: FileList | File[]) => {
    const toAdd = Array.from(incoming).filter((f) => {
      if (!ACCEPTED_TYPES.includes(f.type)) return false;
      if (f.size > MAX_SIZE_MB * 1024 * 1024) return false;
      return true;
    });
    setFiles((prev) => {
      const merged = [...prev, ...toAdd.map((f) => ({ file: f, id: crypto.randomUUID() }))];
      return merged.slice(0, MAX_FILES);
    });
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    addFiles(e.dataTransfer.files);
  }, [addFiles]);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(e.target.files);
  };

  const removeFile = (id: string) => setFiles((prev) => prev.filter((f) => f.id !== id));

  const handleSubmit = async () => {
    if (files.length === 0) return;
    setStatus('uploading');
    setError(null);

    try {
      const formData = new FormData();
      files.forEach(({ file }) => formData.append('files', file));

      const res = await fetch('/api/brand/upload', { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Upload failed');

      setStatus('extracting');
      const { extractionId } = await res.json() as { extractionId: string };

      // Navigate to review page with the extraction ID
      router.push(`/onboarding/review?extractionId=${extractionId}&path=A`);
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Something went wrong');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/60 font-medium mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
          Path A — Document Upload
        </div>
        <h1 className="text-2xl font-semibold text-white tracking-tight">Upload your brand documents</h1>
        <p className="text-white/50 text-sm">PDF, DOCX, or Markdown · Max 10 MB each · Up to 7 files</p>
      </div>

      {/* Drop zone */}
      <div
        id="drop-zone"
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="relative flex flex-col items-center justify-center gap-3 p-10 rounded-2xl border-2 border-dashed border-white/15 hover:border-indigo-500/50 hover:bg-white/[0.03] transition-all duration-200 cursor-pointer group"
      >
        <input ref={inputRef} type="file" multiple accept=".pdf,.docx,.md,.txt" className="hidden" onChange={onInputChange} />
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
          📎
        </div>
        <div className="text-center">
          <p className="text-white/80 font-medium text-sm">Drop files here or click to browse</p>
          <p className="text-white/30 text-xs mt-1">{files.length}/{MAX_FILES} files added</p>
        </div>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <ul className="space-y-2">
          {files.map(({ file, id }) => (
            <li key={id} className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10">
              <span className="text-base">📄</span>
              <span className="text-white/80 text-sm flex-1 truncate">{file.name}</span>
              <span className="text-white/30 text-xs">{(file.size / 1024).toFixed(0)} KB</span>
              <button id={`remove-${id}`} onClick={() => removeFile(id)} className="text-white/30 hover:text-white/70 transition-colors text-sm ml-1">✕</button>
            </li>
          ))}
        </ul>
      )}

      {error && <p className="text-red-400 text-sm text-center">{error}</p>}

      <div className="flex items-center gap-3 pt-2">
        <button
          id="back-btn"
          onClick={() => router.push('/onboarding')}
          className="px-4 py-2 rounded-xl text-sm text-white/50 hover:text-white/80 transition-colors"
        >
          ← Back
        </button>
        <button
          id="upload-submit-btn"
          onClick={handleSubmit}
          disabled={files.length === 0 || status === 'uploading' || status === 'extracting'}
          className="flex-1 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
        >
          {status === 'uploading' ? 'Uploading…' : status === 'extracting' ? 'Extracting brand data…' : 'Extract Brand Profile →'}
        </button>
      </div>
    </div>
  );
}
