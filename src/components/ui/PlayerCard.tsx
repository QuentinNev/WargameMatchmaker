export default function PlayerCard({ name, rank, you }) {
  return (
    <div style={{
      border: `1px solid ${you ? "#c9a84c" : "#2a2a1a"}`,
      padding: "12px 16px",
      textAlign: you ? "left" : "right",
      background: you ? "rgba(201,168,76,0.05)" : "#0d0f0a",
    }}>
      <div style={{ fontSize: 13, color: you ? "#c9a84c" : "#a09070", letterSpacing: 2 }}>{name}</div>
      <div style={{ fontSize: 10, color: "#4a4a3a" }}>{rank}</div>
      {you && <div style={{ fontSize: 9, color: "#3a5a3a", marginTop: 2 }}>VOUS</div>}
    </div>
  );
}
