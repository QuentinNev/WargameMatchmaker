import type { Dispatch, SetStateAction } from "react";
import type { Availability } from "../../types";
import { DAYS, FULL_DAYS, TIME_SLOTS } from "../../constants";
import { thStyle } from "../../styles";
import SectionTitle from "../ui/SectionTitle";
import ActionButton from "../ui/ActionButton";

interface HoverCell {
  d: number;
  s: number;
}

interface Props {
  availability: Availability;
  totalSlots: number;
  handleMouseDown: (day: number, slot: number) => void;
  handleMouseEnter: (day: number, slot: number) => void;
  hoverCell: HoverCell | null;
  setHoverCell: Dispatch<SetStateAction<HoverCell | null>>;
  showToast: (msg: string) => void;
  onBack: () => void;
  onFindMatches: () => void;
}

export default function AvailabilityScreen({
  availability, totalSlots,
  handleMouseDown, handleMouseEnter,
  hoverCell, setHoverCell,
  showToast, onBack, onFindMatches,
}: Props) {
  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <SectionTitle>FENÊTRES TACTIQUES DISPONIBLES</SectionTitle>
      <div style={{ fontSize: 11, color: "#4a4a3a", letterSpacing: 2, marginBottom: 24 }}>
        CLIQUEZ OU GLISSEZ POUR SÉLECTIONNER VOS CRÉNEAUX · {totalSlots} CRÉNEAU(X) SÉLECTIONNÉ(S)
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ ...thStyle, width: 90, textAlign: "left", paddingLeft: 8 }}>HEURE</th>
              {DAYS.map((d, i) => (
                <th key={d} style={{ ...thStyle, textAlign: "center" }}>
                  <div>{d}</div>
                  <div style={{ fontSize: 9, color: "#3a3a2a", fontWeight: "normal" }}>
                    {availability[i]?.length ?? 0}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TIME_SLOTS.map((slot, si) => (
              <tr key={slot}>
                <td style={{ padding: "4px 8px", fontSize: 10, color: "#4a4a3a", letterSpacing: 1, borderRight: "1px solid #1a1a0a" }}>
                  {slot}
                </td>
                {DAYS.map((_, di) => {
                  const active = availability[di]?.includes(si);
                  const hover = hoverCell?.d === di && hoverCell?.s === si;
                  return (
                    <td key={di}
                      onMouseDown={() => handleMouseDown(di, si)}
                      onMouseEnter={() => { setHoverCell({ d: di, s: si }); handleMouseEnter(di, si); }}
                      onMouseLeave={() => setHoverCell(null)}
                      style={{
                        width: 80, height: 36, cursor: "crosshair",
                        border: "1px solid #1a1a0a",
                        background: active
                          ? "rgba(201,168,76,0.25)"
                          : hover ? "rgba(201,168,76,0.08)" : "#0d0f0a",
                        transition: "background 0.1s",
                        position: "relative",
                      }}>
                      {active && (
                        <div style={{
                          position: "absolute", inset: 3,
                          background: "rgba(201,168,76,0.15)",
                          border: "1px solid rgba(201,168,76,0.4)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          <div style={{ width: 6, height: 6, background: "#c9a84c", opacity: 0.8 }} />
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
        {FULL_DAYS.map((d, i) => {
          const count = availability[i]?.length ?? 0;
          return (
            <div key={d} style={{
              padding: "6px 12px",
              border: `1px solid ${count > 0 ? "#2a2a1a" : "#161610"}`,
              fontSize: 10,
              color: count > 0 ? "#8a7a5a" : "#2a2a1a",
              letterSpacing: 1,
            }}>
              {d}: <span style={{ color: count > 0 ? "#c9a84c" : "#2a2a1a" }}>{count}</span>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 32 }}>
        <ActionButton secondary onClick={onBack}>← PROFIL</ActionButton>
        <ActionButton onClick={() => {
          if (totalSlots === 0) { showToast("Sélectionnez au moins un créneau"); return; }
          onFindMatches();
        }}>
          TROUVER DES ADVERSAIRES →
        </ActionButton>
      </div>
    </div>
  );
}
