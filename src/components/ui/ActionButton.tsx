import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  onClick?: () => void;
  secondary?: boolean;
}

export default function ActionButton({ children, onClick, secondary }: Props) {
  return (
    <button onClick={onClick} style={{
      background: secondary ? "transparent" : "#c9a84c",
      border: `1px solid ${secondary ? "#2a2a1a" : "#c9a84c"}`,
      color: secondary ? "#5a5a3a" : "#0a0c0e",
      padding: "10px 24px",
      cursor: "pointer",
      fontSize: 11,
      letterSpacing: 3,
      fontFamily: "'Courier New', monospace",
      fontWeight: secondary ? "normal" : "bold",
      transition: "all 0.2s",
    }}>
      {children}
    </button>
  );
}
