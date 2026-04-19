import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import type { Availability } from "../../types";
import { TIME_SLOTS } from "../../constants";
import { thStyle } from "../../styles";
import { toDateKey, getWeekStart, getWeekDates, formatDateKey, formatDayHeader, formatWeekRange } from "../../utils";
import SectionTitle from "../ui/SectionTitle";
import ActionButton from "../ui/ActionButton";

interface HoverCell { d: string; s: number }

interface Props {
  availability: Availability;
  totalSlots: number;
  handleMouseDown: (day: string, slot: number) => void;
  handleMouseEnter: (day: string, slot: number) => void;
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
  const { t, i18n } = useTranslation();
  const [weekOffset, setWeekOffset] = useState(0);

  const locale = i18n.language === "fr" ? "fr-FR" : "en-US";
  const weekStart = getWeekStart(weekOffset);
  const weekDates = getWeekDates(weekStart);
  const today = toDateKey(new Date());

  const weekLabel = formatWeekRange(weekDates[0], weekDates[6], locale);

  // All selected dates across all weeks, sorted chronologically.
  const allSelectedDates = Object.entries(availability)
    .filter(([, slots]) => slots && slots.length > 0)
    .sort(([a], [b]) => a.localeCompare(b));

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <SectionTitle>{t("availability.title")}</SectionTitle>
      <div style={{ fontSize: 11, color: "#4a4a3a", letterSpacing: 2, marginBottom: 20 }}>
        {t("availability.hint")} · {t("availability.slotsSelected", { count: totalSlots })}
      </div>

      {/* Week navigation */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
        <button
          onClick={() => setWeekOffset(w => w - 1)}
          disabled={weekOffset === 0}
          style={{
            background: "transparent",
            border: "1px solid #2a2a1a",
            color: weekOffset === 0 ? "#2a2a1a" : "#c9b99a",
            padding: "4px 12px", cursor: weekOffset === 0 ? "default" : "pointer",
            fontSize: 14, fontFamily: "'Courier New', monospace",
          }}>←</button>
        <div style={{ fontSize: 12, color: "#8a7a5a", letterSpacing: 2, minWidth: 200, textAlign: "center" }}>
          {weekLabel}
        </div>
        <button
          onClick={() => setWeekOffset(w => w + 1)}
          style={{
            background: "transparent", border: "1px solid #2a2a1a",
            color: "#c9b99a", padding: "4px 12px", cursor: "pointer",
            fontSize: 14, fontFamily: "'Courier New', monospace",
          }}>→</button>
      </div>

      {/* Availability grid */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ ...thStyle, width: 90, textAlign: "left", paddingLeft: 8 }}>{t("availability.timeHeader")}</th>
              {weekDates.map(date => {
                const key = toDateKey(date);
                const isPast = key < today;
                const { weekday, dayMonth } = formatDayHeader(date, locale);
                return (
                  <th key={key} style={{ ...thStyle, textAlign: "center", opacity: isPast ? 0.35 : 1 }}>
                    <div>{weekday}</div>
                    <div style={{ fontSize: 9, color: "#5a5a3a" }}>{dayMonth}</div>
                    <div style={{ fontSize: 9, color: "#3a3a2a", fontWeight: "normal" }}>
                      {availability[key]?.length ?? 0}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {TIME_SLOTS.map((slot, si) => (
              <tr key={slot}>
                <td style={{ padding: "4px 8px", fontSize: 10, color: "#4a4a3a", letterSpacing: 1, borderRight: "1px solid #1a1a0a" }}>
                  {slot}
                </td>
                {weekDates.map(date => {
                  const key = toDateKey(date);
                  const isPast = key < today;
                  const active = availability[key]?.includes(si);
                  const hover = hoverCell?.d === key && hoverCell?.s === si;
                  return (
                    <td key={key}
                      onMouseDown={isPast ? undefined : () => handleMouseDown(key, si)}
                      onMouseEnter={() => {
                        setHoverCell({ d: key, s: si });
                        if (!isPast) handleMouseEnter(key, si);
                      }}
                      onMouseLeave={() => setHoverCell(null)}
                      style={{
                        width: 80, height: 36,
                        cursor: isPast ? "default" : "crosshair",
                        opacity: isPast ? 0.3 : 1,
                        border: "1px solid #1a1a0a",
                        background: active
                          ? "rgba(201,168,76,0.25)"
                          : hover && !isPast ? "rgba(201,168,76,0.08)" : "#0d0f0a",
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

      {/* Summary of all selected dates across all weeks */}
      {allSelectedDates.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 10, color: "#3a3a2a", letterSpacing: 2, marginBottom: 8 }}>
            {t("availability.savedDates")}
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {allSelectedDates.map(([dateKey, slots]) => (
              <div key={dateKey} style={{
                padding: "4px 10px",
                border: "1px solid #2a2a1a",
                fontSize: 10, color: "#8a7a5a", letterSpacing: 1,
              }}>
                {formatDateKey(dateKey, locale)}: <span style={{ color: "#c9a84c" }}>{slots?.length}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 32 }}>
        <ActionButton secondary onClick={onBack}>{t("availability.back")}</ActionButton>
        <ActionButton onClick={() => {
          if (totalSlots === 0) { showToast(t("availability.errorNoSlots")); return; }
          onFindMatches();
        }}>
          {t("availability.findMatches")}
        </ActionButton>
      </div>
    </div>
  );
}
