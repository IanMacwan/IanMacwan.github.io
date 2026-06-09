import { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import type { Components } from "react-markdown";

// ─── Gruvbox theme for syntax highlighter ───────────────
const gruvboxTheme: { [key: string]: React.CSSProperties } = {
  'code[class*="language-"]': {
    color: "#ebdbb2",
    background: "#1d2021",
    fontFamily: '"Cascadia Code", "Cascadia Mono", monospace',
    fontSize: "0.86rem",
    textAlign: "left",
    whiteSpace: "pre",
    lineHeight: "1.6",
    tabSize: 2,
  },
  'pre[class*="language-"]': {
    color: "#ebdbb2",
    background: "#1d2021",
    fontFamily: '"Cascadia Code", "Cascadia Mono", monospace',
    fontSize: "0.86rem",
    lineHeight: "1.6",
    tabSize: 2,
    margin: 0,
    padding: 0,
    overflow: "auto",
    border: "none",
  },
  comment:        { color: "#928374", fontStyle: "italic" },
  prolog:         { color: "#928374" },
  doctype:        { color: "#928374" },
  cdata:          { color: "#928374" },
  punctuation:    { color: "#ebdbb2" },
  property:       { color: "#fb4934" },
  tag:            { color: "#fb4934" },
  boolean:        { color: "#d3869b" },
  number:         { color: "#d3869b" },
  constant:       { color: "#d3869b" },
  symbol:         { color: "#d3869b" },
  deleted:        { color: "#fb4934" },
  selector:       { color: "#b8bb26" },
  "attr-name":    { color: "#fabd2f" },
  string:         { color: "#b8bb26" },
  char:           { color: "#b8bb26" },
  builtin:        { color: "#8ec07c" },
  inserted:       { color: "#b8bb26" },
  operator:       { color: "#8ec07c" },
  entity:         { color: "#fabd2f" },
  url:            { color: "#83a598" },
  variable:       { color: "#ebdbb2" },
  atrule:         { color: "#fabd2f" },
  "attr-value":   { color: "#b8bb26" },
  function:       { color: "#fabd2f" },
  "class-name":   { color: "#fabd2f" },
  keyword:        { color: "#fb4934" },
  regex:          { color: "#8ec07c" },
  important:      { color: "#fe8019", fontWeight: "bold" },
  bold:           { fontWeight: "bold" },
  italic:         { fontStyle: "italic" },
};

// ─── Types ───────────────────────────────────────────────
type BlockKind =
  | "heading"
  | "paragraph"
  | "code"
  | "list"
  | "blockquote"
  | "hr"
  | "table"
  | "blank";

interface Block {
  kind: BlockKind;
  startLine: number;   // 1-indexed source line this block starts on
  lineCount: number;   // how many source lines it spans
  raw: string;         // raw markdown for this block
}

// ─── Markdown block splitter ─────────────────────────────
// Walks the raw string line by line and groups lines into
// blocks, recording exact source line numbers.
function splitBlocks(src: string): Block[] {
  const lines = src.split("\n");
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Blank line
    if (line.trim() === "") {
      blocks.push({ kind: "blank", startLine: i + 1, lineCount: 1, raw: "" });
      i++;
      continue;
    }

    // Fenced code block
    if (/^```/.test(line.trim())) {
      const start = i;
      const rawLines = [line];
      i++;
      while (i < lines.length) {
        rawLines.push(lines[i]);
        if (/^```/.test(lines[i].trim()) && i !== start) { i++; break; }
        i++;
      }
      blocks.push({
        kind: "code",
        startLine: start + 1,
        lineCount: rawLines.length,
        raw: rawLines.join("\n"),
      });
      continue;
    }

    // Heading
    if (/^#{1,6}\s/.test(line)) {
      blocks.push({ kind: "heading", startLine: i + 1, lineCount: 1, raw: line });
      i++;
      continue;
    }

    // Horizontal rule
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(line.trim())) {
      blocks.push({ kind: "hr", startLine: i + 1, lineCount: 1, raw: line });
      i++;
      continue;
    }

    // Blockquote — collect consecutive > lines
    if (/^>\s?/.test(line)) {
      const start = i;
      const rawLines = [line];
      i++;
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        rawLines.push(lines[i]);
        i++;
      }
      blocks.push({
        kind: "blockquote",
        startLine: start + 1,
        lineCount: rawLines.length,
        raw: rawLines.join("\n"),
      });
      continue;
    }

    // List — collect consecutive list item lines (including continuation)
    if (/^(\s*[-*+]|\s*\d+\.) /.test(line)) {
      const start = i;
      const rawLines = [line];
      i++;
      while (
        i < lines.length &&
        lines[i].trim() !== "" &&
        !/^#{1,6}\s/.test(lines[i]) &&
        !/^```/.test(lines[i].trim())
      ) {
        rawLines.push(lines[i]);
        i++;
      }
      blocks.push({
        kind: "list",
        startLine: start + 1,
        lineCount: rawLines.length,
        raw: rawLines.join("\n"),
      });
      continue;
    }

    // Table — collect consecutive pipe lines
    if (/\|/.test(line)) {
      const start = i;
      const rawLines = [line];
      i++;
      while (i < lines.length && /\|/.test(lines[i]) && lines[i].trim() !== "") {
        rawLines.push(lines[i]);
        i++;
      }
      blocks.push({
        kind: "table",
        startLine: start + 1,
        lineCount: rawLines.length,
        raw: rawLines.join("\n"),
      });
      continue;
    }

    // Paragraph — collect until blank line or block-level element
    {
      const start = i;
      const rawLines = [line];
      i++;
      while (
        i < lines.length &&
        lines[i].trim() !== "" &&
        !/^#{1,6}\s/.test(lines[i]) &&
        !/^```/.test(lines[i].trim()) &&
        !/^>\s?/.test(lines[i]) &&
        !/^(\s*[-*+]|\s*\d+\.) /.test(lines[i]) &&
        !/^(-{3,}|\*{3,}|_{3,})$/.test(lines[i].trim())
      ) {
        rawLines.push(lines[i]);
        i++;
      }
      blocks.push({
        kind: "paragraph",
        startLine: start + 1,
        lineCount: rawLines.length,
        raw: rawLines.join("\n"),
      });
    }
  }

  return blocks;
}

