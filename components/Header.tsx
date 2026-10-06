'use client';

import React from 'react';
import { Scroll, Newspaper, Radio, HelpCircle, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  aktifBolum: 1 | 2 | 3;
  setAktifBolum: (bolum: 1 | 2 | 3) => void;
  belgeSayisi: number;
  soruSayisi: number;
  yayinHazir: boolean;
}

export default function Header({
  aktifBolum,
  setAktifBolum,
  belgeSayisi,
  soruSayisi,
  yayinHazir,
}: HeaderProps) {
  return (
    <header className="bg-stone-900 border-b border-stone-800 text-stone-100 sticky top-0 z-40 backdrop-blur-md bg-stone-900/95">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Logo & Başlık */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-700 to-amber-500 text-white flex items-center justify-center shadow-md font-serif font-black text-xl">
            TM
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif font-bold text-lg text-white tracking-tight">
                Tarih Muhabiri
              </h1>
              <span className="text-[10px] uppercase font-mono font-bold bg-amber-900/80 text-amber-300 border border-amber-700/50 px-2 py-0.5 rounded">
                1919 Arşivi
              </span>
            </div>
            <p className="text-xs text-stone-400">
              Birincil Kaynaklarla Röportaj, 1919 Gazetesi ve 2 Sesli Podcast
            </p>
          </div>
        </div>

        {/* 3 Bölümlü Navigasyon */}
        <nav className="flex items-center gap-1.5 bg-stone-950/70 p-1.5 rounded-xl border border-stone-800 text-xs">
          <button
            type="button"
            onClick={() => setAktifBolum(1)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition ${
              aktifBolum === 1
                ? 'bg-amber-800 text-white shadow-sm'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-850'
            }`}
          >
            <Scroll className="w-3.5 h-3.5" />
            <span>1. Belgeler</span>
            <span className="text-[10px] font-mono bg-stone-900 px-1.5 py-0.2 rounded text-stone-300">
              {belgeSayisi}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setAktifBolum(2)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition ${
              aktifBolum === 2
                ? 'bg-amber-800 text-white shadow-sm'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-850'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>2. Röportaj</span>
            {soruSayisi > 0 && (
              <span className="text-[10px] font-mono bg-stone-900 px-1.5 py-0.2 rounded text-amber-300">
                {soruSayisi}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setAktifBolum(3)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition ${
              aktifBolum === 3
                ? 'bg-amber-800 text-white shadow-sm'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-850'
            }`}
          >
            <Newspaper className="w-3.5 h-3.5" />
            <span>3. Yayın</span>
            {yayinHazir && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}
