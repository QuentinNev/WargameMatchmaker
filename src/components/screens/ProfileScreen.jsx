import { GAME_TYPES, RANKS } from "../../constants";
import { chipStyle } from "../../styles";
import SectionTitle from "../ui/SectionTitle";
import Label from "../ui/Label";
import ActionButton from "../ui/ActionButton";
import { inputStyle } from "../../styles";

export default function ProfileScreen({ profile, setProfile, showToast, onNext }) {
  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <SectionTitle>IDENTIFICATION DU COMMANDANT</SectionTitle>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginTop: 24 }}>
        <div>
          <Label>NOM DE COMMANDANT</Label>
          <input
            value={profile.name}
            onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
            placeholder="Ex: Général Moreau..."
            style={inputStyle}
          />

          <Label style={{ marginTop: 20 }}>GRADE</Label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {RANKS.map(r => (
              <button key={r} onClick={() => setProfile(p => ({ ...p, rank: r }))} style={{
                ...chipStyle,
                borderColor: profile.rank === r ? "#c9a84c" : "#2a2a1a",
                color: profile.rank === r ? "#c9a84c" : "#5a5a4a",
                background: profile.rank === r ? "rgba(201,168,76,0.1)" : "transparent",
              }}>{r}</button>
            ))}
          </div>
        </div>

        <div>
          <Label>THÉÂTRES D'OPÉRATIONS PRÉFÉRÉS</Label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {GAME_TYPES.map(g => {
              const sel = profile.gameTypes.includes(g.id);
              return (
                <button key={g.id} onClick={() => setProfile(p => ({
                  ...p,
                  gameTypes: sel ? p.gameTypes.filter(x => x !== g.id) : [...p.gameTypes, g.id],
                }))} style={{
                  ...chipStyle,
                  borderColor: sel ? "#c9a84c" : "#2a2a1a",
                  color: sel ? "#c9a84c" : "#5a5a4a",
                  background: sel ? "rgba(201,168,76,0.1)" : "transparent",
                  fontSize: 13,
                }}>{g.icon} {g.label}</button>
              );
            })}
          </div>

          <div style={{ marginTop: 24, padding: 16, border: "1px solid #1a1a0a", background: "#0d0f0a" }}>
            <div style={{ fontSize: 10, color: "#3a3a2a", letterSpacing: 2, marginBottom: 8 }}>RAPPORT DE TERRAIN</div>
            <div style={{ fontSize: 12, color: "#5a5a3a" }}>
              {!profile.name && !profile.gameTypes.length && "Aucun profil configuré."}
              {profile.name && <span style={{ color: "#c9a84c" }}>{profile.name}</span>}
              {profile.rank && <span> — {profile.rank}</span>}
              {profile.gameTypes.length > 0 && (
                <div style={{ marginTop: 4 }}>
                  Spécialisation : {profile.gameTypes.map(g => GAME_TYPES.find(x => x.id === g)?.label).join(", ")}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 32, display: "flex", justifyContent: "flex-end" }}>
        <ActionButton onClick={() => {
          if (!profile.name) { showToast("Entrez votre nom de commandant"); return; }
          onNext();
        }}>
          SUIVANT : DISPONIBILITÉS →
        </ActionButton>
      </div>
    </div>
  );
}
