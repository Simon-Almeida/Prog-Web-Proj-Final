"use client";

// Phase 2, slice 6: conversations list page. Reads conversations from Strapi
// with tab and tags populated, renders a Bootstrap Table, supports delete
// (with confirm dialog and re-fetch) and links to the create/edit pages.

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Alert, Button, Spinner, Table } from "react-bootstrap";
import { AppShell } from "@/components/AppShell";
import { strapi } from "@/lib/strapi";
import type { Conversation, StrapiCollectionResponse } from "@/lib/types";

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<Conversation[] | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      const res = (await strapi.conversations.find({
        populate: "tab,tags",
      })) as StrapiCollectionResponse<Conversation>;
      setConversations(res.data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load conversations from Strapi.",
      );
      setConversations([]);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  const handleDelete = async (conversation: Conversation) => {
    const confirmed = window.confirm(
      `Delete conversation "${conversation.title}"? This cannot be undone.`,
    );
    if (!confirmed) return;
    setDeletingId(conversation.documentId);
    try {
      await strapi.conversations.delete(conversation.documentId);
      await load();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : `Failed to delete conversation "${conversation.title}".`,
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <AppShell>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h1 className="h3 mb-0">Conversations</h1>
        <Link href="/conversations/new" className="btn btn-primary">
          New Conversation
        </Link>
      </div>

      {error && (
        <Alert variant="danger" className="mb-3">
          {error}
        </Alert>
      )}

      {conversations === null ? (
        <div className="d-flex align-items-center gap-2 text-muted">
          <Spinner animation="border" size="sm" />
          <span>Loading conversations...</span>
        </div>
      ) : conversations.length === 0 ? (
        <p className="text-muted mb-0">
          No conversations yet. Click &quot;New Conversation&quot; to create one.
        </p>
      ) : (
        <Table striped hover responsive className="align-middle">
          <thead>
            <tr>
              <th>Title</th>
              <th>Tab</th>
              <th>Tags</th>
              <th style={{ width: 220 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {conversations.map((conversation) => {
              const tags = conversation.tags ?? [];
              return (
              <tr key={conversation.documentId}>
                <td>{conversation.title}</td>
                <td>
                  {conversation.tab?.label ?? (
                    <span className="text-muted">None</span>
                  )}
                </td>
                <td>
                  {tags.length > 0 ? (
                    tags.map((tag) => (
                      <span
                        key={tag.documentId}
                        className="badge bg-secondary me-1"
                      >
                        {tag.name}
                      </span>
                    ))
                  ) : (
                    <span className="text-muted">None</span>
                  )}
                </td>
                <td>
                  <div className="d-flex gap-2">
                    <Link
                      href={`/conversations/${conversation.documentId}/edit`}
                      className="btn btn-sm btn-outline-primary"
                    >
                      Edit
                    </Link>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline-danger"
                      onClick={() => void handleDelete(conversation)}
                      disabled={deletingId === conversation.documentId}
                    >
                      {deletingId === conversation.documentId ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        "Delete"
                      )}
                    </Button>
                  </div>
                </td>
              </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </AppShell>
  );
}
