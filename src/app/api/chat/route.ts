import { NextResponse } from 'next/server';
import { queryFaissRagVectorDb } from '@/lib/ragEngine';

export async function POST(req: Request) {
    try {
        let body: any = {};
        try {
            body = await req.json();
        } catch {
            const text = await req.text();
            body = JSON.parse(text || '{}');
        }

        const rawMessage = body.message || '';
        const lang = body.lang || 'el';

        const ragResult = await queryFaissRagVectorDb(rawMessage, lang as 'en' | 'el');

        return NextResponse.json({
            reply: ragResult.reply,
            sourceDoc: ragResult.sourceDoc,
            ragasScore: ragResult.ragasScore,
            confidence: ragResult.vectorConfidence,
            modelName: ragResult.modelName,
            timestamp: new Date().toISOString(),
            engine: ragResult.modelName
        });
    } catch (err: any) {
        console.error("Chatbot API error:", err);
        return NextResponse.json({ error: "Failed to process chat message", details: err?.message }, { status: 500 });
    }
}
