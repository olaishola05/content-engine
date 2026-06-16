import React from 'react';

interface HistoryCardProps {
  generation: {
    id: string;
    createdAt: Date;
    inputText: string;
    inputType: string;
    platforms: string[];
    outputs?: Array<{ platform: string }>;
  };
  brand?: {
    brandName?: string;
    primaryColor?: string;
  };
}

export default function HistoryCard({ generation, brand }: HistoryCardProps) {
  const date = new Date(generation.createdAt).toLocaleDateString();
  const preview = generation.inputText.length > 80 
    ? generation.inputText.substring(0, 80) + '...' 
    : generation.inputText;

  const inputIcon = {
    LINKEDIN_POST: '🔗',
    YOUTUBE_TRANSCRIPT: '📺',
    BLOG_ARTICLE: '📝',
    TOPIC_IDEA: '💡',
    DOCUMENT_UPLOAD: '📄',
  }[generation.inputType] || '📄';

  return (
    <div 
      data-testid="history-card" 
      className="p-4 border rounded-lg mb-2 hover:bg-gray-50"
      style={{ borderColor: brand?.primaryColor || '#e5e7eb' }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-500">{date}</span>
        <span className="text-lg" title={generation.inputType}>
          {inputIcon}
        </span>
      </div>
      <p className="text-sm mb-2 line-clamp-2">{preview}</p>
      <div className="flex gap-1 flex-wrap">
        {generation.platforms?.map((p, i) => (
          <span 
            key={i} 
            className="text-xs px-2 py-0.5 bg-gray-100 rounded"
            data-testid="platform-badge"
          >
            {p}
          </span>
        ))}
        {generation.outputs?.map((o, i) => (
          <span 
            key={i} 
            className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded"
          >
            {o.platform}
          </span>
        ))}
      </div>
      <div className="text-xs text-gray-400 mt-1">{generation.id}</div>
    </div>
  );
}
