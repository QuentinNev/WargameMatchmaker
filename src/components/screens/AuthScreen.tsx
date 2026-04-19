import { useState } from "react";
import { useTranslation } from "react-i18next";
import { inputStyle } from "../../styles";
import SectionTitle from "../ui/SectionTitle";
import Label from "../ui/Label";
import ActionButton from "../ui/ActionButton";

interface Props {
  // Returns an error message on failure, null on success.
  onSendCode: (pseudo: string, email: string) => Promise<string | null>;
}

export default function AuthScreen({ onSendCode }: Props) {
  const { t } = useTranslation();
  const [pseudo, setPseudo] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!pseudo.trim()) { setError(t("auth.errorPseudo")); return; }
    if (!email.trim() || !email.includes("@")) { setError(t("auth.errorEmail")); return; }
    setError(null);
    setLoading(true);
    const err = await onSendCode(pseudo.trim(), email.trim().toLowerCase());
    setLoading(false);
    if (err) setError(err);
  };

  return (
    <div style={{ animation: "fadeIn 0.3s ease", maxWidth: 480, margin: "80px auto 0" }}>
      <SectionTitle>{t("auth.title")}</SectionTitle>

      <form
        onSubmit={e => { e.preventDefault(); handleSubmit(); }}
        style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 20 }}
      >
        <div>
          <Label>{t("auth.pseudoLabel")}</Label>
          <input
            name="username"
            autoComplete="username"
            value={pseudo}
            onChange={e => setPseudo(e.target.value)}
            placeholder={t("auth.pseudoPlaceholder")}
            style={inputStyle}
            autoFocus
            disabled={loading}
          />
        </div>
        <div>
          <Label>{t("auth.emailLabel")}</Label>
          <input
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder={t("auth.emailPlaceholder")}
            style={inputStyle}
            disabled={loading}
          />
        </div>

        {error && (
          <div style={{ fontSize: 11, color: "#8a3a3a", letterSpacing: 1 }}>⚠ {error}</div>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
          <ActionButton onClick={handleSubmit}>
            {loading ? t("auth.submitting") : t("auth.submit")}
          </ActionButton>
        </div>
      </form>

      <div style={{ marginTop: 48, fontSize: 10, color: "#2a2a1a", letterSpacing: 1, textAlign: "center" }}>
        {t("auth.hint")}
      </div>
    </div>
  );
}
