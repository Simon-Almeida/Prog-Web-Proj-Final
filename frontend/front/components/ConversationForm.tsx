"use client";

// Shared form used by the conversation create (slice 7) and edit (slice 8)
// pages. Keeps the two pages thin: each only handles param/initial-state
// differences and the post-submit navigation. Bootstrap classes only, no
// custom theming.

import { useState } from "react";
import { Button, Form, Spinner } from "react-bootstrap";
import type { Tab, Tag } from "@/lib/types";

export interface ConversationFormValues {
  title: string;
  tabDocumentId: string;
  tagDocumentIds: string[];
}

export interface ConversationFormProps {
  tabs: Tab[];
  tags: Tag[];
  initial?: Partial<ConversationFormValues>;
  submitting?: boolean;
  submitLabel: string;
  onSubmit: (values: ConversationFormValues) => void;
  onCancel: () => void;
}

export function ConversationForm({
  tabs,
  tags,
  initial,
  submitting,
  submitLabel,
  onSubmit,
  onCancel,
}: ConversationFormProps) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [tabDocumentId, setTabDocumentId] = useState(
    initial?.tabDocumentId ?? "",
  );
  const [tagDocumentIds, setTagDocumentIds] = useState<string[]>(
    initial?.tagDocumentIds ?? [],
  );

  const toggleTag = (documentId: string, checked: boolean) => {
    setTagDocumentIds((prev) =>
      checked
        ? [...prev, documentId]
        : prev.filter((id) => id !== documentId),
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({ title, tabDocumentId, tagDocumentIds });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="conversation-title">
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="e.g. Code review for PR #42"
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="conversation-tab">
        <Form.Label>Tab</Form.Label>
        <Form.Select
          value={tabDocumentId}
          onChange={(e) => setTabDocumentId(e.target.value)}
          required
        >
          <option value="" disabled>
            Select a tab
          </option>
          {tabs.map((tab) => (
            <option key={tab.documentId} value={tab.documentId}>
              {tab.label}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3" controlId="conversation-tags">
        <Form.Label className="d-block">Tags</Form.Label>
        {tags.length === 0 ? (
          <div className="text-muted small">No tags available yet.</div>
        ) : (
          tags.map((tag) => (
            <Form.Check
              key={tag.documentId}
              type="checkbox"
              id={`tag-${tag.documentId}`}
              label={tag.name}
              checked={tagDocumentIds.includes(tag.documentId)}
              onChange={(e) => toggleTag(tag.documentId, e.target.checked)}
              className="mb-1"
            />
          ))
        )}
      </Form.Group>

      <div className="d-flex gap-2">
        <Button type="submit" variant="primary" disabled={submitting}>
          {submitting ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Saving
            </>
          ) : (
            submitLabel
          )}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </Button>
      </div>
    </Form>
  );
}
