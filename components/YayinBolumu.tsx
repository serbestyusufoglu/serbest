'use client';

import React, { useState } from 'react';
import { TarihBelgesi, SoruCevap, GazeteVerisi, PodcastVerisi } from '@/types';
import GazeteGorunumu from './GazeteGorunumu';
import PodcastGorunumu from './PodcastGorunumu';
import { 
  Newspaper, 
  Radio, 
  Sparkles, 
  Loader2, 
  AlertCircle, 
  Layers,
  ChevronRight,
  BookOpen
} from 'lucide-react';

interface YayinBolumuProps {
  belgeler: TarihBelgesi[];
  soruCevaplar: SoruCevap[];
  gazeteVerisi: GazeteVerisi | null;
  setGazeteVerisi: React.Dispatch<React.SetStateAction<GazeteVerisi | null>>;
  podcastVerisi: PodcastVerisi | null;
  setPodcastVerisi: React.Dispatch<React.SetStateAction<PodcastVerisi | null>>;
}

export default function YayinBolumu({
  belgeler,
  soruCevaplar,
  gazeteVerisi,
  setGazeteVerisi,
  podcastVerisi,
  setPodcastVerisi,
}: YayinBolumuProps) {
  const [aktifGorunum, setAktifGorunum] = useState<'gazete' | 'podcast'>('gazete');
  const [gazeteYukleniyor, setGazeteYukleniyor] = useState(false);
  const [podcastYukleniyor, setPodcastYukleniyor] = useState(false);
  const [hata, setHata] = useState<string | null>(null);

  // Belge metinlerini formatla
  const formatliBelgeler = belgeler
    .map((b) => `${b.etiket || 'Belge'}: ${b.baslik}\n${b.icerik}`)
    .join('\n\n---\n\n');

  const gazeteOlustur = async () => {
    if (belgeler.length === 0 || !belgeler.some((b) => b.icerik.trim())) {
      setHata('Lütfen önce 1. Bölümden bir veya daha fazla tarihî belge ekleyin.');
      return;
    }

    setGazeteYukleniyor(true);
    setHata(null);

    try {
      const response = await fetch('/api/gazete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documents: formatliBelgeler,
          interviewQAs: soruCevaplar.map((qa) => ({ soru: qa.soru, cevap: qa.cevap })),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Gazete sayfası oluşturulamadı.');
      }

      setGazeteVerisi(data.gazete);
      setAktifGorunum('gazete');
    } catch (err: unknown) {
      console.error(err);
      setHata(err instanceof Error ? err.message : 'Gazete sayfası oluşturulurken hata meydana geldi.');
    } finally {
      setGazeteYukleniyor(false);
    }
  };

  const podcastOlustur = async () => {
    if (belgeler.length === 0 || !belgeler.some((b) => b.icerik.trim())) {
      setHata('Lütfen önce 1. Bölümden bir veya daha fazla tarihî belge ekleyin.');
      return;
    }

    setPodcastYukleniyor(true);
    setHata(null);

    try {
      const response = await fetch('/api/podcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documents: formatliBelgeler,
          gazete: gazeteVerisi,
          interviewQAs: soruCevaplar.map((qa) => ({ soru: qa.soru, cevap: qa.cevap })),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Podcast oluşturulamadı.');
      }

      setPodcastVerisi(data.podcast);
      setAktifGorunum('podcast');
    } catch (err: unknown) {
      console.error(err);
      setHata(err instanceof Error ? err.message : 'Podcast oluşturulurken hata meydana geldi.');
    } finally {
      setPodcastYukleniyor(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Üst Yayın Başlığı ve Düğmeler */}
      <div className="bg-stone-900 text-stone-100 rounded-2xl p-6 shadow-md">
        <div className="pb-4 border-b border-stone-800">
          <span className="text-amber-400 font-semibold text-lg flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-400" />
            3. Bölüm: Yayın Masası
          </span>
          <p className="text-stone-300 text-sm mt-1">
            Yüklediğiniz belgeleri ve yapılan röportajı 1919 dönemi gazete sayfasına veya 2 sesli bir podcast yayınına dönüştürün.
          </p>
        </div>

        {/* Ana Düğmeler (Kullanıcı Talebindeki 2 Buton) */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Gazete Sayfası Yap Düğmesi */}
          <button
            type="button"
            onClick={gazeteOlustur}
            disabled={gazeteYukleniyor || podcastYukleniyor}
            className="flex items-start gap-4 p-5 rounded-xl bg-amber-950/60 hover:bg-amber-900/80 border-2 border-amber-800 text-left transition group shadow-md hover:shadow-lg disabled:opacity-50"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-800 text-amber-200 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
              {gazeteYukleniyor ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <Newspaper className="w-6 h-6" />
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-base flex items-center gap-2">
                  Gazete Sayfası Yap
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </h4>
                <ChevronRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition" />
              </div>
              <p className="text-xs text-amber-200/80 mt-1 leading-snug">
                1919 dönemi manşet, spot, haber metni, birebir alıntılar ve 3 kontrol sorusuyla antika gazete tasarımı.
              </p>
              {gazeteVerisi && (
                <span className="inline-block mt-2 text-[11px] font-medium bg-emerald-900/60 text-emerald-300 px-2 py-0.5 rounded border border-emerald-700/60">
                  ✓ Sayfa Hazır
                </span>
              )}
            </div>
          </button>

          {/* Podcast Yap Düğmesi */}
          <button
            type="button"
            onClick={podcastOlustur}
            disabled={gazeteYukleniyor || podcastYukleniyor}
            className="flex items-start gap-4 p-5 rounded-xl bg-stone-800 hover:bg-stone-700 border-2 border-stone-600 text-left transition group shadow-md hover:shadow-lg disabled:opacity-50"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-600 text-stone-950 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
              {podcastYukleniyor ? (
                <Loader2 className="w-6 h-6 animate-spin text-stone-950" />
              ) : (
                <Radio className="w-6 h-6" />
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-base flex items-center gap-2">
                  Podcast Yap (2 Sesli)
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </h4>
                <ChevronRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition" />
              </div>
              <p className="text-xs text-stone-300 mt-1 leading-snug">
                Muhabir ve Tarihçi arasında 1 dakikalık diyalog ve Türkçe hazır seslerle Gemini TTS seslendirmesi.
              </p>
              {podcastVerisi && (
                <span className="inline-block mt-2 text-[11px] font-medium bg-emerald-900/60 text-emerald-300 px-2 py-0.5 rounded border border-emerald-700/60">
                  ✓ Ses Yayını Hazır
                </span>
              )}
            </div>
          </button>
        </div>

        {hata && (
          <div className="mt-4 p-3.5 bg-rose-950/70 border border-rose-800 rounded-xl text-rose-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{hata}</span>
          </div>
        )}
      </div>

      {/* Yayın Seçim Sekmeleri (Eğer en az biri üretilmişse) */}
      {(gazeteVerisi || podcastVerisi) && (
        <div className="flex items-center justify-center gap-2 border-b border-stone-300 pb-3">
          {gazeteVerisi && (
            <button
              type="button"
              onClick={() => setAktifGorunum('gazete')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition ${
                aktifGorunum === 'gazete'
                  ? 'bg-amber-900 text-white shadow-md'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              <Newspaper className="w-4 h-4" />
              <span>1919 Gazete Sayfası</span>
            </button>
          )}

          {podcastVerisi && (
            <button
              type="button"
              onClick={() => setAktifGorunum('podcast')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition ${
                aktifGorunum === 'podcast'
                  ? 'bg-stone-900 text-white shadow-md'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              <Radio className="w-4 h-4" />
              <span>Podcast Yayını (1 Dk)</span>
            </button>
          )}
        </div>
      )}

      {/* İçerik Görünümleri */}
      {aktifGorunum === 'gazete' && gazeteVerisi && (
        <GazeteGorunumu
          gazete={gazeteVerisi}
          onYenidenUret={gazeteOlustur}
        />
      )}

      {aktifGorunum === 'podcast' && podcastVerisi && (
        <PodcastGorunumu
          podcast={podcastVerisi}
          onYenidenUret={podcastOlustur}
        />
      )}

      {!gazeteVerisi && !podcastVerisi && !gazeteYukleniyor && !podcastYukleniyor && (
        <div className="text-center py-12 px-4 bg-stone-50 rounded-2xl border border-dashed border-stone-300">
          <BookOpen className="w-10 h-10 text-stone-400 mx-auto mb-3" />
          <h4 className="font-semibold text-stone-700 text-sm">Yayın çıktısı henüz üretilmedi</h4>
          <p className="text-xs text-stone-500 max-w-md mx-auto mt-1">
            Yukarıdaki <strong>&ldquo;Gazete Sayfası Yap&rdquo;</strong> veya <strong>&ldquo;Podcast Yap&rdquo;</strong> düğmelerine tıklayarak
            öğrencileriniz için görsel veya işitsel tarih materyali oluşturun.
          </p>
        </div>
      )}
    </div>
  );
}
