'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: 'How does BYOK (Bring Your Own Key) work?',
    answer:
      'During private beta, you can supply your personal Anthropic API key in your account Settings or during onboarding. Your API key is encrypted using AES-256-GCM before stored in our database and is used solely to generate content for your account.',
  },
  {
    question: 'How does ContentEngine learn my unique brand voice?',
    answer:
      'You can upload your existing brand documentation (PDF, DOCX, Markdown) or complete a brief questionnaire. Our brand profile parser extracts your niche, target audience, preferred tone, and content pillars to calibrate every generation to sound like you.',
  },
  {
    question: 'Can I export PDF carousels directly for LinkedIn and Instagram?',
    answer:
      'Yes! ContentEngine generates high-resolution 4:5 carousels for Instagram/LinkedIn and 9:16 vertical carousels for TikTok Photo Mode, ready to download instantly as PDFs or PNG image bundles.',
  },
  {
    question: 'What content input formats are supported?',
    answer:
      'You can input a YouTube video transcript, a LinkedIn post, a blog article, a document upload, or simply a raw topic or idea. ContentEngine processes all inputs into a complete multi-platform content pack.',
  },
  {
    question: 'How does Hook Scoring and Recommendation work?',
    answer:
      'For every platform output, ContentEngine generates 3 distinct structural variations with different angles and hooks. It evaluates each variation, scores the hook strength (High/Medium/Low), and recommends the best performing option with AI reasoning.',
  },
];

export default function LandingFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-3 max-w-3xl mx-auto text-left">
      {FAQS.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={faq.question}
            className="bg-white rounded-xl border border-[#ebebeb] overflow-hidden transition-all"
            style={{ boxShadow: 'rgba(0,0,0,0.04) 0px 1px 3px' }}
          >
            <button
              onClick={() => toggle(index)}
              className="w-full px-6 py-4 flex items-center justify-between gap-4 text-left font-semibold text-[#171717] hover:bg-[#fafafa] transition-colors text-sm sm:text-base"
            >
              <span>{faq.question}</span>
              <ChevronDown
                className={`w-5 h-5 text-[#808080] shrink-0 transition-transform duration-200 ${
                  isOpen ? 'rotate-180 text-[#171717]' : ''
                }`}
              />
            </button>
            {isOpen && (
              <div className="px-6 pb-5 pt-1 text-sm text-[#666666] leading-relaxed border-t border-[#f4f4f5]">
                {faq.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
