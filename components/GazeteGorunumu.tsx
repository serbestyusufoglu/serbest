'use client';

import React, { useState } from 'react';
import { GazeteVerisi } from '@/types';
import { 
  Printer, 
  Copy, 
  Check, 
  Share2, 
  BookOpen, 
  HelpCircle, 
  FileText,
  Quote,
  Stamp
} from 'lucide-react';

interface GazeteGorunumuProps {
  gazete: GazeteVerisi;
  onYenidenUret?: () => void;
}

export default function GazeteGorunumu({ gazete, onYenidenUret }: GazeteGorunumuProps) {
  const [kopyalandi, setKopyalandi] = useState(false);
  const [cevaplar, setCevaplar] = useState<Record<number, string>>({});

  const metniKopyala = () => {
    const tumMetin = `=== ${gazete.gazeteAdi || 'İRÂDE-İ MİLLİYE'} ===
Tarih: ${gazete.tarihMetni || '1919'} | ${gazete.sayi || 'Sayı: 1'} | ${gazete.sehir || 'Sivas'}

MANŞET: ${gazete.manset}

SPOT: ${gazete.spot}

HABER METNİ:
${gazete.haberMetni}

BİREBİR ALINTILAR:
${gazete.alintilar?.map((a) => `• "${a.metin}" - [${a.belge}]`).join('\n')}

KONTROL SORULARI:
${gazete.kontrolSorulari?.map((s, idx) => `${idx + 1}. ${s}`).join('\n')}
`;

    navigator.clipboard.writeText(tumMetin);
    setKopyalandi(true);
    setTimeout(() => setKopyalandi(false), 2500);
  };

  const yazdir = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Üst İşlem Çubuğu (Yazdırma sırasında gizlenir) */}
      <div className="print:hidden flex flex-wrap items-center justify-between gap-3 bg-stone-100 p-3.5 rounded-xl border border-stone-200">
        <div className="flex items-center gap-2 text-stone-700 text-xs font-semibold">
          <Stamp className="w-4 h-4 text-amber-800" />
          <span>1919 Dönemi Tarihî Gazete Nüshası</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={yazdir}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-900 text-white text-xs font-medium rounded-lg shadow-sm transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Yazdır / PDF Kaydet</span>
          </button>

          <button
            type="button"
            onClick={metniKopyala}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-stone-50 text-stone-700 border border-stone-300 text-xs font-medium rounded-lg transition"
          >
            {kopyalandi ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{kopyalandi ? 'Kopyalandı' : 'Metni Kopyala'}</span>
          </button>

          {onYenidenUret && (
            <button
              type="button"
              onClick={onYenidenUret}
              className="text-xs text-amber-900 hover:underline px-2 py-1 font-medium"
            >
              Yeniden Düzenle
            </button>
          )}
        </div>
      </div>

      {/* 1919 DÖNEMİ GAZETE TASARIMI */}
      <div className="bg-[#fbf7ed] text-stone-900 border-4 border-stone-900 p-6 sm:p-10 rounded-lg shadow-xl font-serif relative overflow-hidden print:border-2 print:shadow-none print:p-4">
        {/* Saman kağıt dokusu efekti */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-900/[0.03] to-stone-900/[0.04] pointer-events-none" />

        {/* GAZETE BAŞLIK / KÜNYE BÖLÜMÜ */}
        <header className="border-b-4 border-stone-900 pb-5 mb-6 text-center relative">
          {/* Üst İnce Şerit Bilgileri */}
          <div className="flex items-center justify-between text-[11px] sm:text-xs uppercase tracking-widest text-stone-700 border-b border-stone-800/80 pb-2 mb-4 font-mono font-bold">
            <span>Sene: 1919 (1335)</span>
            <span className="hidden sm:inline">Milletin Hâkimiyet ve İrâdesini Müdafaa Eder</span>
            <span>{gazete.sehir || 'Sivas'} Vilayeti</span>
          </div>

          {/* Gazete Ana İsmi (Masthead) */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-stone-950 uppercase font-serif py-1 scale-y-105">
            {gazete.gazeteAdi || 'İRÂDE-İ MİLLİYE'}
          </h1>
          
          <div className="flex items-center justify-center gap-3 my-2 text-xs uppercase tracking-wider text-stone-600">
            <span className="h-px w-12 sm:w-24 bg-stone-800" />
            <span className="italic font-normal">Hâdisât-ı Yevmiyye ve Siyâsiyye Gazetesi</span>
            <span className="h-px w-12 sm:w-24 bg-stone-800" />
          </div>

          {/* Tarih ve Sayı Şeridi */}
          <div className="grid grid-cols-3 text-xs sm:text-sm font-semibold border-t-2 border-b-2 border-stone-900 py-1.5 mt-2 bg-stone-900/[0.04]">
            <div className="text-left font-mono">{gazete.sayi || 'Sayı: 14'}</div>
            <div className="text-center font-bold tracking-wide">{gazete.tarihMetni || 'Eylül 1919 / Zilhicce 1337'}</div>
            <div className="text-right font-mono">Fiyatı: 5 Kuruş</div>
          </div>
        </header>

        {/* MANŞET VE SPOT */}
        <section className="mb-8 border-b-2 border-stone-900/60 pb-6">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-stone-950 leading-tight tracking-tight uppercase mb-4 text-center sm:text-left">
            {gazete.manset}
          </h2>

          <div className="bg-amber-100/60 border-l-4 border-stone-900 p-4 rounded-r-md">
            <p className="text-sm sm:text-base font-medium italic text-stone-800 leading-relaxed">
              &ldquo;{gazete.spot}&rdquo;
            </p>
          </div>
        </section>

        {/* HABER METNİ VE ALINTILAR (2 Sütunlu Gazete Dizgisi) */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
          {/* Ana Haber Metni (Geniş Sütun) */}
          <div className="md:col-span-8 space-y-4 text-justify text-sm sm:text-base leading-relaxed text-stone-900">
            <div className="text-xs uppercase tracking-wider font-bold text-stone-600 mb-2 flex items-center gap-1.5 border-b border-stone-300 pb-1">
              <FileText className="w-3.5 h-3.5 text-stone-700" />
              <span>Olay Yerinden Muhabir Telgrafı</span>
            </div>

            {/* Paragraflar */}
            {gazete.haberMetni.split('\n\n').map((paragraf, pIdx) => {
              if (!paragraf.trim()) return null;
              return (
                <p key={pIdx} className="indent-6 first-of-type:indent-0 first-of-type:first-letter:text-4xl first-of-type:first-letter:font-bold first-of-type:first-letter:float-left first-of-type:first-letter:mr-2 first-of-type:first-letter:leading-none">
                  {paragraf}
                </p>
              );
            })}
          </div>

          {/* Yan Sütun: Birebir Belge Alıntıları */}
          <div className="md:col-span-4 bg-stone-900/[0.04] border-2 border-dashed border-stone-800/60 p-4 rounded-lg space-y-4">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-900 border-b border-stone-400 pb-2">
              <Quote className="w-4 h-4 text-amber-900" />
              <span>Belgelerden Birebir Beyanlar</span>
            </div>

            <p className="text-[11px] text-stone-600 italic">
              Aşağıdaki cümleler arşiv belgelerinden harfiyen aktarılmıştır:
            </p>

            <div className="space-y-3">
              {gazete.alintilar?.map((alinti, aIdx) => (
                <div key={aIdx} className="bg-white/80 p-3 rounded border border-stone-300 shadow-2xs space-y-1.5">
                  <p className="text-xs italic font-serif text-stone-900 leading-snug">
                    &ldquo;{alinti.metin}&rdquo;
                  </p>
                  <div className="text-right">
                    <span className="inline-block text-[10px] font-mono font-bold bg-stone-900 text-stone-100 px-1.5 py-0.5 rounded">
                      [{alinti.belge}]
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PEDAGOJİK BÖLÜM: 3 KONTROL SORUSU */}
        <footer className="border-t-4 border-stone-900 pt-6 mt-8">
          <div className="flex items-center gap-2 mb-4 text-stone-950 font-bold uppercase tracking-wide text-sm">
            <HelpCircle className="w-5 h-5 text-amber-900" />
            <span>Tarihî Muhakeme ve Kontrol Soruları (Öğrenci Çalışma Köşesi)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {gazete.kontrolSorulari?.map((soru, sIdx) => (
              <div
                key={sIdx}
                className="bg-white/90 border border-stone-400 p-4 rounded-lg shadow-2xs space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 font-mono font-bold text-xs text-amber-950 mb-1">
                    <span className="w-5 h-5 rounded-full bg-amber-900 text-amber-50 flex items-center justify-center text-[11px]">
                      {sIdx + 1}
                    </span>
                    <span>Soru {sIdx + 1}</span>
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-stone-900 leading-snug">
                    {soru}
                  </p>
                </div>

                {/* İnteraktif Öğrenci Cevap Alanı (Yazdırma için çizgili kutu) */}
                <div className="pt-2">
                  <textarea
                    rows={2}
                    value={cevaplar[sIdx] || ''}
                    onChange={(e) => setCevaplar({ ...cevaplar, [sIdx]: e.target.value })}
                    placeholder="Öğrencinin cevabı / notu..."
                    className="w-full text-xs font-sans bg-stone-50 border border-stone-300 rounded p-2 focus:bg-white focus:outline-none focus:border-stone-800 print:border-b-2 print:border-stone-400 print:bg-transparent print:resize-none"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="text-center text-[11px] text-stone-500 font-mono mt-6 pt-3 border-t border-stone-300">
            Tarih Muhabiri Matbaası • Birincil Kaynaklarla Tarih Eğitimi • T.C. Millî Mücadele Arşivi
          </div>
        </footer>
      </div>
    </div>
  );
}
