import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { inputStyle } from "../../styles";
import SectionTitle from "../ui/SectionTitle";
import Label from "../ui/Label";
import ActionButton from "../ui/ActionButton";

interface Props {
  email: string;
  // Returns an error message on failure, null on success.
  onVerify: (code: string) => Promise<string | null>;
  onBack: () => void;
  onResend: () => void;
}

export default function VerifyScreen({ email, onVerify, onBack, onResend }: Props) {
  const { t } = useTranslation();
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
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

  const handleSubmit = async () => {
    const code = digits.join("");
    if (code.length < 6) { setError(t("verify.errorDigits")); return; }
    setLoading(true);
    setError(null);
    const err = await onVerify(code);
    setLoading(false);
    if (err) {
      setError(err);
      setDigits(["", "", "", "", "", ""]);
      refs.current[0]?.focus();
    }
    // On success App.tsx handles navigation — no need to do anything here.
  };

  return (
    <div style={{ animation: "fadeIn 0.3s ease", maxWidth: 480, margin: "80px auto 0" }}>
      <SectionTitle>{t("verify.title")}</SectionTitle>

      <div style={{ marginTop: 24, fontSize: 12, color: "#5a5a3a", letterSpacing: 1 }}>
        {t("verify.codeSentTo")} <span style={{ color: "#c9b99a" }}>{email}</span>
      </div>

      <div style={{ marginTop: 28 }}>
        <Label>{t("verify.codeLabel")}</Label>
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
              disabled={loading}
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
          <ActionButton secondary onClick={onBack}>{t("verify.back")}</ActionButton>
          <button onClick={onResend} style={{
            background: "transparent", border: "none", color: "#3a3a2a",
            cursor: "pointer", fontSize: 10, letterSpacing: 2,
            fontFamily: "'Courier New', monospace", textAlign: "left", padding: 0,
          }}>
            {t("verify.resend")}
          </button>
        </div>
        <ActionButton onClick={handleSubmit}>
          {loading ? t("verify.validating") : t("verify.submit")}
        </ActionButton>
      </div>
    </div>
  );
}
