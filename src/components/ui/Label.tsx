export default function Label({ children, style }) {
  return (
    <div style={{ fontSize: 10, color: "#4a4a3a", letterSpacing: 2, marginBottom: 8, marginTop: 4, ...style }}>
      {children}
    </div>
  );
}
