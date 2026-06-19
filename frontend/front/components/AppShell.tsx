"use client";

// Sidebar plus main shell. Slice 4 of the FRONTEND-PLAN: shell only, no real
// routes yet. Phase 2 will swap the placeholder nav items for Next.js Link
// components wired into the CRUD pages. Bootstrap classes are kept at their
// defaults: no custom theming, no custom fonts, no animations.

import type { ReactNode } from "react";
import { Container } from "react-bootstrap";

export interface AppShellProps {
  children?: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <Container fluid className="p-0" style={{ minHeight: "100vh" }}>
      <div className="d-flex" style={{ minHeight: "100vh" }}>
        <aside
          className="border-end bg-light p-3"
          style={{ width: 240, flexShrink: 0 }}
        >
          <h2 className="h5 mb-4">Local-AI Chat</h2>
          <ul className="list-unstyled mb-0">
            <li className="mb-2">Conversations</li>
            <li className="mb-2">Machines</li>
            <li className="mb-2">Models</li>
            <li className="mb-2">Tabs</li>
            <li className="mb-2">Tags</li>
          </ul>
        </aside>
        <main className="flex-grow-1 p-4">{children}</main>
      </div>
    </Container>
  );
}
