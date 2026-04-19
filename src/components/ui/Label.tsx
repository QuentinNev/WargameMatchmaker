import type { CSSProperties, ReactNode } from "react";

interface Props {
  children: ReactNode;
  style?: CSSProperties;
}

export default function Label({ children, style }: Props) {
  return (
    <div style={{ fontSize: 10, color: "#4a4a3a", letterSpacing: 2, marginBottom: 8, marginTop: 4, ...style }}>
      {children}
    </div>
  );
}
