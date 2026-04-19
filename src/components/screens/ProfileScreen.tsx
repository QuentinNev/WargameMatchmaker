import type { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import type { Profile } from "../../types";
import { GAME_TYPES, RANKS } from "../../constants";
import { chipStyle, inputStyle } from "../../styles";
import SectionTitle from "../ui/SectionTitle";
import Label from "../ui/Label";
import ActionButton from "../ui/ActionButton";

interface Props {
  profile: Profile;
  setProfile: Dispatch<SetStateAction<Profile>>;
  onNext: () => void;
}

export default function ProfileScreen({ profile, setProfile, onNext }: Props) {
  const { t } = useTranslation();

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <SectionTitle>{t("profile.title")}</SectionTitle>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginTop: 24 }}>
        <div>
          <Label>{t("profile.nameLabel")}</Label>
          <div style={{
            ...inputStyle,
            color: "#c9a84c",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            {profile.name}
            <span style={{ fontSize: 9, color: "#3a3a2a", letterSpacing: 2 }}>{t("profile.nameBadge")}</span>
          </div>

          <Label style={{ marginTop: 20 }}>{t("profile.rankLabel")}</Label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {RANKS.map(r => (
              <button key={r} onClick={() => setProfile(p => ({ ...p, rank: r }))} style={{
                ...chipStyle,
                borderColor: profile.rank === r ? "#c9a84c" : "#2a2a1a",
                color: profile.rank === r ? "#c9a84c" : "#5a5a4a",
                background: profile.rank === r ? "rgba(201,168,76,0.1)" : "transparent",
              }}>{t(`ranks.${r}`, { defaultValue: r })}</button>
            ))}
          </div>
        </div>

        <div>
          <Label>{t("profile.gameTypesLabel")}</Label>
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
            <div style={{ fontSize: 10, color: "#3a3a2a", letterSpacing: 2, marginBottom: 8 }}>{t("profile.reportTitle")}</div>
            <div style={{ fontSize: 12, color: "#5a5a3a" }}>
              {!profile.name && !profile.gameTypes.length && t("profile.reportEmpty")}
              {profile.name && <span style={{ color: "#c9a84c" }}>{profile.name}</span>}
              {profile.rank && <span> — {t(`ranks.${profile.rank}`, { defaultValue: profile.rank })}</span>}
              {profile.gameTypes.length > 0 && (
                <div style={{ marginTop: 4 }}>
                  {t("profile.specialization")} {profile.gameTypes.map(g => GAME_TYPES.find(x => x.id === g)?.label).join(", ")}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 32, display: "flex", justifyContent: "flex-end" }}>
        <ActionButton onClick={onNext}>
          {t("profile.next")}
        </ActionButton>
      </div>
    </div>
  );
}
