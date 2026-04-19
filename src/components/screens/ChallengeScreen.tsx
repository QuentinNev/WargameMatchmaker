import { useState } from "react";
import { FULL_DAYS, TIME_SLOTS } from "../../constants";
import { inputStyle } from "../../styles";
import SectionTitle from "../ui/SectionTitle";
import Label from "../ui/Label";
import ActionButton from "../ui/ActionButton";
import PlayerCard from "../ui/PlayerCard";

export default function ChallengeScreen({ challenged, profile, availability, showToast, onBack, onSent }) {
  const [message, setMessage] = useState("");

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <SectionTitle>ENVOYER UN DÉFI</SectionTitle>

      <div style={{ marginTop: 24, padding: 24, border: "1px solid #c9a84c", background: "rgba(201,168,76,0.03)" }}>
        <div style={{ fontSize: 12, color: "#5a5a3a", letterSpacing: 2, marginBottom: 16 }}>ORDRE DE BATAILLE</div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 16, alignItems: "center", marginBottom: 24 }}>
          <PlayerCard name={profile.name || "Vous"} rank={profile.rank} you />
          <div style={{ fontSize: 24, color: "#c9a84c", textAlign: "center" }}>⚔</div>
          <PlayerCard name={challenged.name} rank={challenged.rank} />
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: "#4a4a3a", letterSpacing: 2, marginBottom: 8 }}>CRÉNEAUX COMMUNS</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {FULL_DAYS.map((d, di) => {
              const mine = new Set(availability[di] || []);
              const theirs = new Set(challenged.availability[di] || []);
              const common = [...mine].filter(s => theirs.has(s));
              if (common.length === 0) return null;
              return common.map(s => (
                <span key={`${di}-${s}`} style={{
                  fontSize: 10, padding: "3px 10px",
                  border: "1px solid #3a5a3a", color: "#7aca7a",
                  background: "rgba(74,138,74,0.1)", letterSpacing: 1,
                }}>{d} {TIME_SLOTS[s]}</span>
              ));
            })}
          </div>
          {challenged.overlap === 0 && (
            <div style={{ fontSize: 11, color: "#5a3a3a" }}>⚠ Aucun créneau commun — proposer une date manuelle</div>
          )}
        </div>

        <Label>MESSAGE TACTIQUE (OPTIONNEL)</Label>
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Je vous propose une bataille d'encerclement sur la carte de Normandie..."
          style={{ ...inputStyle, height: 80, resize: "vertical" }}
        />

        <div style={{ display: "flex", gap: 12, marginTop: 20, justifyContent: "flex-end" }}>
          <ActionButton secondary onClick={onBack}>← ANNULER</ActionButton>
          <ActionButton onClick={() => {
            showToast(`Défi envoyé à ${challenged.name} !`);
            setTimeout(onSent, 300);
          }}>
            ⚔ ENVOYER LE DÉFI
          </ActionButton>
        </div>
      </div>
    </div>
  );
}
