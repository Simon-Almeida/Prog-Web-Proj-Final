// frontend/front/lib/types.ts
//
// TypeScript interfaces for the six Strapi 5 content-types listed in PLAN.md:
// Machine, Model, Tab, Tag, Conversation, Message. This file is the shared
// contract between this frontend and the Strapi backend under
// backend/back/src/api/<name>/content-types/<name>/schema.json. Keep it in
// lockstep with the backend.
//
// Strapi 5 returns flat objects (no v4 attributes wrapper) and exposes both a
// numeric `id` and a string `documentId`. Mutating endpoints take `documentId`.
// Relation fields are optional because Strapi only includes them when the
// caller passes `?populate=...`.

// Minimal shape of Strapi's users-permissions user. Expanded in Phase 4 when
// auth lands. Only the fields needed to type-check Conversation.user today.
export interface User {
  id: number;
  documentId: string;
  username?: string;
  email?: string;
}

export interface Machine {
  id: number;
  documentId: string;
  name: string;
  baseUrl: string;
  models?: Model[];
}

export interface Model {
  id: number;
  documentId: string;
  name: string;
  displayName?: string;
  paramSize?: string;
  machine?: Machine | null;
  conversations?: Conversation[];
}

export interface Tab {
  id: number;
  documentId: string;
  key: string;
  label: string;
  systemPrompt?: string;
  accent?: string;
  conversations?: Conversation[];
}

export interface Tag {
  id: number;
  documentId: string;
  name: string;
  conversations?: Conversation[];
}

export interface Conversation {
  id: number;
  documentId: string;
  title: string;
  user?: User | null;
  tab?: Tab | null;
  models?: Model[];
  tags?: Tag[];
  messages?: Message[];
}

export interface Message {
  id: number;
  documentId: string;
  role: "user" | "assistant" | "system";
  content: string;
  tokens?: number;
  conversation?: Conversation | null;
}
