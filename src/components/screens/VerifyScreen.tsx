import { useState, useRef, useEffect } from "react";
import { inputStyle } from "../../styles";
import SectionTitle from "../ui/SectionTitle";
import Label from "../ui/Label";
import ActionButton from "../ui/ActionButton";

interface Props {
  email: string;
  // The actual code — exposed in UI because there is no backend to send emails.
  // In production, remove demoCode and rely solely on the emailed value.
  demoCode: string;
  onVerify: (code: string) => boolean;
  onBack: () => void;
  onResend: () => void;
}

export default function VerifyScreen({ email, demoCode, onVerify, onBack, onResend }: Props) {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  // Auto-focus first box on mount.
  useEffect(() => { refs.current[0]?.focus(); }, []);

  const handleChange = (i: number, val: string) => {
    // Only allow digits; take the last character in case the browser fires
    // onChange with the full pasted string instead of a single char.
    const digit = val.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[i] = digit;
    setDigits(next);
    if (digit && i < 5) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      refs.current[i - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!text) return;
    e.preventDefault();
    const next = [...digits];
    text.split("").forEach((d, i) => { next[i] = d; });
    setDigits(next);
    // Focus the box after the last pasted digit.
    refs.current[Math.min(text.length, 5)]?.focus();
  };

  const handleSubmit = () => {
    const code = digits.join("");
    if (code.length < 6) { setError("Entrez les 6 chiffres du code"); return; }
    const ok = onVerify(code);
    if (!ok) {
      setError("Code incorrect. Vérifiez et réessayez.");
      setDigits(["", "", "", "", "", ""]);
      refs.current[0]?.focus();
    }
  };

  return (
    <div style={{ animation: "fadeIn 0.3s ease", maxWidth: 480, margin: "80px auto 0" }}>
      <SectionTitle>VÉRIFICATION D'IDENTITÉ</SectionTitle>

      <div style={{ marginTop: 24, fontSize: 12, color: "#5a5a3a", letterSpacing: 1 }}>
        Code envoyé à <span style={{ color: "#c9b99a" }}>{email}</span>
      </div>

      {/* Demo callout — remove this block once a real email service is wired up. */}
      <div style={{
        marginTop: 20, padding: "14px 18px",
        border: "1px solid #3a2a0a", background: "rgba(201,140,20,0.06)",
      }}>
        <div style={{ fontSize: 9, color: "#c9a84c", letterSpacing: 3, marginBottom: 8 }}>
          ⚠ MODE DÉMO — AUCUN EMAIL ENVOYÉ
        </div>
        <div style={{ fontSize: 11, color: "#5a5a3a", marginBottom: 12 }}>
          En production ce code serait envoyé par email. Pour tester, utilisez le code ci-dessous :
        </div>
        <div style={{
          fontSize: 28, letterSpacing: 10, color: "#c9a84c", textAlign: "center",
          padding: "8px 0", border: "1px solid #3a2a0a", background: "#0a0c08",
          fontWeight: "bold",
        }}>
          {demoCode}
        </div>
      </div>

      <div style={{ marginTop: 28 }}>
        <Label>CODE DE VÉRIFICATION</Label>
        <div style={{ display: "flex", gap: 8 }} onPaste={handlePaste}>
          {digits.map((d, i) => (
            <input
              key={i}
              ref={el => { refs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={e => handleChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
              style={{
                ...inputStyle,
                width: 44, textAlign: "center",
                fontSize: 20, letterSpacing: 0, padding: "10px 0",
              }}
            />
          ))}
        </div>

        {error && (
          <div style={{ marginTop: 10, fontSize: 11, color: "#8a3a3a", letterSpacing: 1 }}>⚠ {error}</div>
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 28, alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <ActionButton secondary onClick={onBack}>← MODIFIER L'EMAIL</ActionButton>
          <button onClick={onResend} style={{
            background: "transparent", border: "none", color: "#3a3a2a",
            cursor: "pointer", fontSize: 10, letterSpacing: 2,
            fontFamily: "'Courier New', monospace", textAlign: "left", padding: 0,
          }}>
            RENVOYER LE CODE
          </button>
        </div>
        <ActionButton onClick={handleSubmit}>VALIDER →</ActionButton>
      </div>
    </div>
  );
}
