import { useState } from "react";
import { inputStyle } from "../../styles";
import SectionTitle from "../ui/SectionTitle";
import Label from "../ui/Label";
import ActionButton from "../ui/ActionButton";

interface Props {
  onSendCode: (pseudo: string, email: string) => void;
}

export default function AuthScreen({ onSendCode }: Props) {
  const [pseudo, setPseudo] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!pseudo.trim()) { setError("Entrez votre pseudo de commandant"); return; }
    if (!email.trim() || !email.includes("@")) { setError("Entrez un email valide"); return; }
    setError(null);
    onSendCode(pseudo.trim(), email.trim().toLowerCase());
  };

  return (
    <div style={{ animation: "fadeIn 0.3s ease", maxWidth: 480, margin: "80px auto 0" }}>
      <SectionTitle>ACCÈS AU SYSTÈME</SectionTitle>

      <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 20 }}>
        <div>
          <Label>PSEUDO DE COMMANDANT</Label>
          <input
            value={pseudo}
            onChange={e => setPseudo(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
            placeholder="Ex: Général Moreau..."
            style={inputStyle}
            autoFocus
          />
        </div>
        <div>
          <Label>EMAIL DE CONTACT</Label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
            placeholder="commandant@example.com"
            style={inputStyle}
          />
        </div>

        {error && (
          <div style={{ fontSize: 11, color: "#8a3a3a", letterSpacing: 1 }}>⚠ {error}</div>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
          <ActionButton onClick={handleSubmit}>
            ENVOYER LE CODE →
          </ActionButton>
        </div>
      </div>

      <div style={{ marginTop: 48, fontSize: 10, color: "#2a2a1a", letterSpacing: 1, textAlign: "center" }}>
        Un code à usage unique sera envoyé à votre adresse email.
      </div>
    </div>
  );
}
