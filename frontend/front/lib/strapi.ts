// Typed fetch wrapper for the local Strapi 5 backend.
// Base URL is read from NEXT_PUBLIC_STRAPI_URL (default http://localhost:1337).
// All six Strapi collections from the shared schema in PLAN.md are exposed:
// Machine, Model, Tab, Tag, Conversation, Message.

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

// Build a query string from params. Converts comma-separated populate values
// to Strapi 5 array notation (?populate[0]=tab&populate[1]=tags) because
// Strapi 5 does not support the comma-separated populate string format.
function qs(params?: Record<string, string>): string {
  if (!params) return "";
  const parts: string[] = [];
  for (const [key, val] of Object.entries(params)) {
    if (key === "populate" && val !== "*" && val.includes(",")) {
      val.split(",").forEach((field, i) => {
        parts.push(`populate[${i}]=${encodeURIComponent(field.trim())}`);
      });
    } else {
      parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(val)}`);
    }
  }
  return "?" + parts.join("&");
}

function collection(slug: string) {
  return {
    find: (params?: Record<string, string>) =>
      strapiFetch(`/api/${slug}${qs(params)}`),
    findOne: (id: ID, params?: Record<string, string>) =>
      strapiFetch(`/api/${slug}/${id}${qs(params)}`),
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
