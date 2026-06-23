"use client";

// Phase 2, slice 8: conversation edit page. Reads the conversation by
// documentId (from the dynamic route segment) with tab and tags populated,
// pre-fills the shared ConversationForm, and on submit calls
// strapi.conversations.update using the Strapi 5 set syntax so the full new
// relation set is applied (replacing unchecked tags instead of stacking
// additions).

import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Alert, Spinner } from "react-bootstrap";
import {
  ConversationForm,
  type ConversationFormValues,
} from "@/components/ConversationForm";
import { AppShell } from "@/components/AppShell";
import { strapi } from "@/lib/strapi";
import type {
  Conversation,
  StrapiCollectionResponse,
  StrapiSingleResponse,
  Tab,
  Tag,
} from "@/lib/types";

export default function EditConversationPage() {
  const router = useRouter();
  const params = useParams<{ documentId: string }>();
  const documentId = params?.documentId ?? "";

  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [tabs, setTabs] = useState<Tab[] | null>(null);
  const [tags, setTags] = useState<Tag[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!documentId) return;
    const load = async () => {
      try {
        setError(null);
        const [convRes, tabsRes, tagsRes] = await Promise.all([
          strapi.conversations.findOne(documentId, {
            populate: "tab,tags",
          }) as Promise<StrapiSingleResponse<Conversation>>,
          strapi.tabs.find() as Promise<StrapiCollectionResponse<Tab>>,
          strapi.tags.find() as Promise<StrapiCollectionResponse<Tag>>,
        ]);
        setConversation(convRes.data);
        setTabs(tabsRes.data);
        setTags(tagsRes.data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load conversation from Strapi.",
        );
      }
    };
    void load();
  }, [documentId]);

  const handleSubmit = useCallback(
    async (values: ConversationFormValues) => {
      setSubmitting(true);
      setError(null);
      try {
        await strapi.conversations.update(documentId, {
          title: values.title,
          tab: { set: [{ documentId: values.tabDocumentId }] },
          tags: { set: values.tagDocumentIds },
        });
        router.push("/conversations");
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to update the conversation.",
        );
        setSubmitting(false);
      }
    },
    [documentId, router],
  );

  const handleCancel = useCallback(() => {
    router.back();
  }, [router]);

  const ready = conversation !== null && tabs !== null && tags !== null;

  return (
    <AppShell>
      <h1 className="h3 mb-3">Edit Conversation</h1>

      {error && (
        <Alert variant="danger" className="mb-3">
          {error}
        </Alert>
      )}

      {!ready ? (
        <div className="d-flex align-items-center gap-2 text-muted">
          <Spinner animation="border" size="sm" />
          <span>Loading conversation...</span>
        </div>
      ) : (
        <ConversationForm
          tabs={tabs}
          tags={tags}
          initial={{
            title: conversation.title,
            tabDocumentId: conversation.tab?.documentId ?? "",
            tagDocumentIds: (conversation.tags ?? []).map(
              (tag) => tag.documentId,
            ),
          }}
          submitting={submitting}
          submitLabel="Save"
          onSubmit={(values) => void handleSubmit(values)}
          onCancel={handleCancel}
        />
      )}
    </AppShell>
  );
}
