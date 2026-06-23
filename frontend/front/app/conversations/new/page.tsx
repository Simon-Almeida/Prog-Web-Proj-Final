"use client";

// Phase 2, slice 7: conversation create page. Loads tabs and tags on mount,
// renders the shared ConversationForm, and on submit calls strapi.conversations
// .create with the Strapi 5 connect syntax for tab (N-1) and tags (M-N).
// Navigates back to the list on success, and back one route on cancel.

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Alert, Spinner } from "react-bootstrap";
import {
  ConversationForm,
  type ConversationFormValues,
} from "@/components/ConversationForm";
import { AppShell } from "@/components/AppShell";
import { strapi } from "@/lib/strapi";
import type {
  StrapiCollectionResponse,
  Tab,
  Tag,
} from "@/lib/types";

export default function NewConversationPage() {
  const router = useRouter();
  const [tabs, setTabs] = useState<Tab[] | null>(null);
  const [tags, setTags] = useState<Tag[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setError(null);
        const [tabsRes, tagsRes] = await Promise.all([
          strapi.tabs.find() as Promise<StrapiCollectionResponse<Tab>>,
          strapi.tags.find() as Promise<StrapiCollectionResponse<Tag>>,
        ]);
        setTabs(tabsRes.data);
        setTags(tagsRes.data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load tabs and tags from Strapi.",
        );
        setTabs([]);
        setTags([]);
      }
    };
    void load();
  }, []);

  const handleSubmit = useCallback(
    async (values: ConversationFormValues) => {
      setSubmitting(true);
      setError(null);
      try {
        await strapi.conversations.create({
          title: values.title,
          tab: { connect: [{ documentId: values.tabDocumentId }] },
          tags: { connect: values.tagDocumentIds.map((documentId) => ({ documentId })) },
        });
        router.push("/conversations");
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to create the conversation.",
        );
        setSubmitting(false);
      }
    },
    [router],
  );

  const handleCancel = useCallback(() => {
    router.back();
  }, [router]);

  const ready = tabs !== null && tags !== null;

  return (
    <AppShell>
      <h1 className="h3 mb-3">New Conversation</h1>

      {error && (
        <Alert variant="danger" className="mb-3">
          {error}
        </Alert>
      )}

      {!ready ? (
        <div className="d-flex align-items-center gap-2 text-muted">
          <Spinner animation="border" size="sm" />
          <span>Loading tabs and tags...</span>
        </div>
      ) : (
        <ConversationForm
          tabs={tabs}
          tags={tags}
          submitting={submitting}
          submitLabel="Create"
          onSubmit={(values) => void handleSubmit(values)}
          onCancel={handleCancel}
        />
      )}
    </AppShell>
  );
}
