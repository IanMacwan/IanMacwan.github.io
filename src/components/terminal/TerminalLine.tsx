import type { TerminalLine as TLine } from "../../store/terminalStore";
import { HELP_TEXT } from "../../content/terminalData";
import Neofetch from "./Neofetch";

interface Props {
  line: TLine;
  index: number;
}

export default function TerminalLine({ line, index }: Props) {
  const delay = Math.min(index * 30, 600);

  if (line.kind === "input") {
    return (
      <div
        className="term-input-line"
        style={{ animationDelay: `${delay}ms` }}
      >
        <span className="prompt-user">ian</span>
        <span className="prompt-at">@</span>
        <span className="prompt-host">arch</span>
        <span className="prompt-sep"> </span>
        <span className="prompt-path">~/portfolio</span>
        <span className="prompt-git"> (main)</span>
        <span className="prompt-arrow"> ❯ </span>
        <span className="prompt-cmd">{line.text}</span>
      </div>
    );
  }

  if (line.type === "neofetch") {
    return (
      <div style={{ animationDelay: `${delay}ms` }}>
        <Neofetch />
      </div>
    );
  }

  if (line.type === "help") {
    return (
      <div
        className="help-output"
        style={{ animationDelay: `${delay}ms` }}
      >
        <div className="help-title">available commands</div>
        {HELP_TEXT.map(({ cmd, desc }) => (
          <div key={cmd} className="help-row">
            <span className="help-cmd">{cmd}</span>
            <span className="help-desc">{desc}</span>
          </div>
        ))}
      </div>
    );
  }

  if (line.type === "error") {
    return (
      <div
        className="term-error"
        style={{ animationDelay: `${delay}ms` }}
      >
        <span className="err-prefix">bash: </span>
        <span className="err-text">{line.text}</span>
        <span className="err-suffix">
          : command not found. Type <span className="err-hint">help</span> for available commands.
        </span>
      </div>
    );
  }

  return (
    <pre
      className="term-output-text line-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      {line.text}
    </pre>
  );
}
