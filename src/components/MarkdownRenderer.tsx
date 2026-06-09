import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import type { Components } from "react-markdown";

const gruvboxTheme: { [key: string]: React.CSSProperties } = {
  'code[class*="language-"]': {
    color: "#ebdbb2",
    background: "#1d2021",
    fontFamily: '"Cascadia Code", "Cascadia Mono", monospace',
    fontSize: "0.9em",
    textAlign: "left",
    whiteSpace: "pre",
    wordSpacing: "normal",
    wordBreak: "normal",
    wordWrap: "normal",
    lineHeight: "1.6",
    tabSize: 2,
  },
  'pre[class*="language-"]': {
    color: "#ebdbb2",
    background: "#1d2021",
    fontFamily: '"Cascadia Code", "Cascadia Mono", monospace',
    fontSize: "0.9em",
    textAlign: "left",
    whiteSpace: "pre",
    wordSpacing: "normal",
    wordBreak: "normal",
    wordWrap: "normal",
    lineHeight: "1.6",
    tabSize: 2,
    padding: "1em",
    margin: "0.8em 0",
    overflow: "auto",
    borderRadius: "4px",
    border: "1px solid #504945",
  },
  comment:   { color: "#928374", fontStyle: "italic" },
  prolog:    { color: "#928374" },
  doctype:   { color: "#928374" },
  cdata:     { color: "#928374" },
  punctuation: { color: "#ebdbb2" },
  property:  { color: "#fb4934" },
  tag:       { color: "#fb4934" },
  boolean:   { color: "#d3869b" },
  number:    { color: "#d3869b" },
  constant:  { color: "#d3869b" },
  symbol:    { color: "#d3869b" },
  deleted:   { color: "#fb4934" },
  selector:  { color: "#b8bb26" },
  "attr-name": { color: "#fabd2f" },
  string:    { color: "#b8bb26" },
  char:      { color: "#b8bb26" },
  builtin:   { color: "#8ec07c" },
  inserted:  { color: "#b8bb26" },
  operator:  { color: "#8ec07c" },
  entity:    { color: "#fabd2f", cursor: "help" },
  url:       { color: "#83a598" },
  variable:  { color: "#ebdbb2" },
  atrule:    { color: "#fabd2f" },
  "attr-value": { color: "#b8bb26" },
  function:  { color: "#fabd2f" },
  "class-name": { color: "#fabd2f" },
  keyword:   { color: "#fb4934" },
  regex:     { color: "#8ec07c" },
  important: { color: "#fe8019", fontWeight: "bold" },
  bold:      { fontWeight: "bold" },
  italic:    { fontStyle: "italic" },
};

const components: Components = {
  // Fenced code blocks with language tag → syntax highlighted
  code({ node, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className ?? "");
    const code = String(children).replace(/\n$/, "");

    if (match) {
      return (
        <SyntaxHighlighter
          style={gruvboxTheme}
          language={match[1]}
          PreTag="div"
          customStyle={{
            margin: "0.8em 0",
            borderRadius: "0.19rem",
            border: "1px solid #504945",
            background: "#1d2021",
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

    // Inline code — no highlighting, just styled span
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
};

interface Props {
  children: string;
  className?: string;
}

export default function MarkdownRenderer({ children, className }: Props) {
  return (
    <div className={className ?? "nvim-markdown-view"}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
