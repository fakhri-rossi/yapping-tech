import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t-2 border-black py-10 font-bold text-slate-700 text-xs md:text-sm">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <p className="font-extrabold text-black text-base">plivin.co — Digital Gift Solution</p>
          <p className="text-slate-500 text-xs font-medium">&copy; 2026 plivin.co. All rights reserved. Bikin kado digital seru selamanya!</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-5">
          <a
            href="https://www.instagram.com/plivin.co/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-rose-600 hover:text-rose-800 transition-colors flex items-center gap-1.5 font-bold"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
            @plivin.co
          </a>
        </div>
      </div>
    </footer>
  );
}
