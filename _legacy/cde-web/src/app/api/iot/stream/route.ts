import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
        async start(controller) {
            const sendEvent = (data: any) => {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
            };

            // Keep the connection alive with a heartbeat
            const interval = setInterval(() => {
                const event = {
                    type: "braille_update",
                    data: {
                        timestamp: new Date().toISOString(),
                        intensity: Math.random() > 0.7 ? "high" : "low",
                        message: "Tactile feedback active"
                    }
                };
                sendEvent(event);
            }, 5000);

            req.signal.addEventListener("abort", () => {
                clearInterval(interval);
                controller.close();
            });
        },
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        },
    });
}
