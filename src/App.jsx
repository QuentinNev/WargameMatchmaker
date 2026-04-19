import { useState, useEffect } from "react";
import { MOCK_PLAYERS } from "./constants";
import { computeMatchScore } from "./utils";
import ProfileScreen from "./components/screens/ProfileScreen";
import AvailabilityScreen from "./components/screens/AvailabilityScreen";
import MatchesScreen from "./components/screens/MatchesScreen";
import ChallengeScreen from "./components/screens/ChallengeScreen";

const NAV_ITEMS = [
  { key: "profile", label: "PROFIL" },
  { key: "availability", label: "DISPO" },
  { key: "matches", label: "MATCHS" },
];

export default function App() {
  const [screen, setScreen] = useState("profile");
  const [profile, setProfile] = useState({ name: "", rank: "Recrue", gameTypes: [] });
  const [availability, setAvailability] = useState({});
  const [matches, setMatches] = useState([]);
  const [challenged, setChallenged] = useState(null);
  const [toast, setToast] = useState(null);
  const [hoverCell, setHoverCell] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  // dragValue locks the intended action (add or remove) for the whole drag gesture,
  // so moving over already-toggled cells mid-drag doesn't flip them back.
  const [dragValue, setDragValue] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  // forceVal is passed during drag so all cells in a gesture follow the same
  // add/remove intent decided on mousedown. Without it a single click just toggles.
  const toggleSlot = (day, slot, forceVal) => {
    setAvailability(prev => {
      const daySlots = prev[day] ? [...prev[day]] : [];
      const idx = daySlots.indexOf(slot);
      const shouldAdd = forceVal !== undefined ? forceVal : idx === -1;
      if (shouldAdd && idx === -1) daySlots.push(slot);
      else if (!shouldAdd && idx !== -1) daySlots.splice(idx, 1);
      const next = { ...prev };
      // Drop the key entirely when the day has no slots left, so Object.values()
      // on availability stays clean and totalSlots counts correctly.
      if (daySlots.length === 0) delete next[day];
      else next[day] = daySlots;
      return next;
    });
  };

  const handleMouseDown = (day, slot) => {
    const active = availability[day]?.includes(slot);
    setIsDragging(true);
    setDragValue(!active);
    toggleSlot(day, slot, !active);
  };

  const handleMouseEnter = (day, slot) => {
    if (isDragging) toggleSlot(day, slot, dragValue);
  };

  // Listen on window, not on the table: the user can release the mouse outside
  // the grid (e.g. on the header) and we still need to end the drag cleanly.
  useEffect(() => {
    const up = () => setIsDragging(false);
    window.addEventListener("mouseup", up);
    return () => window.removeEventListener("mouseup", up);
  }, []);

  const findMatches = () => {
    const scored = MOCK_PLAYERS
      .map(p => ({ ...p, ...computeMatchScore(availability, profile.gameTypes, p) }))
      .sort((a, b) => b.score - a.score);
    setMatches(scored);
    setScreen("matches");
  };

  const totalSlots = Object.values(availability).reduce((s, v) => s + v.length, 0);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0c0e",
      color: "#c9b99a",
      fontFamily: "'Courier New', monospace",
      userSelect: "none",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Grid background */}
      <div style={{
        position: "fixed", inset: 0, opacity: 0.04,
        backgroundImage: "linear-gradient(#c9b99a 1px, transparent 1px), linear-gradient(90deg, #c9b99a 1px, transparent 1px)",
        backgroundSize: "40px 40px", pointerEvents: "none",
      }} />

      {/* Scanline overlay */}
      <div style={{
        position: "fixed", inset: 0, opacity: 0.03, pointerEvents: "none",
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.5) 2px, rgba(0,0,0,0.5) 4px)",
      }} />

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", top: 24, left: "50%", transform: "translateX(-50%)",
          background: "#1a4a1a", border: "1px solid #3a8a3a", color: "#7dff7d",
          padding: "10px 24px", zIndex: 999, fontSize: 13, letterSpacing: 2,
          boxShadow: "0 0 20px rgba(61,220,61,0.3)",
        }}>
          ✓ {toast}
        </div>
      )}

      {/* Header */}
      <div style={{
        borderBottom: "1px solid #2a2a1a",
        padding: "16px 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "rgba(10,12,8,0.9)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{
            width: 40, height: 40, border: "2px solid #8a7a5a",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20, color: "#c9a84c",
          }}>⚔</div>
          <div>
            <div style={{ fontSize: 18, color: "#c9a84c", letterSpacing: 4, fontWeight: "bold" }}>
              WARGAME MATCHMAKER
            </div>
            <div style={{ fontSize: 10, color: "#5a5a3a", letterSpacing: 3 }}>
              SYSTÈME DE COORDINATION TACTIQUE v2.4
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {NAV_ITEMS.map(({ key, label }) => (
            <button key={key}
              onClick={() => key !== "matches" ? setScreen(key) : (matches.length ? setScreen(key) : null)}
              style={{
                background: screen === key ? "#2a2a0a" : "transparent",
                border: `1px solid ${screen === key ? "#c9a84c" : "#2a2a1a"}`,
                color: screen === key ? "#c9a84c" : "#5a5a3a",
                padding: "6px 16px", cursor: "pointer", fontSize: 11,
                letterSpacing: 2, transition: "all 0.2s",
                opacity: key === "matches" && !matches.length ? 0.3 : 1,
              }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px" }}>
        {screen === "profile" && (
          <ProfileScreen
            profile={profile}
            setProfile={setProfile}
            showToast={showToast}
            onNext={() => setScreen("availability")}
          />
        )}
        {screen === "availability" && (
          <AvailabilityScreen
            availability={availability}
            totalSlots={totalSlots}
            handleMouseDown={handleMouseDown}
            handleMouseEnter={handleMouseEnter}
            hoverCell={hoverCell}
            setHoverCell={setHoverCell}
            showToast={showToast}
            onBack={() => setScreen("profile")}
            onFindMatches={findMatches}
          />
        )}
        {screen === "matches" && (
          <MatchesScreen
            matches={matches}
            profile={profile}
            onChallenge={p => { setChallenged(p); setScreen("challenge"); }}
            onBack={() => setScreen("availability")}
          />
        )}
        {screen === "challenge" && challenged && (
          <ChallengeScreen
            challenged={challenged}
            profile={profile}
            availability={availability}
            showToast={showToast}
            onBack={() => setScreen("matches")}
            onSent={() => setScreen("matches")}
          />
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        input::placeholder, textarea::placeholder { color: #2a2a1a; }
        input:focus, textarea:focus { outline: none; border-color: #4a4a2a !important; }
        button:hover { filter: brightness(1.2); }
        ::-webkit-scrollbar { width: 4px; height: 4px; background: #0a0c0e; }
        ::-webkit-scrollbar-thumb { background: #2a2a1a; }
      `}</style>
    </div>
  );
}
