import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTerminalStore } from "../../store/terminalStore";
import {
  ABOUT_OUTPUT,
  EXPERIENCE_OUTPUT,
  CONTACT_OUTPUT,
} from "../../content/terminalData";
import TerminalLineComponent from "./TerminalLine";
import TerminalInput from "./TerminalInput";

export default function Terminal() {
  const navigate = useNavigate();
  const { lines, addInput, addOutput, clear, clearAndRefresh, hasBooted, markBooted } =
    useTerminalStore();
  const bottomRef = useRef<HTMLDivElement>(null);
  const [inputReady, setInputReady] = useState(false);
  const [chromeFade, setChromeFade] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setChromeFade(true), 80);

    if (!hasBooted) {
      const t2 = setTimeout(() => {
        addOutput("", "neofetch");
        markBooted();
        setInputReady(true);
      }, 350);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    } else {
      clearAndRefresh();
      setInputReady(true);
    }

    return () => clearTimeout(t1);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  const handleCommand = (raw: string) => {
    const cmd = raw.trim().toLowerCase();
    addInput(raw.trim());

    switch (cmd) {
      case "about":
        addOutput(ABOUT_OUTPUT, "text");
        break;
      case "experience":
        addOutput(EXPERIENCE_OUTPUT, "text");
        break;
      case "contact":
        addOutput(CONTACT_OUTPUT, "text");
        break;
      case "help":
        addOutput("", "help");
        break;
      case "clear":
        clear();
        addOutput("", "neofetch");
        break;
      case "projects":
      case "vim projects.md":
      case "nvim projects.md":
        addOutput("→ navigating to /projects ...", "text");
        setTimeout(() => navigate("/projects"), 350);
        break;
      case "blog":
      case "vim blog.md":
      case "nvim blog.md":
        addOutput("→ navigating to /blogs ...", "text");
        setTimeout(() => navigate("/blogs"), 350);
        break;
      case "neofetch":
      case "fastfetch":
        addOutput("", "neofetch");
        break;
      case "ls":
        addOutput("about.md  projects.md  experience.md  blog.md  contact.md", "text");
        break;
      case "pwd":
        addOutput("/home/ian/portfolio", "text");
        break;
      case "whoami":
        addOutput("ian", "text");
        break;
      case "uname -a":
        addOutput(
          "Linux arch 6.9.3-arch1-1 #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux",
          "text"
        );
        break;
      default:
        addOutput(cmd, "error");
    }
  };

  return (
    <div className={`terminal-root term-boot ${chromeFade ? "term-boot-in" : ""}`}>
      <div className="term-chrome">
        <div className="chrome-dots">
          <span className="dot dot-red" />
          <span className="dot dot-yellow" />
          <span className="dot dot-green" />
        </div>
        <span className="chrome-title">ianmacwan@arch — ~/portfolio — zsh</span>
        <span className="chrome-spacer" />
      </div>

      <div className="term-body">
        {lines.map((line, i) => (
          <TerminalLineComponent key={line.id} line={line} index={i} />
        ))}
        {inputReady && <TerminalInput onCommand={handleCommand} />}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
