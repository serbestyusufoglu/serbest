'use client';

import React, { useState } from 'react';
import { TarihBelgesi } from '@/types';
import { ORNEK_BELGE_SETLERI } from '@/lib/ornek-belgeler';
import { 
  FileText, 
  Plus, 
  Trash2, 
  Sparkles, 
  BookOpen, 
  CheckCircle2, 
  Info,
  Calendar,
  Layers,
  Scroll
} from 'lucide-react';

interface BelgelerBolumuProps {
  belgeler: TarihBelgesi[];
  setBelgeler: React.Dispatch<React.SetStateAction<TarihBelgesi[]>>;
  onDevamEt: () => void;
}

export default function BelgelerBolumu({
  belgeler,
  setBelgeler,
  onDevamEt,
}: BelgelerBolumuProps) {
  const [seciliSetId, setSeciliSetId] = useState<string>('amasya-havza');
  const [bildirim, setBildirim] = useState<string | null>(null);

  const toplamKelime = belgeler.reduce((acc, b) => {
    return acc + (b.icerik.trim() ? b.icerik.trim().split(/\s+/).length : 0);
  }, 0);

  const setYukle = (setId: string) => {
    const bulunanSet = ORNEK_BELGE_SETLERI.find((s) => s.id === setId);
    if (bulunanSet) {
      setBelgeler(bulunanSet.belgeler);
      setSeciliSetId(setId);
      setBildirim(`"${bulunanSet.ad}" başarıyla yüklendi.`);
      setTimeout(() => setBildirim(null), 3000);
    }
  };

  const belgeGuncelle = (id: string, alan: keyof TarihBelgesi, deger: string) => {
    setBelgeler((onceki) =>
      onceki.map((b) => (b.id === id ? { ...b, [alan]: deger } : b))
    );
  };

  const belgeEkle = () => {
    const yeniNo = belgeler.length + 1;
    const yeniBelge: TarihBelgesi = {
      id: `belge-${Date.now()}`,
      etiket: `Belge ${yeniNo}`,
      baslik: `Yeni Tarihî Belge ${yeniNo}`,
      icerik: '',
      tarih: '1919',
      kaynak: 'Birincil Arşiv Kaynağı',
    };
    setBelgeler([...belgeler, yeniBelge]);
  };

  const belgeSil = (id: string) => {
    if (belgeler.length <= 1) {
      alert('En az 1 tarihî belge bulunmalıdır.');
      return;
    }
    const filtrelenmis = belgeler.filter((b) => b.id !== id);
    // Re-index labels
    const yenidenEtiketli = filtrelenmis.map((b, idx) => ({
      ...b,
      etiket: `Belge ${idx + 1}`,
    }));
    setBelgeler(yenidenEtiketli);
  };

  return (
    <div className="space-y-8">
      {/* Üst Bilgilendirme ve Hazır Setler */}
      <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-6 shadow-sm backdrop-blur">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-amber-200/70">
          <div>
            <div className="flex items-center gap-2 text-amber-900 font-semibold text-lg">
              <Scroll className="w-5 h-5 text-amber-700" />
              1. Bölüm: Birincil Tarihî Belgeler
            </div>
            <p className="text-amber-800/90 text-sm mt-1">
              Öğretmen 2-3 tarihî belge metnini girer veya aşağıdaki hazır ders kaynaklarından birini seçer.
              Muhabir <strong>yalnızca</strong> bu belgelerdeki bilgileri kullanır.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-amber-100/70 text-amber-900 text-xs px-3 py-1.5 rounded-lg border border-amber-300/60 font-medium">
            <Layers className="w-4 h-4 text-amber-700" />
            <span>{belgeler.length} Belge</span>
            <span className="text-amber-400">•</span>
            <span>~{toplamKelime} Kelime</span>
          </div>
        </div>

        {/* Hazır Belge Setleri Seçimi */}
        <div className="mt-5">
          <label className="text-xs font-semibold uppercase tracking-wider text-amber-900/80 block mb-2">
            Ders İçi Hazır Belge Setleri (Tek Tıkla Yükle):
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {ORNEK_BELGE_SETLERI.map((set) => {
              const aktif = seciliSetId === set.id;
              return (
                <button
                  key={set.id}
                  type="button"
                  onClick={() => setYukle(set.id)}
                  className={`text-left p-3.5 rounded-xl border transition-all ${
                    aktif
                      ? 'bg-amber-800 text-white border-amber-900 shadow-md ring-2 ring-amber-700/20'
                      : 'bg-white hover:bg-amber-100/50 text-stone-800 border-amber-200 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md uppercase tracking-wider bg-amber-200/40 text-current">
                      {set.donem}
                    </span>
                    {aktif && <Sparkles className="w-4 h-4 text-amber-300" />}
                  </div>
                  <h4 className="font-semibold text-sm mt-2 leading-snug line-clamp-1">
                    {set.ad}
                  </h4>
                  <p className={`text-xs mt-1 line-clamp-2 ${aktif ? 'text-amber-100' : 'text-stone-600'}`}>
                    {set.aciklama}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {bildirim && (
          <div className="mt-4 flex items-center gap-2 text-xs font-medium text-emerald-800 bg-emerald-100/80 border border-emerald-300 px-3 py-2 rounded-lg">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            {bildirim}
          </div>
        )}
      </div>

      {/* Belge Kartları Listesi */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-stone-800 flex items-center gap-2">
            <FileText className="w-4 h-4 text-stone-600" />
            Yüklü Belge Metinleri ({belgeler.length})
          </h3>

          <button
            type="button"
            onClick={belgeEkle}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-stone-800 hover:bg-stone-900 text-white rounded-lg shadow-sm transition"
          >
            <Plus className="w-3.5 h-3.5" />
            Yeni Belge Ekle
          </button>
        </div>

        {belgeler.map((belge, index) => (
          <div
            key={belge.id}
            className="bg-white border border-stone-200/90 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
          >
            {/* Sol kenar şeridi */}
            <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-amber-700" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2.5">
                <span className="bg-amber-100 text-amber-900 border border-amber-300/70 font-mono font-bold text-xs px-2.5 py-1 rounded-md">
                  {belge.etiket || `Belge ${index + 1}`}
                </span>
                <input
                  type="text"
                  value={belge.baslik}
                  onChange={(e) => belgeGuncelle(belge.id, 'baslik', e.target.value)}
                  placeholder="Belge Başlığı (Örn. Amasya Genelgesi 3. Madde)"
                  className="font-semibold text-stone-900 text-sm sm:text-base bg-transparent border-b border-transparent hover:border-stone-300 focus:border-amber-600 focus:outline-none transition px-1 py-0.5"
                />
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-xs text-stone-500 bg-stone-50 px-2 py-1 rounded border border-stone-200">
                  <Calendar className="w-3.5 h-3.5 text-stone-400" />
                  <input
                    type="text"
                    value={belge.tarih || ''}
                    onChange={(e) => belgeGuncelle(belge.id, 'tarih', e.target.value)}
                    placeholder="Tarih"
                    className="w-24 bg-transparent text-xs text-stone-700 focus:outline-none"
                  />
                </div>

                {belgeler.length > 1 && (
                  <button
                    type="button"
                    onClick={() => belgeSil(belge.id)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    title="Bu Belgeyi Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Metin Alanı */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-stone-600 mb-1 flex items-center justify-between">
                  <span>Belge Metni (Özgün Cümleler / Maddeler):</span>
                  <span className="text-[11px] text-stone-400 font-normal">
                    {belge.icerik.trim().split(/\s+/).filter(Boolean).length} kelime
                  </span>
                </label>
                <textarea
                  value={belge.icerik}
                  onChange={(e) => belgeGuncelle(belge.id, 'icerik', e.target.value)}
                  rows={5}
                  placeholder={`"${belge.etiket}:" metnini buraya yapıştırın veya düzenleyin...`}
                  className="w-full text-sm font-serif leading-relaxed text-stone-800 bg-stone-50/60 hover:bg-stone-50 focus:bg-white border border-stone-200 rounded-xl p-3.5 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 focus:outline-none transition resize-y"
                />
              </div>

              {/* Kaynak / Arşiv Bilgisi */}
              <div className="flex items-center gap-2 text-xs text-stone-500">
                <BookOpen className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span className="shrink-0">Kaynak:</span>
                <input
                  type="text"
                  value={belge.kaynak || ''}
                  onChange={(e) => belgeGuncelle(belge.id, 'kaynak', e.target.value)}
                  placeholder="Arşiv / Kitap Referansı (Nutuk Belge 26, Zabıt Ceridesi vb.)"
                  className="w-full bg-transparent text-stone-700 border-b border-dotted border-stone-300 focus:border-amber-600 focus:outline-none"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Alt Yönlendirme ve Kural Hatırlatması */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-stone-100 rounded-2xl border border-stone-200">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <p className="text-xs text-stone-700 leading-relaxed">
            <strong>Pedagojik Güvence:</strong> Röportaj aşamasında muhabir yapay zekâ, öğrencilerin sorularına 
            yalnızca bu alandaki belgelerden yanıt arayacak; belgede olmayan sorular için kaynak araştırmayı önerecektir.
          </p>
        </div>

        <button
          type="button"
          onClick={onDevamEt}
          className="shrink-0 px-6 py-2.5 bg-amber-800 hover:bg-amber-900 text-white font-medium text-sm rounded-xl shadow-sm hover:shadow transition flex items-center gap-2"
        >
          <span>2. Bölüm: Röportaj&apos;a Geç</span>
          <span className="text-amber-300">→</span>
        </button>
      </div>
    </div>
  );
}
