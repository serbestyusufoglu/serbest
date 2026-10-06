'use client';

import React, { useState, useRef, useEffect } from 'react';
import { PodcastVerisi } from '@/types';
import { 
  Play, 
  Pause, 
  Volume2, 
  Download, 
  Radio, 
  UserCheck, 
  Clock, 
  RotateCcw,
  Sparkles,
  VolumeX,
  Mic,
  GraduationCap
} from 'lucide-react';

interface PodcastGorunumuProps {
  podcast: PodcastVerisi;
  onYenidenUret?: () => void;
}

export default function PodcastGorunumu({ podcast, onYenidenUret }: PodcastGorunumuProps) {
  const [oynatiliyor, setOynatiliyor] = useState(false);
  const [gecenSure, setGecenSure] = useState(0);
  const [toplamSure, setToplamSure] = useState(60);
  const [aktifSatirIndeksi, setAktifSatirIndeksi] = useState<number>(-1);
  const [sesSeviyesi, setSesSeviyesi] = useState(1);
  const [sessiz, setSessiz] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioBlobUrlRef = useRef<string | null>(null);

  // Initialize or cleanup audio URL
  useEffect(() => {
    if (podcast.audioBase64) {
      try {
        const byteCharacters = atob(podcast.audioBase64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: podcast.audioMimeType || 'audio/wav' });
        const url = URL.createObjectURL(blob);
        audioBlobUrlRef.current = url;
      } catch (e) {
        console.error('Audio Blob creation error:', e);
      }
    }

    return () => {
      if (audioBlobUrlRef.current) {
        URL.revokeObjectURL(audioBlobUrlRef.current);
      }
    };
  }, [podcast.audioBase64, podcast.audioMimeType]);

  const toggleOynat = () => {
    if (!audioRef.current && audioBlobUrlRef.current) {
      const audio = new Audio(audioBlobUrlRef.current);
      audioRef.current = audio;

      audio.onloadedmetadata = () => {
        if (audio.duration && !isNaN(audio.duration)) {
          setToplamSure(Math.round(audio.duration));
        }
      };

      audio.ontimeupdate = () => {
        const cur = audio.currentTime;
        setGecenSure(cur);

        // Approximate active line based on playback time
        if (podcast.diyalog.length > 0 && audio.duration) {
          const ratio = cur / audio.duration;
          const idx = Math.min(
            Math.floor(ratio * podcast.diyalog.length),
            podcast.diyalog.length - 1
          );
          setAktifSatirIndeksi(idx);
        }
      };

      audio.onended = () => {
        setOynatiliyor(false);
        setGecenSure(0);
        setAktifSatirIndeksi(-1);
      };
    }

    if (audioRef.current) {
      if (oynatiliyor) {
        audioRef.current.pause();
        setOynatiliyor(false);
      } else {
        audioRef.current.volume = sessiz ? 0 : sesSeviyesi;
        audioRef.current.play().then(() => {
          setOynatiliyor(true);
        }).catch((err) => {
          console.error('Playback failed:', err);
          // Fallback to browser speech synthesis if audio playback is blocked
          tarayiciSeslendir();
        });
      }
    } else {
      // Browser Speech Synthesis Fallback
      tarayiciSeslendir();
    }
  };

  // Browser Speech Synthesis Fallback if Gemini TTS WAV was not returned
  const tarayiciSeslendir = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setOynatiliyor(false);
      setAktifSatirIndeksi(-1);
      return;
    }

    setOynatiliyor(true);
    let lineIdx = 0;

    const speakNext = () => {
      if (lineIdx >= podcast.diyalog.length) {
        setOynatiliyor(false);
        setAktifSatirIndeksi(-1);
        return;
      }

      const item = podcast.diyalog[lineIdx];
      setAktifSatirIndeksi(lineIdx);

      const utterance = new SpeechSynthesisUtterance(item.text);
      utterance.lang = 'tr-TR';
      utterance.rate = item.speaker === 'Muhabir' ? 1.05 : 0.95;
      utterance.pitch = item.speaker === 'Muhabir' ? 1.1 : 0.9;

      utterance.onend = () => {
        lineIdx++;
        speakNext();
      };

      utterance.onerror = () => {
        setOynatiliyor(false);
      };

      window.speechSynthesis.speak(utterance);
    };

    speakNext();
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const yeniZaman = parseFloat(e.target.value);
    setGecenSure(yeniZaman);
    if (audioRef.current) {
      audioRef.current.currentTime = yeniZaman;
    }
  };

  const wavIndir = () => {
    if (!audioBlobUrlRef.current) return;
    const a = document.createElement('a');
    a.href = audioBlobUrlRef.current;
    a.download = `tarih-muhabiri-podcast-${Date.now()}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const formatZaman = (saniye: number) => {
    const dk = Math.floor(saniye / 60);
    const sn = Math.floor(saniye % 60);
    return `${dk}:${sn < 10 ? '0' : ''}${sn}`;
  };

  return (
    <div className="space-y-6">
      {/* PODCAST KART KUTUSU */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-900 to-amber-950 text-stone-100 rounded-2xl p-6 sm:p-8 shadow-xl border border-stone-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1">
                <Radio className="w-3.5 h-3.5" />
                2 Sesli Tarih Yayını (Muhabir &amp; Tarihçi)
              </span>
              <span className="text-xs text-stone-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                ~1 Dakika
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mt-2">
              {podcast.baslik}
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 mt-1">
              {podcast.ozet}
            </p>
          </div>

          {/* İki Konuşmacı Tanıtımı */}
          <div className="flex items-center gap-2 bg-stone-800/80 p-2.5 rounded-xl border border-stone-700/60 shrink-0">
            <div className="flex items-center gap-2 text-xs px-2">
              <div className="w-7 h-7 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 flex items-center justify-center font-bold">
                <Mic className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="font-semibold text-white">Muhabir</div>
                <div className="text-[10px] text-stone-400">1. Ses (Dinamik)</div>
              </div>
            </div>

            <div className="h-6 w-px bg-stone-700" />

            <div className="flex items-center gap-2 text-xs px-2">
              <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 flex items-center justify-center font-bold">
                <GraduationCap className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="font-semibold text-white">Tarihçi</div>
                <div className="text-[10px] text-stone-400">2. Ses (Analist)</div>
              </div>
            </div>
          </div>
        </div>

        {/* OYNATICI KONTROL ALANI */}
        <div className="mt-6 bg-stone-950/70 p-4 sm:p-5 rounded-xl border border-stone-800 space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Oynat / Duraklat Butonu */}
            <button
              type="button"
              onClick={toggleOynat}
              className="w-14 h-14 rounded-full bg-amber-600 hover:bg-amber-500 text-stone-950 flex items-center justify-center shadow-lg hover:scale-105 transition shrink-0"
              title={oynatiliyor ? 'Durdur' : 'Oynat'}
            >
              {oynatiliyor ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
            </button>

            {/* Zaman Çubuğu & Bilgi */}
            <div className="flex-1 w-full space-y-1.5">
              <div className="flex items-center justify-between text-xs text-stone-400 font-mono">
                <span>{formatZaman(gecenSure)}</span>
                <span className="flex items-center gap-1.5 text-amber-400">
                  {oynatiliyor && (
                    <span className="inline-flex gap-0.5">
                      <span className="w-1 h-3 bg-amber-400 animate-pulse" />
                      <span className="w-1 h-4 bg-amber-400 animate-pulse delay-75" />
                      <span className="w-1 h-2 bg-amber-400 animate-pulse delay-150" />
                    </span>
                  )}
                  {podcast.audioBase64 ? 'Gemini TTS Ses Kaydı' : 'Diyalog Seslendirici'}
                </span>
                <span>{formatZaman(toplamSure)}</span>
              </div>

              <input
                type="range"
                min={0}
                max={toplamSure || 60}
                value={gecenSure}
                onChange={handleSeek}
                className="w-full h-2 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            {/* Sağ Araçlar (İndir, Ses) */}
            <div className="flex items-center gap-2 shrink-0">
              {podcast.audioBase64 && (
                <button
                  type="button"
                  onClick={wavIndir}
                  className="p-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg border border-stone-700 transition"
                  title="WAV Ses Dosyasını İndir"
                >
                  <Download className="w-4 h-4" />
                </button>
              )}

              <button
                type="button"
                onClick={() => setSessiz(!sessiz)}
                className="p-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg border border-stone-700 transition"
                title={sessiz ? 'Sesi Aç' : 'Sesi Kapat'}
              >
                {sessiz ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* DİYALOG METNİ & CANLI TAKİP */}
        <div className="mt-6 space-y-3">
          <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider flex items-center justify-between">
            <span>Yayın Dökümü (Transkript)</span>
            <span className="text-[11px] text-amber-400">
              *Tarihçi tarihî kişileri canlandırmaz, onları üçüncü şahısla anlatır.
            </span>
          </div>

          <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
            {podcast.diyalog.map((satir, idx) => {
              const isMuhabir = satir.speaker === 'Muhabir';
              const isAktif = aktifSatirIndeksi === idx;

              return (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isAktif
                      ? 'bg-amber-900/30 border-amber-500 shadow-md ring-1 ring-amber-500/50 scale-[1.01]'
                      : isMuhabir
                      ? 'bg-stone-800/40 border-stone-700/50 hover:bg-stone-800/60'
                      : 'bg-amber-950/20 border-amber-900/40 hover:bg-amber-950/40'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded ${
                        isMuhabir
                          ? 'bg-blue-900/50 text-blue-300 border border-blue-700/50'
                          : 'bg-amber-900/60 text-amber-300 border border-amber-700/60'
                      }`}
                    >
                      {satir.speaker}
                    </span>
                    {isAktif && (
                      <span className="text-[10px] text-amber-400 animate-pulse font-mono">
                        ● Konuşuluyor
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-sans">
                    {satir.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {onYenidenUret && (
          <div className="mt-5 text-right">
            <button
              type="button"
              onClick={onYenidenUret}
              className="text-xs text-stone-400 hover:text-stone-200 underline"
            >
              Farklı Bir Podcast Senaryosu Üret
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
