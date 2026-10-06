'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import BelgelerBolumu from '@/components/BelgelerBolumu';
import RoportajBolumu from '@/components/RoportajBolumu';
import YayinBolumu from '@/components/YayinBolumu';
import { TarihBelgesi, SoruCevap, GazeteVerisi, PodcastVerisi } from '@/types';
import { ORNEK_BELGE_SETLERI } from '@/lib/ornek-belgeler';
import { 
  Scroll, 
  HelpCircle, 
  Newspaper, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight,
  BookOpen,
  Radio,
  FileCheck2
} from 'lucide-react';

export default function Home() {
  const [aktifBolum, setAktifBolum] = useState<1 | 2 | 3>(1);
  const [belgeler, setBelgeler] = useState<TarihBelgesi[]>(
    ORNEK_BELGE_SETLERI[0].belgeler
  );
  const [soruCevaplar, setSoruCevaplar] = useState<SoruCevap[]>([]);
  const [gazeteVerisi, setGazeteVerisi] = useState<GazeteVerisi | null>(null);
  const [podcastVerisi, setPodcastVerisi] = useState<PodcastVerisi | null>(null);

  const yayinHazir = Boolean(gazeteVerisi || podcastVerisi);

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 flex flex-col font-sans selection:bg-amber-200 selection:text-amber-950">
      <Header
        aktifBolum={aktifBolum}
        setAktifBolum={setAktifBolum}
        belgeSayisi={belgeler.length}
        soruSayisi={soruCevaplar.length}
        yayinHazir={yayinHazir}
      />

      {/* HERO SECTION */}
      <section className="bg-gradient-to-b from-stone-900 via-stone-900 to-stone-850 text-stone-100 py-10 sm:py-14 border-b border-stone-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 bg-amber-950/80 text-amber-300 border border-amber-800/80 text-xs px-3 py-1 rounded-full font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tarih Dersi Birincil Kaynak Atölyesi</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-serif leading-tight">
              Tarih Muhabiri: Belgelerden Canlı Yayına
            </h1>

            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
              Tarih öğretmenleri ve 7-12. sınıf öğrencileri için tasarlanmış birincil kaynak platformu.
              Özgün arşiv metinlerini yükleyin, muhabirle röportaj yapın, 1919 dönemi gazete sayfası basın ve 2 sesli tarih podcast&apos;i dinleyin.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setAktifBolum(1)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-700 hover:bg-amber-600 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md transition"
              >
                <span>Belgeleri İncele ve Düzenle</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setAktifBolum(2)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 text-xs sm:text-sm font-semibold rounded-xl transition"
              >
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <span>Öğrenci Röportajına Başla</span>
              </button>
            </div>
          </div>

          {/* 3 Adım Rozetleri */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-8 pt-8 border-t border-stone-800/80">
            <div
              onClick={() => setAktifBolum(1)}
              className={`cursor-pointer p-4 rounded-xl border transition ${
                aktifBolum === 1
                  ? 'bg-amber-950/70 border-amber-700 text-amber-200 shadow-sm'
                  : 'bg-stone-900/60 border-stone-800 text-stone-300 hover:bg-stone-900'
              }`}
            >
              <div className="flex items-center gap-2 font-semibold text-sm">
                <Scroll className="w-4 h-4 text-amber-400" />
                <span>1. Belgeler</span>
              </div>
              <p className="text-xs text-stone-400 mt-1">
                Öğretmen 2-3 tarihî belge metnini girer (&ldquo;Belge 1:&rdquo;, &ldquo;Belge 2:&rdquo;).
              </p>
            </div>

            <div
              onClick={() => setAktifBolum(2)}
              className={`cursor-pointer p-4 rounded-xl border transition ${
                aktifBolum === 2
                  ? 'bg-amber-950/70 border-amber-700 text-amber-200 shadow-sm'
                  : 'bg-stone-900/60 border-stone-800 text-stone-300 hover:bg-stone-900'
              }`}
            >
              <div className="flex items-center gap-2 font-semibold text-sm">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <span>2. Röportaj</span>
              </div>
              <p className="text-xs text-stone-400 mt-1">
                Öğretmen öğrencilerin sorularını yazar; muhabir 3. şahısla ve kaynakla [Belge X] cevaplar.
              </p>
            </div>

            <div
              onClick={() => setAktifBolum(3)}
              className={`cursor-pointer p-4 rounded-xl border transition ${
                aktifBolum === 3
                  ? 'bg-amber-950/70 border-amber-700 text-amber-200 shadow-sm'
                  : 'bg-stone-900/60 border-stone-800 text-stone-300 hover:bg-stone-900'
              }`}
            >
              <div className="flex items-center gap-2 font-semibold text-sm">
                <Newspaper className="w-4 h-4 text-amber-400" />
                <span>3. Yayın</span>
              </div>
              <p className="text-xs text-stone-400 mt-1">
                &ldquo;Gazete Sayfası Yap&rdquo; (1919 dizgisi) ve &ldquo;Podcast Yap&rdquo; (2 sesli Gemini TTS).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ANA İÇERİK ALANI */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full">
        {/* Güvenilirlik & Pedagojik İlkeler Hatırlatması */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-600 bg-white/70 p-3 rounded-xl border border-stone-200/80">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-800 shrink-0" />
            <span>
              <strong>Pedagoji ve Güvenlik:</strong> Hiçbir kişisel veri (isim, numara vb.) toplanmaz.
            </span>
          </div>

          <div className="flex items-center gap-2 text-stone-500 font-mono text-[11px]">
            <span>Model: gemini-3.8-flash</span>
            <span>•</span>
            <span>Server-Side Route</span>
          </div>
        </div>

        {/* BÖLÜM 1: BELGELER */}
        {aktifBolum === 1 && (
          <BelgelerBolumu
            belgeler={belgeler}
            setBelgeler={setBelgeler}
            onDevamEt={() => setAktifBolum(2)}
          />
        )}

        {/* BÖLÜM 2: RÖPORTAJ */}
        {aktifBolum === 2 && (
          <RoportajBolumu
            belgeler={belgeler}
            soruCevaplar={soruCevaplar}
            setSoruCevaplar={setSoruCevaplar}
            onYayinaGec={() => setAktifBolum(3)}
          />
        )}

        {/* BÖLÜM 3: YAYIN */}
        {aktifBolum === 3 && (
          <YayinBolumu
            belgeler={belgeler}
            soruCevaplar={soruCevaplar}
            gazeteVerisi={gazeteVerisi}
            setGazeteVerisi={setGazeteVerisi}
            podcastVerisi={podcastVerisi}
            setPodcastVerisi={setPodcastVerisi}
          />
        )}
      </main>

      {/* ALT BİLGİ (FOOTER) */}
      <footer className="bg-stone-900 border-t border-stone-800 text-stone-400 text-xs py-8 mt-12 print:hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <span className="font-serif font-bold text-stone-200">Tarih Muhabiri</span>
            <p className="text-stone-500 text-[11px] mt-0.5">
              Millî Mücadele ve Yakın Çağ Tarihi Birincil Belge Eğitim Aracı
            </p>
          </div>

          <div className="text-[11px] text-stone-400">
            Tarihî belgeler tahrif edilemez; tarihî şahsiyetler canlandırılmaz; muhabir tarafsız üçüncü şahısla bildirir.
          </div>
        </div>
      </footer>
    </div>
  );
}
