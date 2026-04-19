import { useTranslation } from "react-i18next";
import type { MatchResult, Profile } from "../../types";
import { GAME_TYPES } from "../../constants";
import SectionTitle from "../ui/SectionTitle";
import ScoreBadge from "../ui/ScoreBadge";
import ActionButton from "../ui/ActionButton";

interface Props {
  matches: MatchResult[];
  profile: Profile;
  onChallenge: (player: MatchResult) => void;
  onBack: () => void;
}

export default function MatchesScreen({ matches, profile, onChallenge, onBack }: Props) {
  const { t } = useTranslation();

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <SectionTitle>{t("matches.title")}</SectionTitle>
      <div style={{ fontSize: 11, color: "#4a4a3a", letterSpacing: 2, marginBottom: 24 }}>
        {t("matches.subtitle", { count: matches.length })}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {matches.map((p, idx) => {
          const isTop = idx === 0;
          return (
            <div key={p.id} style={{
              border: `1px solid ${isTop ? "#c9a84c" : "#1e1e12"}`,
              background: isTop ? "rgba(201,168,76,0.05)" : "#0d0f0a",
              padding: "16px 20px",
              position: "relative",
              transition: "all 0.2s",
              cursor: "default",
            }}>
              {isTop && (
                <div style={{
                  position: "absolute", top: -1, right: 16,
                  background: "#c9a84c", color: "#0a0c0e",
                  fontSize: 9, letterSpacing: 3, padding: "2px 10px", fontWeight: "bold",
                }}>{t("matches.bestMatch")}</div>
              )}

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                  <div style={{
                    width: 48, height: 48,
                    border: `1px solid ${isTop ? "#c9a84c" : "#2a2a1a"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 22, background: "#0a0c08",
                  }}>
                    {["🎖", "⭐", "🏅", "🔫", "🗡"][idx % 5]}
                  </div>
                  <div>
                    <div style={{ fontSize: 16, color: isTop ? "#c9a84c" : "#a09070", letterSpacing: 2 }}>
                      {p.name}
                    </div>
                    <div style={{ fontSize: 10, color: "#4a4a3a", letterSpacing: 2 }}>
                      {t(`ranks.${p.rank}`, { defaultValue: p.rank })} · {p.games} {t("matches.games")} · {Math.round(p.wins / p.games * 100)}% {t("matches.wins")}
                    </div>
                    <div style={{ fontSize: 11, color: "#5a5a3a", marginTop: 4 }}>{p.bio}</div>
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div style={{ marginBottom: 8 }}>
                    <ScoreBadge label={t("matches.slotsLabel")} value={p.overlap} color="#4a8a4a" />
                    <ScoreBadge label={t("matches.gamesLabel")} value={p.gameOverlap} color="#4a6a8a" />
                  </div>
                  <div style={{ width: 140 }}>
                    <div style={{ fontSize: 9, color: "#3a3a2a", letterSpacing: 2, marginBottom: 3, textAlign: "right" }}>
                      {t("matches.compatibility")}
                    </div>
                    <div style={{ height: 4, background: "#1a1a0a", width: "100%" }}>
                      <div style={{
                        height: "100%",
                        width: `${Math.min(100, (p.score / 30) * 100)}%`,
                        background: isTop ? "#c9a84c" : "#4a4a2a",
                        transition: "width 0.5s ease",
                      }} />
                    </div>
                    <div style={{ fontSize: 10, color: isTop ? "#c9a84c" : "#5a5a3a", textAlign: "right", marginTop: 2 }}>
                      {p.score} {t("matches.pts")}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 6, marginTop: 12, alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", gap: 6 }}>
                  {p.gameTypes.map(g => {
                    const gt = GAME_TYPES.find(x => x.id === g);
                    const shared = profile.gameTypes.includes(g);
                    return (
                      <span key={g} style={{
                        fontSize: 10, padding: "2px 8px",
                        border: `1px solid ${shared ? "#4a8a4a" : "#1a1a0a"}`,
                        color: shared ? "#7aca7a" : "#3a3a2a",
                        background: shared ? "rgba(74,138,74,0.1)" : "transparent",
                      }}>{gt?.icon} {gt?.label}</span>
                    );
                  })}
                </div>
                <button onClick={() => onChallenge(p)} style={{
                  background: isTop ? "#c9a84c" : "transparent",
                  border: `1px solid ${isTop ? "#c9a84c" : "#2a2a1a"}`,
                  color: isTop ? "#0a0c0e" : "#5a5a3a",
                  padding: "6px 20px", cursor: "pointer",
                  fontSize: 11, letterSpacing: 2,
                  fontFamily: "'Courier New', monospace",
                  transition: "all 0.2s",
                }}>
                  {t("matches.challenge")}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-start" }}>
        <ActionButton secondary onClick={onBack}>{t("matches.back")}</ActionButton>
      </div>
    </div>
  );
}
