import { NextRequest, NextResponse } from 'next/server';
import { ai } from '@/lib/gemini';
import { GEMINI_MODEL, SISTEM_TALIMATI } from '@/lib/talimat';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { documents, question, chatHistory } = body;

    if (!documents || typeof documents !== 'string' || !documents.trim()) {
      return NextResponse.json(
        { error: 'Lütfen önce en az bir tarihî belge metni ekleyin.' },
        { status: 400 }
      );
    }

    if (!question || typeof question !== 'string' || !question.trim()) {
      return NextResponse.json(
        { error: 'Lütfen bir soru girin.' },
        { status: 400 }
      );
    }

    // Build user prompt combining documents and query
    const prompt = `YÜKLENEN TARİHÎ BELGELER:
${documents.trim()}

ÖĞRENCİ / ÖĞRETMEN SORUSU:
"${question.trim()}"

GÖREV:
Yukarıdaki belgeleri inceleyerek muhabir kimliğinle soruyu cevapla.
Unutma:
- Tarihî kişileri kesinlikle canlandırma; onların ağzından ("ben") konuşma. Üçüncü şahısla anlat.
- Yalnızca yukarıdaki belgelerdeki bilgiyi kullan. Dışarıdan veya genel tarih bilginden hiçbir şey ekleme.
- Bir kişinin sözünü aktaracaksan, belgedeki cümleyi tırnak içinde, hiç değiştirmeden aktar.
- Cevap belgelerde yoksa aynen şu cümleyi söyle: "Bu belgelerde bu sorunun cevabı yok. Ders kitabınızda veya başka bir birincil kaynakta araştırabilirsiniz."
- Tarihî bir kişi gibi konuşman istenirse kibarca reddet ve muhabir olarak devam et.
- Cevabın en fazla 5 cümle olsun.
- Cevabın SONUNA mutlaka dayandığın belgeyi köşeli parantez içinde yaz (Ör: [Belge 1] veya [Belge 2] veya [Belge 1, Belge 2]).`;

    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    // Optional past chat history (if any)
    if (Array.isArray(chatHistory)) {
      for (const item of chatHistory.slice(-4)) {
        if (item.role === 'user' && item.content) {
          contents.push({ role: 'user', parts: [{ text: item.content }] });
        } else if (item.role === 'assistant' && item.content) {
          contents.push({ role: 'model', parts: [{ text: item.content }] });
        }
      }
    }

    contents.push({ role: 'user', parts: [{ text: prompt }] });

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents,
      config: {
        systemInstruction: SISTEM_TALIMATI,
        temperature: 0.2, // Lower temperature to strictly adhere to primary sources
      },
    });

    const reply = response.text || 'Cevap üretilemedi.';

    // Extract citation brackets if present for UI highlighting
    const citationRegex = /\[Belge\s*(\d+(?:\s*,\s*Belge\s*\d+)*)\]/gi;
    const matches = reply.match(citationRegex);
    const dayanakBelgeler = matches ? Array.from(new Set(matches)) : [];

    return NextResponse.json({
      reply,
      dayanakBelgeler,
    });
  } catch (error: unknown) {
    console.error('Roportaj API hatası:', error);
    const message = error instanceof Error ? error.message : 'Bilinmeyen bir hata oluştu.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
