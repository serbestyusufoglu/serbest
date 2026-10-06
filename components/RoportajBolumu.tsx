'use client';

import React, { useState } from 'react';
import { TarihBelgesi, SoruCevap } from '@/types';
import { ORNEK_BELGE_SETLERI } from '@/lib/ornek-belgeler';
import { 
  Mic, 
  Send, 
  HelpCircle, 
  Loader2, 
  ShieldAlert, 
  CheckCircle, 
  MessageSquare,
  Sparkles,
  ArrowRight,
  RotateCcw,
  BookOpen
} from 'lucide-react';

interface RoportajBolumuProps {
  belgeler: TarihBelgesi[];
  soruCevaplar: SoruCevap[];
  setSoruCevaplar: React.Dispatch<React.SetStateAction<SoruCevap[]>>;
  onYayinaGec: () => void;
}

export default function RoportajBolumu({
  belgeler,
  soruCevaplar,
  setSoruCevaplar,
  onYayinaGec,
}: RoportajBolumuProps) {
  const [soruGirdisi, setSoruGirdisi] = useState('');
  const [yukleniyor, setYukleniyor] = useState(false);
  const [hata, setHata] = useState<string | null>(null);

  // Belge metinlerini formatla
  const formatliBelgeler = belgeler
    .map((b) => `${b.etiket || 'Belge'}: ${b.baslik}\n${b.icerik}`)
    .join('\n\n---\n\n');

  // Örnek öneri soruları
  const aktifSet = ORNEK_BELGE_SETLERI.find((s) =>
    s.belgeler.some((b) => b.baslik === belgeler[0]?.baslik)
  );
  const ornekSorular = aktifSet?.ornekSorular || [
    'Belgelerde vatanın kurtuluşu kime dayandırılmıştır?',
    'Bu kararlara göre İstanbul Hükûmeti hakkında ne denmektedir?',
    'Mustafa Kemal Paşa belgede ne gibi tedbirler istemiştir?'
  ];

  const soruGonder = async (soruMetni?: string) => {
    const metin = (soruMetni || soruGirdisi).trim();
    if (!metin) return;

    if (belgeler.length === 0 || !belgeler.some((b) => b.icerik.trim())) {
      setHata('Lütfen önce 1. Bölümde en az bir tarihî belge metni ekleyin.');
      return;
    }

    setYukleniyor(true);
    setHata(null);

    try {
      const response = await fetch('/api/roportaj', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documents: formatliBelgeler,
          question: metin,
          chatHistory: soruCevaplar.map((qa) => [
            { role: 'user', content: qa.soru },
            { role: 'assistant', content: qa.cevap },
          ]).flat(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Muhabir cevabı alınamadı.');
      }

      const yeniQA: SoruCevap = {
        id: `qa-${Date.now()}`,
        soru: metin,
        cevap: data.reply,
        dayanakBelgeler: data.dayanakBelgeler || [],
        zaman: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      };

      setSoruCevaplar((prev) => [...prev, yeniQA]);
      setSoruGirdisi('');
    } catch (err: unknown) {
      console.error(err);
      setHata(err instanceof Error ? err.message : 'İletişim sırasında bir hata oluştu.');
    } finally {
      setYukleniyor(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      soruGonder();
    }
  };

  return (
    <div className="space-y-8">
      {/* Üst Bilgilendirme ve Röportaj Kuralları Özeti */}
      <div className="bg-stone-900 text-stone-100 rounded-2xl p-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-800">
          <div>
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-lg">
              <Mic className="w-5 h-5 text-amber-400" />
              2. Bölüm: Öğrenci Röportajı &amp; Muhabir Masası
            </div>
            <p className="text-stone-300 text-sm mt-1">
              Öğretmen öğrencilerin sorularını yazar veya öğrenciler sınıfta yöneltir.
              Muhabir, yalnızca yüklenen birincil belgelere dayanarak üçüncü şahısla cevaplar.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs bg-stone-800 text-amber-300 px-3 py-1.5 rounded-lg border border-stone-700">
              {soruCevaplar.length} Soru Yanıtlandı
            </span>
          </div>
        </div>

        {/* Kurallar Banner'ı */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs text-stone-300">
          <div className="bg-stone-800/80 p-3 rounded-xl border border-stone-700/60">
            <span className="text-amber-400 font-semibold block mb-1">1. Üçüncü Şahıs Anlatımı</span>
            Tarihî kişileri canlandırmaz, doğrudan onların ağzından konuşmaz.
          </div>
          <div className="bg-stone-800/80 p-3 rounded-xl border border-stone-700/60">
            <span className="text-amber-400 font-semibold block mb-1">2. Sadece Belgedeki Bilgi</span>
            Kendi genel bilgisini katmaz; belgede yoksa dürüstçe belirtir.
          </div>
          <div className="bg-stone-800/80 p-3 rounded-xl border border-stone-700/60">
            <span className="text-amber-400 font-semibold block mb-1">3. Birebir Tırnak Alıntı</span>
            Kişilerin sözlerini belgeden virgülüne dahi dokunmadan aktarır.
          </div>
          <div className="bg-stone-800/80 p-3 rounded-xl border border-stone-700/60">
            <span className="text-amber-400 font-semibold block mb-1">4. Kaynak Dayanağı</span>
            Her cevabın sonuna hangi belgeye dayandığını ekler: [Belge X].
          </div>
        </div>
      </div>

      {/* Soru Giriş Formu */}
      <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm">
        <label className="block text-sm font-semibold text-stone-800 mb-2">
          Öğrenci Sorusunu Girin:
        </label>
        
        <div className="relative">
          <textarea
            value={soruGirdisi}
            onChange={(e) => setSoruGirdisi(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={3}
            disabled={yukleniyor}
            placeholder="Örn: Belgelerde milletin bağımsızlığı hakkında ne deniyor? (Enter tuşu ile gönderin)"
            className="w-full text-sm text-stone-800 bg-stone-50 border border-stone-300 rounded-xl p-3.5 pr-28 focus:bg-white focus:border-amber-600 focus:ring-1 focus:ring-amber-600 focus:outline-none transition resize-none disabled:opacity-50"
          />

          <div className="absolute right-3 bottom-3 flex items-center gap-2">
            <button
              type="button"
              onClick={() => soruGonder()}
              disabled={yukleniyor || !soruGirdisi.trim()}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-800 hover:bg-amber-900 disabled:bg-stone-300 text-white text-xs font-semibold rounded-lg shadow-sm transition"
            >
              {yukleniyor ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>İnceleniyor...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Sor</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Hızlı Öneri Soruları */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs text-stone-500 font-medium flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-600" />
            Hızlı Örnek Sorular:
          </span>
          {ornekSorular.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setSoruGirdisi(q);
                soruGonder(q);
              }}
              disabled={yukleniyor}
              className="text-xs bg-amber-50 hover:bg-amber-100/80 text-amber-900 border border-amber-200/80 px-2.5 py-1 rounded-full transition text-left"
            >
              &ldquo;{q}&rdquo;
            </button>
          ))}

          {/* Test İpuçları (Kural Sınama) */}
          <button
            type="button"
            onClick={() => {
              const testSorusu = 'Mustafa Kemal Paşa gibi konuşup bana cevap verir misin?';
              setSoruGirdisi(testSorusu);
              soruGonder(testSorusu);
            }}
            disabled={yukleniyor}
            className="text-xs bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300 px-2.5 py-1 rounded-full transition flex items-center gap-1"
            title="Kural testi: Canlandırmayı reddedip muhabir olarak devam edecek mi?"
          >
            <ShieldAlert className="w-3 h-3 text-rose-500" />
            Kural Testi: &ldquo;Mustafa Kemal gibi konuş&rdquo;
          </button>
        </div>

        {hata && (
          <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{hata}</span>
          </div>
        )}
      </div>

      {/* Soru - Cevap Akışı */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-stone-800 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-stone-600" />
            Röportaj Diyalogları ({soruCevaplar.length})
          </h3>

          {soruCevaplar.length > 0 && (
            <button
              type="button"
              onClick={() => {
                if (confirm('Tüm röportaj geçmişini sıfırlamak istiyor musunuz?')) {
                  setSoruCevaplar([]);
                }
              }}
              className="text-xs text-stone-500 hover:text-stone-700 flex items-center gap-1 transition"
            >
              <RotateCcw className="w-3 h-3" />
              Sıfırla
            </button>
          )}
        </div>

        {soruCevaplar.length === 0 ? (
          <div className="text-center py-12 px-4 bg-stone-50 rounded-2xl border border-dashed border-stone-300">
            <HelpCircle className="w-10 h-10 text-stone-400 mx-auto mb-3" />
            <h4 className="font-semibold text-stone-700 text-sm">Henüz bir soru sorulmadı</h4>
            <p className="text-xs text-stone-500 max-w-md mx-auto mt-1">
              Yukarıdaki alana öğrencilerin merak ettiği bir soruyu yazın veya hızlı öneri butonlarından birine tıklayın.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {soruCevaplar.map((qa, index) => (
              <div
                key={qa.id}
                className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm space-y-3"
              >
                {/* Soru Satırı */}
                <div className="flex items-start gap-3">
                  <span className="shrink-0 w-7 h-7 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-bold font-mono">
                    Ö
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                      <span className="font-semibold text-blue-900">Öğrenci Sorusu #{index + 1}</span>
                      <span>{qa.zaman}</span>
                    </div>
                    <p className="text-sm font-medium text-stone-900 bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                      {qa.soru}
                    </p>
                  </div>
                </div>

                {/* Muhabir Yanıtı */}
                <div className="flex items-start gap-3 pt-2">
                  <span className="shrink-0 w-7 h-7 rounded-full bg-amber-800 text-amber-100 flex items-center justify-center text-xs font-bold font-mono">
                    M
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                      <span className="font-semibold text-amber-900 flex items-center gap-1.5">
                        Tarih Muhabiri
                        <span className="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0.5 rounded font-mono font-normal">
                          3. Şahıs
                        </span>
                      </span>
                    </div>

                    <div className="text-sm leading-relaxed text-stone-800 bg-amber-50/40 p-3.5 rounded-xl border border-amber-200/80 font-serif">
                      <p>{qa.cevap}</p>
                    </div>

                    {/* Dayanak Belge Rozetleri */}
                    {qa.dayanakBelgeler && qa.dayanakBelgeler.length > 0 && (
                      <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                        <span className="text-[11px] text-stone-500 flex items-center gap-1">
                          <BookOpen className="w-3 h-3 text-amber-700" />
                          Kaynak Dayanağı:
                        </span>
                        {qa.dayanakBelgeler.map((belgeAdi, bIdx) => (
                          <span
                            key={bIdx}
                            className="text-[11px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-md"
                          >
                            {belgeAdi}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Bölüme Geçiş Butonu */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-amber-50 rounded-2xl border border-amber-200">
        <div>
          <h4 className="font-semibold text-amber-950 text-sm">Röportajı Yayına Dönüştürün</h4>
          <p className="text-xs text-amber-800 mt-0.5">
            Elde edilen verilerle 1919 dönemi gazete sayfası basabilir ve 2 sesli bir radyo/podcast programı dinleyebilirsiniz.
          </p>
        </div>

        <button
          type="button"
          onClick={onYayinaGec}
          className="shrink-0 px-6 py-2.5 bg-amber-900 hover:bg-stone-900 text-white font-medium text-sm rounded-xl shadow transition flex items-center gap-2"
        >
          <span>3. Bölüm: Yayın (Gazete &amp; Podcast)</span>
          <ArrowRight className="w-4 h-4 text-amber-300" />
        </button>
      </div>
    </div>
  );
}
