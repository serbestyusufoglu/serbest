import { NextRequest, NextResponse } from 'next/server';
import { Type } from '@google/genai';
import { ai } from '@/lib/gemini';
import { GEMINI_MODEL, SISTEM_TALIMATI } from '@/lib/talimat';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { documents, interviewQAs } = body;

    if (!documents || typeof documents !== 'string' || !documents.trim()) {
      return NextResponse.json(
        { error: 'Lütfen önce en az bir tarihî belge metni ekleyin.' },
        { status: 400 }
      );
    }

    const qaText = Array.isArray(interviewQAs) && interviewQAs.length > 0
      ? interviewQAs
          .map((qa: { soru: string; cevap: string }, idx: number) => `Soru ${idx + 1}: ${qa.soru}\nCevap ${idx + 1}: ${qa.cevap}`)
          .join('\n\n')
      : 'Henüz röportaj sorusu sorulmadı. Belgeler temelinde genel haber oluşturun.';

    const prompt = `AŞAĞIDAKİ TARİHÎ BELGELERİ VE GERÇEKLEŞTİRİLEN RÖPORTAJI KULLANARAK 1919 DÖNEMİ BİR GAZETE SAYFASI HAZIRLA.

TARİHÎ BELGELER:
${documents.trim()}

GERÇEKLEŞEN RÖPORTAJ SORU-CEVAPLARI:
${qaText}

KURALLAR:
1. Sen 1919 döneminde (örneğin İrâde-i Milliye veya Hâkimiyet-i Milliye) yazan bir muhabirsin.
2. Tarihî kişileri ASLA canlandırma. Her zaman üçüncü şahısla ve nesnel bir muhabir gözüyle aktar.
3. YALNIZCA verilen belgelerdeki ve röportajdaki bilgileri kullan. Dışarıdan uydurma bilgi ekleme.
4. "alintilar": Belgelerdeki cümleleri BİREBİR, virgülüne dahi dokunmadan tırnak içinde alıntıla. En az 2, en fazla 4 alıntı olsun. Her birinin hangi belgeden olduğu "belge" alanında belirtilsin (Örn: "Belge 1").
5. "kontrolSorulari": 7-12. sınıf öğrencilerinin belgelerdeki gerçekleri ve haberin ana fikrini sorgulaması için tam 3 adet pedagojik kontrol sorusu hazırla.
6. "manset": Dönemin ruhuna uygun, çarpıcı ama tarafsız ve belgelere dayalı bir ana manşet.
7. "spot": Manşetin hemen altındaki açıklayıcı 2-3 cümlelik özet.
8. "haberMetni": Olay yerinden izlenim ve belgelerdeki kararları aktaran, paragraflara bölünmüş etkileyici haber metni.`;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        systemInstruction: SISTEM_TALIMATI,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            manset: {
              type: Type.STRING,
              description: 'Gazetenin ana manşet başlığı',
            },
            spot: {
              type: Type.STRING,
              description: 'Manşetin altındaki spot metin',
            },
            haberMetni: {
              type: Type.STRING,
              description: 'Detaylı haber metni (paragraflarla)',
            },
            alintilar: {
              type: Type.ARRAY,
              description: 'Belgelerden birebir yapılmış alıntılar',
              items: {
                type: Type.OBJECT,
                properties: {
                  metin: {
                    type: Type.STRING,
                    description: 'Belgeden birebir alınan metin',
                  },
                  belge: {
                    type: Type.STRING,
                    description: 'Hangi belge olduğu (örn. Belge 1)',
                  },
                },
                required: ['metin', 'belge'],
              },
            },
            kontrolSorulari: {
              type: Type.ARRAY,
              description: 'Öğrenciler için tam 3 adet kontrol sorusu',
              items: {
                type: Type.STRING,
              },
            },
            gazeteAdi: {
              type: Type.STRING,
              description: 'Dönemin gazete adı, örn. İrâde-i Milliye',
            },
            tarihMetni: {
              type: Type.STRING,
              description: '1919 dönemine uygun tarih ibaresi (Miladi ve Rumi)',
            },
            sayi: {
              type: Type.STRING,
              description: 'Sayı numarası, örn. Sayı: 14',
            },
            sehir: {
              type: Type.STRING,
              description: 'Basım yeri (Sivas, Amasya, Ankara vb.)',
            },
          },
          required: ['manset', 'spot', 'haberMetni', 'alintilar', 'kontrolSorulari'],
        },
      },
    });

    const rawJson = response.text?.trim() || '{}';
    const parsedData = JSON.parse(rawJson);

    return NextResponse.json({
      gazete: parsedData,
    });
  } catch (error: unknown) {
    console.error('Gazete API hatası:', error);
    const message = error instanceof Error ? error.message : 'Gazete sayfası oluşturulurken hata meydana geldi.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
