export default function SectionTitle({ children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ width: 3, height: 20, background: "#c9a84c" }} />
      <div style={{ fontSize: 14, letterSpacing: 4, color: "#c9a84c" }}>{children}</div>
      <div style={{ flex: 1, height: 1, background: "#1a1a0a" }} />
    </div>
  );
}
