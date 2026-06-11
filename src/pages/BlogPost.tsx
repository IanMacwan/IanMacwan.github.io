import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { blogPosts } from "../content/blogPosts";
import type { BlogPost as Post } from "../content/blogPosts";
import MarkdownRenderer from "../components/MarkdownRenderer";
import { SiMarkdown } from "react-icons/si";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [cmdLine, setCmdLine] = useState("");
  const [cmdMode, setCmdMode] = useState(false);
  const [mode, setMode] = useState<"NORMAL" | "INSERT">("NORMAL");
  const [copied, setCopied] = useState(false);

  const post: Post | undefined = blogPosts.find((p) => p.slug === slug);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, [slug]);

  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (cmdMode) return;
      if (e.key === ":" && mode === "NORMAL") {
        e.preventDefault();
        setCmdMode(true);
        setCmdLine(":");
        return;
      }
      if (e.key === "i")      { setMode("INSERT"); return; }
      if (e.key === "Escape") { setMode("NORMAL"); return; }
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [cmdMode, mode]);

  const handleCmdKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") { setCmdMode(false); setCmdLine(""); return; }
    if (e.key === "Enter") {
      const cmd = cmdLine.replace(/^:/, "").trim();
      if (cmd === "q" || cmd === "q!" || cmd === "wq") navigate("/blogs");
      if (cmd === "qa") navigate("/");
      setCmdMode(false);
      setCmdLine("");
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!post) {
    return (
      <div className="nvim-overlay nvim-visible" style={{ alignItems: "center", justifyContent: "center", display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div style={{ color: "var(--red)", fontSize: "1.1rem" }}>E:404 — post not found: {slug}.md</div>
        <Link to="/blogs" style={{ color: "var(--blue)" }}>← back to blog index</Link>
      </div>
    );
  }

  const lineCount = post.content.split("\n").length;
  const timeStr = new Date().toLocaleTimeString("en-CA", { hour: "2-digit", minute: "2-digit", hour12: false });
  const idx = blogPosts.findIndex((p) => p.slug === slug);
  const prev = blogPosts[idx + 1];
  const next = blogPosts[idx - 1];

  return (
    <div className={`nvim-overlay ${visible ? "nvim-visible" : ""}`}>
      <div className="nvim-tabline">
        <Link to="/blogs" className="nvim-tab" style={{ textDecoration: "none" }}>
          <span className="nvim-tab-name" style={{ color: "var(--fg4)" }}>index.md</span>
        </Link>
        <div className="nvim-tab nvim-tab-active">
          <span className="nvim-tab-icon">
            <SiMarkdown size={14} />
          </span>
          <span className="nvim-tab-name">{post.slug}.md</span>
        </div>
        <div className="nvim-tab-spacer" />
        <button className="nvim-close-btn" onClick={copyLink} style={{ color: copied ? "var(--green)" : undefined }}>
          {copied ? "✓ copied!" : "⎘ share"}
        </button>
        <Link to="/blogs" className="nvim-close-btn" style={{ textDecoration: "none" }}>← blog</Link>
        <Link to="/"      className="nvim-close-btn" style={{ textDecoration: "none" }}>✕ terminal</Link>
      </div>

      <div className="nvim-body">
        <div className="nvim-sidebar">
          <div className="nvim-tree-header">  EXPLORER</div>
          <div className="nvim-tree-section">blog/</div>
          {blogPosts.map((p) => (
            <Link
              key={p.slug}
              to={`/blogs/${p.slug}`}
              className={`nvim-tree-item ${p.slug === slug ? "nvim-tree-active" : ""}`}
              style={{ textDecoration: "none" }}
            >
              <span className="nvim-tab-icon">
                <SiMarkdown size={14} />
              </span>
              <span className="tree-file-name">{p.slug}.md</span>
            </Link>
          ))}
        </div>

        <div className="nvim-editor-area" tabIndex={0}>
          <div className="nvim-content-wrap">
            <MarkdownRenderer>
              {post.content + (prev || next ? `\n\n---` : "")}
            </MarkdownRenderer>
          </div>
        </div>

        <div className="nvim-info-panel">
          <div className="info-panel-header">POST INFO</div>
          <div className="info-row">
            <span className="info-label">title</span>
            <span className="info-value">{post.title}</span>
          </div>
          <div className="info-row">
            <span className="info-label">date</span>
            <span className="info-value">{post.date}</span>
          </div>
          <div className="info-row">
            <span className="info-label">github</span>
            <a href={post.link} target="_blank" rel="noopener noreferrer" className="info-value-link">{post.link}</a>
          </div>
          <div className="info-row">
            <span className="info-label">tags</span>
            <div className="info-tags">
              {post.tags.map((t) => (
                <span key={t} className="info-tag">#{t}</span>
              ))}
            </div>
          </div>
          <div className="info-row" style={{ marginTop: "0.5rem" }}>
            <span className="info-label">link</span>
            <button onClick={copyLink} className="share-link-btn"
              style={{ color: copied ? "var(--green)" : "var(--blue)" }}>
              {copied ? "✓ copied!" : "copy shareable link"}
            </button>
          </div>
          <div className="info-divider" />
          <div className="info-panel-header" style={{ marginTop: "0.5rem" }}>ALL POSTS</div>
          {blogPosts.map((p) => (
            <Link
              key={p.slug}
              to={`/blogs/${p.slug}`}
              className={`info-post-btn ${p.slug === slug ? "info-post-active" : ""}`}
              style={{ textDecoration: "none" }}
            >
              <span className="info-post-date">{p.date}</span>
              <span className="info-post-title">{p.title}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="nvim-statusline">
        <span className={`nvim-mode-badge nvim-mode-${mode.toLowerCase()}`}>{mode}</span>
        <span className="nvim-sl-file"> {post.slug}.md</span>
        <span className="nvim-sl-branch"> </span>
        <span className="nvim-sl-branch-name">main</span>
        <span className="nvim-sl-spacer" />
        <span className="nvim-sl-right">
          <span className="nvim-sl-ft">markdown</span>
          <span className="nvim-sl-sep"> | </span>
          <span className="nvim-sl-pos">1:{lineCount}</span>
          <span className="nvim-sl-sep"> | </span>
          <span className="nvim-sl-time">{timeStr}</span>
        </span>
      </div>

      {(prev || next) && (
        <div className="post-nav" style={{ padding: "0.5rem 1rem", borderTop: "1px solid var(--bg2)", background: "var(--bg-hard)", flexShrink: 0 }}>
          {prev
            ? <Link to={`/blogs/${prev.slug}`} className="post-nav-btn">← {prev.title}</Link>
            : <span />}
          {next && <Link to={`/blogs/${next.slug}`} className="post-nav-btn post-nav-next">{next.title} →</Link>}
        </div>
      )}

      {cmdMode && (
        <div className="nvim-cmdline">
          <input autoFocus value={cmdLine}
            onChange={(e) => setCmdLine(e.target.value)}
            onKeyDown={handleCmdKey}
            className="nvim-cmd-input" spellCheck={false} />
        </div>
      )}
    </div>
  );
}
