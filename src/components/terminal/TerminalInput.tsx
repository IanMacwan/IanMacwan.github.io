import { useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { useTerminalStore } from "../../store/terminalStore";

interface Props {
  onCommand: (cmd: string) => void;
}

export default function TerminalInput({ onCommand }: Props) {
  const [value, setValue] = useState("");
  const { history, historyIndex, setHistoryIndex, pushHistory } =
    useTerminalStore();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const cmd = value.trim();
      if (cmd) {
        pushHistory(cmd);
        onCommand(cmd);
      }
      setValue("");
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = historyIndex + 1;
      const clamped = setHistoryIndex(next);
      if (history[clamped] !== undefined) setValue(history[clamped]);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = historyIndex - 1;
      const clamped = setHistoryIndex(next);
      setValue(clamped === -1 ? "" : history[clamped] ?? "");
      return;
    }

    if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      onCommand("clear");
      setValue("");
    }
  };

  return (
    <div className="term-input-row" onClick={() => inputRef.current?.focus()}>
      <span className="prompt-user">ian</span>
      <span className="prompt-at">@</span>
      <span className="prompt-host">arch</span>
      <span className="prompt-sep"> </span>
      <span className="prompt-path">~/portfolio</span>
      <span className="prompt-git"> (main)</span>
      <span className="prompt-arrow"> ❯ </span>
      <input
        ref={inputRef}
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="term-input-field"
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
      />
    </div>
  );
}
