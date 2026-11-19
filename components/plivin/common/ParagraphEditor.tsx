'use client';

import { useState, useEffect } from 'react';
import { getDefaultGreetingForTemplate } from '@config/gifts';

interface ParagraphEditorProps {
  greetingText: string;
  onChange: (newGreetingText: string) => void;
  templateTitle?: string;
  templateId?: string;
  hasSelectedTemplate?: boolean;
}

export default function ParagraphEditor({
  greetingText,
  onChange,
  templateTitle = 'Template',
  templateId,
  hasSelectedTemplate = false,
}: ParagraphEditorProps) {
  // Helper to parse greetingText string into clean paragraph array (ignoring all empty/blank lines)
  const parseParagraphs = (raw: string): string[] => {
    if (!raw || !raw.trim()) return [''];
    const parts = raw
      .split('\n')
      .map((p) => p.trim())
      .filter((p) => p.length > 0);
    return parts.length > 0 ? parts : [''];
  };

  const [paragraphs, setParagraphs] = useState<string[]>(() => parseParagraphs(greetingText));

  // Sync internal paragraph state whenever greetingText changes externally
  useEffect(() => {
    const cleanIncoming = parseParagraphs(greetingText);
    const cleanCurrent = paragraphs.filter((p) => p.trim().length > 0);
    
    const isDifferent =
      cleanIncoming.length !== cleanCurrent.length ||
      cleanIncoming.some((item, idx) => item !== cleanCurrent[idx]);

    if (isDifferent) {
      setParagraphs(cleanIncoming);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [greetingText]);

  const updateParagraph = (index: number, val: string) => {
    const next = [...paragraphs];
    next[index] = val;
    setParagraphs(next);
    const joined = next.filter((p) => p.trim().length > 0).join('\n\n');
    onChange(joined);
  };

  const addParagraph = () => {
    setParagraphs((prev) => [...prev, '']);
  };

  const removeParagraph = (index: number) => {
    const next = paragraphs.filter((_, i) => i !== index);
    const finalNext = next.length > 0 ? next : [''];
    setParagraphs(finalNext);
    onChange(finalNext.filter((p) => p.trim().length > 0).join('\n\n'));
  };

  const moveParagraphUp = (index: number) => {
    if (index === 0) return;
    const next = [...paragraphs];
    const temp = next[index - 1];
    next[index - 1] = next[index];
    next[index] = temp;
    setParagraphs(next);
    onChange(next.join('\n\n'));
  };

  const moveParagraphDown = (index: number) => {
    if (index === paragraphs.length - 1) return;
    const next = [...paragraphs];
    const temp = next[index + 1];
    next[index + 1] = next[index];
    next[index] = temp;
    setParagraphs(next);
    onChange(next.join('\n\n'));
  };

  const handleLoadDefault = () => {
    if (!hasSelectedTemplate && !templateId) return;
    const defaultText = getDefaultGreetingForTemplate(templateId || templateTitle);
    const parsed = parseParagraphs(defaultText);
    setParagraphs(parsed);
    onChange(parsed.join('\n\n'));
  };

  return (
    <div className="space-y-3 bg-slate-50 border-2 border-black rounded-2xl p-4 shadow-sm">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2 border-b border-slate-200">
        <div>
          <label className="block text-xs font-extrabold text-black">
            📝 Custom Kata Ucapan / Paragraf Cerita ({paragraphs.length} Paragraf) <span className="text-rose-600 font-bold">*</span>
          </label>
          <p className="text-[10px] text-slate-500 font-medium">
            {hasSelectedTemplate || templateId
              ? `Setiap kotak mewakili 1 paragraf ucapan untuk template ${templateTitle || ''}.`
              : 'Pilih template di atas terlebih dahulu untuk mengisi kata ucapan bawaan template.'}
          </p>
        </div>

        {/* Action Button: Reset / Load Default Text */}
        <button
          type="button"
          onClick={handleLoadDefault}
          disabled={!hasSelectedTemplate && !templateId}
          className="px-3 py-1.5 text-[11px] font-extrabold bg-pink-100 hover:bg-pink-200 text-pink-900 border border-black rounded-xl transition shadow-sm flex items-center gap-1.5 flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-pink-100 cursor-pointer active:scale-95"
          title="Reset kata ucapan ke teks bawaan asli template ini"
        >
          <span>✨</span>
          <span>Reset Teks Bawaan</span>
        </button>
      </div>

      {/* Paragraph Editor Inputs */}
      <div className="space-y-3">
        {paragraphs.map((para, idx) => (
          <div
            key={idx}
            className="bg-white border-2 border-black rounded-xl p-3.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] space-y-2 relative"
          >
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-black text-black flex items-center gap-1.5">
                <span className="w-5 h-5 bg-black text-white rounded-full text-[10px] flex items-center justify-center font-mono font-bold">
                  {idx + 1}
                </span>
                {idx === 0
                  ? 'Paragraf #1 — Sapaan / Pembuka'
                  : idx === paragraphs.length - 1 && paragraphs.length > 2
                  ? `Paragraf #${idx + 1} — Penutup / Kalimat Cinta`
                  : `Paragraf #${idx + 1} — Isi Pesan / Cerita`}
              </span>

              {/* Position Controls & Delete */}
              <div className="flex items-center gap-1">
                {paragraphs.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => moveParagraphUp(idx)}
                      disabled={idx === 0}
                      className="px-1.5 py-0.5 bg-white hover:bg-slate-100 border border-black text-[10px] font-extrabold rounded disabled:opacity-30 cursor-pointer"
                      title="Geser Ke Atas"
                    >
                      ⬆️
                    </button>
                    <button
                      type="button"
                      onClick={() => moveParagraphDown(idx)}
                      disabled={idx === paragraphs.length - 1}
                      className="px-1.5 py-0.5 bg-white hover:bg-slate-100 border border-black text-[10px] font-extrabold rounded disabled:opacity-30 cursor-pointer"
                      title="Geser Ke Bawah"
                    >
                      ⬇️
                    </button>
                  </>
                )}
                {paragraphs.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeParagraph(idx)}
                    className="px-2 py-0.5 bg-rose-100 hover:bg-rose-200 text-rose-800 border border-rose-400 text-[10px] font-bold rounded cursor-pointer ml-1"
                    title="Hapus Paragraf Ini"
                  >
                    ✕ Hapus
                  </button>
                )}
              </div>
            </div>

            <textarea
              rows={3}
              value={para}
              onChange={(e) => updateParagraph(idx, e.target.value)}
              placeholder={`Tulis isi paragraf #${idx + 1}...`}
              className="w-full px-3 py-2 bg-slate-50 border border-black rounded-lg text-black text-xs font-medium focus:ring-2 focus:ring-black focus:outline-none leading-relaxed"
            />
          </div>
        ))}
      </div>

      {/* Add Paragraph Button */}
      <div className="pt-1">
        <button
          type="button"
          onClick={addParagraph}
          className="w-full py-2.5 bg-white hover:bg-slate-100 text-black border-2 border-dashed border-black rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-[0.99]"
        >
          <span>➕</span>
          <span>Tambah Paragraf Baru</span>
        </button>
      </div>
    </div>
  );
}
