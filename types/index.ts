export interface TarihBelgesi {
  id: string;
  baslik: string;
  etiket: string; // e.g. "Belge 1", "Belge 2"
  icerik: string;
  kaynak?: string;
  tarih?: string;
}

export interface SoruCevap {
  id: string;
  soru: string;
  cevap: string;
  dayanakBelgeler?: string[]; // e.g. ["Belge 1", "Belge 2"]
  zaman: string;
}

export interface GazeteAlinti {
  metin: string;
  belge: string;
}

export interface GazeteVerisi {
  manset: string;
  spot: string;
  haberMetni: string;
  alintilar: GazeteAlinti[];
  kontrolSorulari: string[];
  gazeteAdi?: string;
  tarihMetni?: string;
  sayi?: string;
  sehir?: string;
}

export interface PodcastSatiri {
  speaker: 'Muhabir' | 'Tarihçi';
  text: string;
}

export interface PodcastVerisi {
  baslik: string;
  ozet: string;
  diyalog: PodcastSatiri[];
  audioBase64?: string;
  audioMimeType?: string;
}
