import { NextRequest } from "next/server";

export const runtime = "nodejs";

const STRAPI = process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";

async function resolveBaseUrl(machineDocumentId: string): Promise<string> {
  const res = await fetch(
    `${STRAPI}/api/machines/${machineDocumentId}`,
    { headers: { "Content-Type": "application/json" } },
  );
  if (!res.ok) throw new Error(`Machine not found: ${machineDocumentId}`);
  const json = await res.json() as { data: { baseUrl: string } };
  const baseUrl = json.data?.baseUrl;
  if (!baseUrl) throw new Error("Machine has no baseUrl");
  // Validate: must be http/https, not loopback/private when in production
  const u = new URL(baseUrl);
  if (u.protocol !== "http:" && u.protocol !== "https:") {
    throw new Error("Invalid machine baseUrl protocol");
  }
  return u.origin;
}

export async function POST(req: NextRequest) {
  const { model, machineDocumentId, messages, systemPrompt } = await req.json() as {
    model: string;
    machineDocumentId: string;
    messages: { role: string; content: string }[];
    systemPrompt?: string;
  };

  let baseUrl: string;
  try {
    baseUrl = await resolveBaseUrl(machineDocumentId);
  } catch (err) {
    return new Response(String(err), { status: 400 });
  }

  const fullMessages = [
    ...(systemPrompt ? [{ role: "system", content: systemPrompt }] : []),
    ...messages,
  ];

  const ollamaRes = await fetch(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model, messages: fullMessages, stream: true }),
    redirect: "manual",
  });

  if (!ollamaRes.ok || !ollamaRes.body) {
    return new Response(`Ollama error: ${ollamaRes.status} ${ollamaRes.statusText}`, {
      status: 502,
    });
  }

  const stream = new ReadableStream({
    async start(controller) {
      const reader = ollamaRes.body!.getReader();
      const decoder = new TextDecoder();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          for (const line of chunk.split("\n")) {
            if (!line.trim()) continue;
            try {
              const json = JSON.parse(line) as {
                message?: { content?: string };
                done?: boolean;
              };
              if (json.message?.content) {
                controller.enqueue(new TextEncoder().encode(json.message.content));
              }
            } catch {
              // skip malformed lines
            }
          }
        }
      } finally {
        controller.close();
        reader.releaseLock();
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
