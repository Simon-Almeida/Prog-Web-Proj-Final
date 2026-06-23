"use client";

// Sidebar plus main shell. Slices 4 and 6 of the FRONTEND-PLAN: shell wires
// the sidebar placeholder items into Next.js Link components pointing at the
// Phase 2 CRUD routes. Bootstrap classes are kept at their defaults: no
// custom theming, no custom fonts, no animations.

import type { ReactNode } from "react";
import Link from "next/link";
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
            <li className="mb-2">
              <Link href="/conversations" className="text-decoration-none">
                Conversations
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/machines" className="text-decoration-none">
                Machines
              </Link>
            </li>
          </ul>
        </aside>
        <main className="flex-grow-1 p-4">{children}</main>
      </div>
    </Container>
  );
}
