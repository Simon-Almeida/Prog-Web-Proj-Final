import Brand from "@/components/Brand";
import { site } from "@/components/site-config";

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1.5rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <span className="aurum-glow" />
      <Brand size="lg" className="aurum-fade" />
      <p className="aurum-display aurum-fade" style={{ fontSize: "2rem", margin: 0 }}>
        {site.tagline}
      </p>
      <p className="aurum-mono aurum-fade" style={{ animationDelay: "0.2s" }}>
        {site.microLabel}
      </p>
    </main>
  );
}
