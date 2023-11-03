import { EASY, MEDIUM, EXPERT } from "./constants";

export function DifficultySelector({
  selectedMode,
  easyMode,
  mediumMode,
  expertMode,
}) {
  return (
    <div className="difficulty-controls">
      Select difficulty:
      <br />
      <button
        className={`easy-mode ${selectedMode === EASY ? "active" : ""}`}
        onClick={() => easyMode()}
      >
        Easy<span>9x9</span>
      </button>
      <button
        className={`medium-mode ${selectedMode === MEDIUM ? "active" : ""}`}
        onClick={() => mediumMode()}
      >
        Medium<span>16x16</span>
      </button>
      <button
        className={`expert-mode ${selectedMode === EXPERT ? "active" : ""}`}
        onClick={() => expertMode()}
      >
        Expert<span>16x30</span>
      </button>
    </div>
  );
}