// ─── Inline markdown renderer (components shared by all blocks) ──
function makeComponents(isCode = false): Components {
  return {
    code({ className, children, ...props }) {
      const match = /language-(\w+)/.exec(className ?? "");
      const code = String(children).replace(/\n$/, "");

      if (match) {
        return (
          <SyntaxHighlighter
            style={gruvboxTheme}
            language={match[1]}
            PreTag="div"
            customStyle={{
              margin: 0,
              padding: "0.5rem 0.75rem",
              background: "#1d2021",
              border: "none",
              borderRadius: 0,
              fontSize: "0.86rem",
            }}
            codeTagProps={{
              style: {
                fontFamily: '"Cascadia Code", "Cascadia Mono", monospace',
                fontSize: "0.86rem",
              },
            }}
          >
            {code}
          </SyntaxHighlighter>
        );
      }

      return (
        <code
          style={{
            background: "#3c3836",
            color: "#fe8019",
            padding: "0.05em 0.3em",
            borderRadius: "3px",
            fontSize: "0.9em",
            fontFamily: '"Cascadia Code", "Cascadia Mono", monospace',
          }}
          {...props}
        >
          {children}
        </code>
      );
    },
    // Strip the extra <p> wrapper inside blockquotes/list items
    p({ children }) {
      return <span style={{ display: "block" }}>{children}</span>;
    },
  };
}

const sharedComponents = makeComponents();

// ─── Gutter line number cell ─────────────────────────────
function Gutter({
  start,
  count,
}: {
  start: number;
  count: number;
}) {
  return (
    <div className="md-gutter">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="md-lnum">
          {start + i}
        </div>
      ))}
    </div>
  );
}

// ─── Single block row ────────────────────────────────────
function BlockRow({ block }: { block: Block }) {
  if (block.kind === "blank") {
    return (
      <div className="md-row md-row-blank">
        <Gutter start={block.startLine} count={1} />
        <div className="md-content md-blank" />
      </div>
    );
  }

  if (block.kind === "code") {
    return (
      <div className="md-row md-row-code">
        <Gutter start={block.startLine} count={block.lineCount} />
        <div className="md-content">
          <div className="md-code-block">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={sharedComponents}>
              {block.raw}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    );
  }

  if (block.kind === "hr") {
    return (
      <div className="md-row md-row-hr">
        <Gutter start={block.startLine} count={1} />
        <div className="md-content">
          <hr className="md-hr" />
        </div>
      </div>
    );
  }

  return (
    <div className="md-row">
      <Gutter start={block.startLine} count={block.lineCount} />
      <div className="md-content">
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={sharedComponents}>
          {block.raw}
        </ReactMarkdown>
      </div>
    </div>
  );
}

// ─── Public component ────────────────────────────────────
interface Props {
  children: string;
}

export default function MarkdownRenderer({ children }: Props) {
  const blocks = useMemo(() => splitBlocks(children), [children]);

  return (
    <div className="nvim-markdown-view">
      {blocks.map((block, i) => (
        <BlockRow key={i} block={block} />
      ))}
    </div>
  );
}
