import { NextRequest, NextResponse } from 'next/server';
import { Type } from '@google/genai';
import { ai } from '@/lib/gemini';
import { GEMINI_MODEL, GEMINI_TTS_MODEL, SISTEM_TALIMATI } from '@/lib/talimat';
import { PodcastSatiri } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { documents, gazete, interviewQAs } = body;

    if (!documents || typeof documents !== 'string' || !documents.trim()) {
      return NextResponse.json(
        { error: 'Lütfen önce en az bir tarihî belge metni ekleyin.' },
        { status: 400 }
      );
    }

    // Step 1: Generate 1-minute dialogue script between Muhabir and Tarihçi
    const gazeteContext = gazete
      ? `Gazete Manşeti: ${gazete.manset}\nSpot: ${gazete.spot}\nÖne Çıkan Alıntılar: ${JSON.stringify(gazete.alintilar || [])}`
      : '';

    const qaContext = Array.isArray(interviewQAs) && interviewQAs.length > 0
      ? `Öğrenci Röportajı:\n${interviewQAs.map((q: { soru: string; cevap: string }) => `- Soru: ${q.soru}\n  Cevap: ${q.cevap}`).join('\n')}`
      : '';

    const scriptPrompt = `AŞAĞIDAKİ TARİHÎ BELGELERE VE GAZETE HABERİNE DAYANARAK 1 DAKİKALIK (YAKLAŞIK 120-150 KELİME) BİR TARİH PODCAST DİYALOĞU YAZ.

TARİHÎ BELGELER:
${documents.trim()}

${gazeteContext}
${qaContext}

DİYALOG KURALLARI:
1. Konuşmacılar: Yalnızca "Muhabir" ve "Tarihçi".
2. Senaryo yaklaşık 1 dakika (toplam 6-8 karşılıklı konuşma turu) sürmelidir.
3. KESİNLİKLE TARİHÎ KİŞİLERİ CANLANDIRMA. Tarihçi de Mustafa Kemal veya başka bir lider gibi konuşmaz; tarafsız bir uzman olarak belgeleri açıklar.
4. Yalnızca yüklenen belgelerdeki gerçekleri kullanın.
5. Bir liderin sözü geçecekse belgedeki cümle tırnak içinde ("...") doğrudan aktarılmalıdır.
6. Muhabir meraklı, dinamik bir radyo sunucusu gibi açar ve yönlendirir; Tarihçi ise belgelere dayanarak berrak, öğretici açıklamalar yapar.`;

    const scriptResponse = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: scriptPrompt,
      config: {
        systemInstruction: SISTEM_TALIMATI,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            baslik: { type: Type.STRING, description: 'Podcast bölüm başlığı' },
            ozet: { type: Type.STRING, description: '1 cümlelik bölüm özeti' },
            diyalog: {
              type: Type.ARRAY,
              description: 'Muhabir ve Tarihçi arasındaki karşılıklı replikler',
              items: {
                type: Type.OBJECT,
                properties: {
                  speaker: {
                    type: Type.STRING,
                    description: 'Muhabir veya Tarihçi',
                  },
                  text: {
                    type: Type.STRING,
                    description: 'Konuşulan replik cümlesi',
                  },
                },
                required: ['speaker', 'text'],
              },
            },
          },
          required: ['baslik', 'ozet', 'diyalog'],
        },
      },
    });

    const scriptJsonRaw = scriptResponse.text?.trim() || '{}';
    const parsedScript = JSON.parse(scriptJsonRaw);

    const rawDiyalog: Array<{ speaker: string; text: string }> = parsedScript.diyalog || [];
    const normalizedDiyalog: PodcastSatiri[] = rawDiyalog.map((item) => ({
      speaker: item.speaker.toLowerCase().includes('tarih') ? 'Tarihçi' : 'Muhabir',
      text: item.text.replace(/^(Muhabir|Tarihçi):\s*/i, '').trim(),
    }));

    // Step 2: Call Gemini TTS model (gemini-3.8-flash-tts) with dual-speaker multiSpeakerVoiceConfig
    let audioBase64: string | undefined;
    let audioMimeType = 'audio/wav';
    let ttsError: string | undefined;

    try {
      const parts = normalizedDiyalog.map((line) => ({
        text: `${line.speaker}: ${line.text}`,
        speechMetadata: {
          speaker: line.speaker,
          style: line.speaker === 'Muhabir'
            ? 'Enthusiastic and clear news broadcaster'
            : 'Calm, authoritative, articulate historian',
        },
      }));

      const ttsResponse = await ai.models.generateContent({
        model: GEMINI_TTS_MODEL,
        contents: [
          {
            role: 'user',
            parts,
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            multiSpeakerVoiceConfig: {
              speakerVoiceConfigs: [
                {
                  speaker: 'Muhabir',
                  voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: 'Puck' },
                  },
                },
                {
                  speaker: 'Tarihçi',
                  voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: 'Kore' },
                  },
                },
              ],
            },
          },
        },
      });

      const audioData = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (audioData) {
        audioBase64 = audioData;
      }
    } catch (ttsErr: unknown) {
      console.warn('Gemini Multi-Speaker TTS çağrısı uyarısı:', ttsErr);
      ttsError = ttsErr instanceof Error ? ttsErr.message : 'TTS seslendirmesi oluşturulamadı.';
    }

    return NextResponse.json({
      podcast: {
        baslik: parsedScript.baslik || 'Tarih Muhabiri Podcast',
        ozet: parsedScript.ozet || 'Belgelerin Işığında Tarihî Gerçekler',
        diyalog: normalizedDiyalog,
        audioBase64,
        audioMimeType,
        ttsError,
      },
    });
  } catch (error: unknown) {
    console.error('Podcast API hatası:', error);
    const message = error instanceof Error ? error.message : 'Podcast oluşturulamadı.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
