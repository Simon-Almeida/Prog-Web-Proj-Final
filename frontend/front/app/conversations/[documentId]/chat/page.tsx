"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { Alert, Button, Form, Spinner } from "react-bootstrap";
import { AppShell } from "@/components/AppShell";
import { strapi } from "@/lib/strapi";
import type {
  Conversation,
  Machine,
  Message,
  StrapiCollectionResponse,
  StrapiSingleResponse,
} from "@/lib/types";

interface ModelOption {
  modelName: string;
  displayName: string;
  baseUrl: string;
  machineDocumentId: string;
}

export default function ChatPage() {
  const { documentId } = useParams<{ documentId: string }>();

  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [models, setModels] = useState<ModelOption[]>([]);
  const [selectedModel, setSelectedModel] = useState<ModelOption | null>(null);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [streamBuffer, setStreamBuffer] = useState("");
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [convRes, machinesRes] = await Promise.all([
          strapi.conversations.findOne(documentId, {
            populate: "messages,tab",
          }) as Promise<StrapiSingleResponse<Conversation>>,
          strapi.machines.find({ populate: "models" }) as Promise<
            StrapiCollectionResponse<Machine>
          >,
        ]);
        const conv = convRes.data;
        setConversation(conv);
        setMessages(
          [...(conv.messages ?? [])].sort((a, b) => a.id - b.id),
        );
        const opts: ModelOption[] = [];
        for (const machine of machinesRes.data) {
          for (const model of machine.models ?? []) {
            opts.push({
              modelName: model.name,
              displayName: `${model.displayName ?? model.name} (${machine.name})`,
              baseUrl: machine.baseUrl,
              machineDocumentId: machine.documentId,
            });
          }
        }
        setModels(opts);
        if (opts.length > 0) setSelectedModel(opts[0]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load.");
      }
    };
    void load();
  }, [documentId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamBuffer]);

  const send = async () => {
    if (!input.trim() || !selectedModel || streaming) return;
    setError(null);

    const userText = input.trim();
    setInput("");

    const userMsg = await strapi.messages.create({
      role: "user",
      content: userText,
      conversation: { connect: [{ documentId }] },
    }) as StrapiSingleResponse<Message>;
    const savedUser = userMsg.data;
    setMessages((prev) => [...prev, savedUser]);

    setStreaming(true);
    setStreamBuffer("");

    try {
      const history = [...messages, savedUser].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: selectedModel.modelName,
          machineDocumentId: selectedModel.machineDocumentId,
          messages: history,
          systemPrompt: conversation?.tab?.systemPrompt ?? undefined,
        }),
      });

      if (!res.ok || !res.body) {
        throw new Error(`Chat proxy error: ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;
        setStreamBuffer(fullText);
      }

      const assistantMsg = await strapi.messages.create({
        role: "assistant",
        content: fullText,
        conversation: { connect: [{ documentId }] },
      }) as StrapiSingleResponse<Message>;
      setMessages((prev) => [...prev, assistantMsg.data]);
      setStreamBuffer("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Chat failed.");
    } finally {
      setStreaming(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send();
    }
  };

  if (!conversation) {
    return (
      <AppShell>
        <div className="d-flex align-items-center gap-2 text-muted">
          <Spinner animation="border" size="sm" />
          <span>Loading conversation...</span>
        </div>
      </AppShell>
    );
  }

  const allMessages = [
    ...messages,
    ...(streamBuffer
      ? [{ id: -1, documentId: "__stream__", role: "assistant" as const, content: streamBuffer }]
      : []),
  ];

  return (
    <AppShell>
      <div className="d-flex flex-column" style={{ height: "calc(100vh - 2rem)" }}>
        <div className="d-flex align-items-center justify-content-between mb-3 flex-shrink-0">
          <h1 className="h4 mb-0">{conversation.title}</h1>
          <Form.Select
            style={{ width: 280 }}
            value={selectedModel?.modelName ?? ""}
            onChange={(e) =>
              setSelectedModel(models.find((m) => m.modelName === e.target.value) ?? null)
            }
          >
            {models.length === 0 && <option>No models available</option>}
            {models.map((m) => (
              <option key={m.modelName} value={m.modelName}>
                {m.displayName}
              </option>
            ))}
          </Form.Select>
        </div>

        {error && (
          <Alert variant="danger" className="flex-shrink-0">
            {error}
          </Alert>
        )}

        <div
          className="flex-grow-1 overflow-auto border rounded p-3 mb-3 bg-light"
        >
          {allMessages.length === 0 && (
            <p className="text-muted mb-0">No messages yet. Say something!</p>
          )}
          {allMessages.map((msg) => (
            <div
              key={msg.documentId}
              className={`mb-3 d-flex ${msg.role === "user" ? "justify-content-end" : "justify-content-start"}`}
            >
              <div
                className={`p-2 rounded ${msg.role === "user" ? "bg-primary text-white" : "bg-white border"}`}
                style={{ maxWidth: "75%", whiteSpace: "pre-wrap", wordBreak: "break-word" }}
              >
                {msg.content}
                {msg.documentId === "__stream__" && (
                  <span className="opacity-50">|</span>
                )}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div className="d-flex gap-2 flex-shrink-0">
          <Form.Control
            as="textarea"
            rows={2}
            placeholder="Type a message... (Enter to send, Shift+Enter for newline)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            disabled={streaming}
          />
          <Button
            onClick={() => void send()}
            disabled={streaming || !input.trim() || !selectedModel}
            style={{ minWidth: 80 }}
          >
            {streaming ? <Spinner animation="border" size="sm" /> : "Send"}
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
