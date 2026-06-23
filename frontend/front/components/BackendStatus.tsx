"use client";

import { useEffect, useState } from "react";

const BASE_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL ?? "http://localhost:1337";

export function BackendStatus() {
  const [ok, setOk] = useState<boolean | null>(null);

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch(`${BASE_URL}/_health`, { cache: "no-store" });
        setOk(res.ok);
      } catch {
        setOk(false);
      }
    };
    check();
    const id = setInterval(check, 5000);
    return () => clearInterval(id);
  }, []);

  const color =
    ok === null ? "#888888" : ok ? "#22c55e" : "#ef4444";

  return (
    <span
      title={
        ok === null ? "Checking backend..." : ok ? "Backend online" : "Backend offline"
      }
      style={{
        position: "fixed",
        top: 14,
        right: 18,
        width: 12,
        height: 12,
        borderRadius: "50%",
        backgroundColor: color,
        boxShadow: ok ? `0 0 7px 2px ${color}` : undefined,
        zIndex: 9999,
        transition: "background-color 0.3s, box-shadow 0.3s",
      }}
    />
  );
}
