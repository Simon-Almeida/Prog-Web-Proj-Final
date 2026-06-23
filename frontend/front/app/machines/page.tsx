"use client";

// Phase 2, slice 9: machines + models registry page. Read-only browser over
// the Machine and Model content-types. One Bootstrap Accordion item per
// machine showing its name and baseUrl, with a nested list of its Models.
// Admin create/edit/delete is Phase 4.

import { useEffect, useState } from "react";
import { Accordion, Alert, Spinner } from "react-bootstrap";
import { AppShell } from "@/components/AppShell";
import { strapi } from "@/lib/strapi";
import type {
  Machine,
  StrapiCollectionResponse,
} from "@/lib/types";

export default function MachinesPage() {
  const [machines, setMachines] = useState<Machine[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setError(null);
        const res = (await strapi.machines.find({
          populate: "models",
        })) as StrapiCollectionResponse<Machine>;
        setMachines(res.data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load machines from Strapi.",
        );
        setMachines([]);
      }
    };
    void load();
  }, []);

  return (
    <AppShell>
      <h1 className="h3 mb-3">Machines</h1>

      {error && (
        <Alert variant="danger" className="mb-3">
          {error}
        </Alert>
      )}

      {machines === null ? (
        <div className="d-flex align-items-center gap-2 text-muted">
          <Spinner animation="border" size="sm" />
          <span>Loading machines...</span>
        </div>
      ) : machines.length === 0 ? (
        <p className="text-muted mb-0">
          No machines seeded yet. Seed sample data from the Strapi admin.
        </p>
      ) : (
        <Accordion defaultActiveKey="0" alwaysOpen>
          {machines.map((machine, idx) => {
            const models = machine.models ?? [];
            return (
              <Accordion.Item eventKey={String(idx)} key={machine.documentId}>
                <Accordion.Header>
                  <span className="me-2 fw-semibold">{machine.name}</span>
                  <span className="text-muted small">{machine.baseUrl}</span>
                </Accordion.Header>
                <Accordion.Body>
                  {models.length > 0 ? (
                    <ul className="list-unstyled mb-0">
                      {models.map((model) => (
                        <li
                          key={model.documentId}
                          className="border-bottom py-2"
                        >
                          <div className="fw-semibold">{model.name}</div>
                          {(model.displayName || model.paramSize) && (
                            <div className="small text-muted">
                              {[model.displayName, model.paramSize]
                                .filter(Boolean)
                                .join(" / ")}
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-muted small">
                      No models registered on this machine yet.
                    </span>
                  )}
                </Accordion.Body>
              </Accordion.Item>
            );
          })}
        </Accordion>
      )}
    </AppShell>
  );
}
