interface Props {
  label: string;
  value: number;
  color: string;
}

export default function ScoreBadge({ label, value, color }: Props) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 4, marginLeft: 8 }}>
      <span style={{ fontSize: 9, color: "#3a3a2a", letterSpacing: 1 }}>{label}</span>
      <span style={{
        fontSize: 13, color, fontWeight: "bold",
        border: `1px solid ${color}22`, padding: "0 5px",
        background: `${color}11`,
      }}>{value}</span>
    </div>
  );
}
