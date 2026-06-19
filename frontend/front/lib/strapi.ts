// Typed fetch wrapper for the local Strapi 5 backend.
// Base URL is read from NEXT_PUBLIC_STRAPI_URL (default http://localhost:1337).
// All six Strapi collections from the shared schema in PLAN.md are exposed:
// Machine, Model, Tab, Tag, Conversation, Message.
//
// This module is a skeleton with typed function signatures. Payload shapes are
// `unknown` here so this slice compiles without the shared interfaces, which
// are introduced in slice 3 (frontend/front/lib/types.ts) and applied to these
// signatures in lockstep with the backend.

const BASE_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";

type ID = string | number;

async function strapiFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string> | undefined),
  };

  const res = await fetch(url, { ...init, headers });

  if (!res.ok) {
    throw new Error(
      `Strapi request failed: ${res.status} ${res.statusText} at ${path}`,
    );
  }

  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

// Strapi 5 wraps mutation payloads in { data: <payload> }.
function envelope(data: unknown): string {
  return JSON.stringify({ data });
}

function collection(slug: string) {
  return {
    find: () => strapiFetch(`/api/${slug}`),
    findOne: (id: ID) => strapiFetch(`/api/${slug}/${id}`),
    create: (data: unknown) =>
      strapiFetch(`/api/${slug}`, {
        method: "POST",
        body: envelope(data),
      }),
    update: (id: ID, data: unknown) =>
      strapiFetch(`/api/${slug}/${id}`, {
        method: "PUT",
        body: envelope(data),
      }),
    delete: (id: ID) =>
      strapiFetch(`/api/${slug}/${id}`, { method: "DELETE" }),
  };
}

export const strapi = {
  machines: collection("machines"),
  models: collection("models"),
  tabs: collection("tabs"),
  tags: collection("tags"),
  conversations: collection("conversations"),
  messages: collection("messages"),
};

export type StrapiClient = typeof strapi;
