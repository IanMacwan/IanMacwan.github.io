import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { projectPosts } from "../content/projectPosts";
import { SiMarkdown } from "react-icons/si";

export default function ProjectIndex() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [cmdLine, setCmdLine] = useState("");
  const [cmdMode, setCmdMode] = useState(false);

  useEffect(() => { requestAnimationFrame(() => setVisible(true)); }, []);

  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === ":" && !cmdMode) { e.preventDefault(); setCmdMode(true); setCmdLine(":"); return; }
      if (e.key === "Escape")        { setCmdMode(false); setCmdLine(""); return; }
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [cmdMode]);

  const handleCmdKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") { setCmdMode(false); setCmdLine(""); return; }
    if (e.key === "Enter") {
      const cmd = cmdLine.replace(/^:/, "").trim();
      if (cmd === "q" || cmd === "q!" || cmd === "wq" || cmd === "qa") navigate("/");
      setCmdMode(false); setCmdLine("");
    }
  };

  const timeStr = new Date().toLocaleTimeString("en-CA", { hour: "2-digit", minute: "2-digit", hour12: false });

  // const rows = projectPosts.length + 2;

  return (
    <div className={`nvim-overlay ${visible ? "nvim-visible" : ""}`}>
      <div className="nvim-tabline">
        <div className="nvim-tab nvim-tab-active">
          <span className="nvim-tab-icon">
            <SiMarkdown size={14} />
          </span>
          <span className="nvim-tab-name">projects/index.md</span>
        </div>
        <div className="nvim-tab-spacer" />
        <Link to="/" className="nvim-close-btn" style={{ textDecoration: "none" }}>✕ :q (terminal)</Link>
      </div>

      <div className="nvim-body">
        <div className="nvim-sidebar">
          <div className="nvim-tree-header">  EXPLORER</div>
          <div className="nvim-tree-section">projects/</div>
          {projectPosts.map((post) => (
            <Link key={post.slug} to={`/projects/${post.slug}`}
              className="nvim-tree-item" style={{ textDecoration: "none" }}>
              <span className="nvim-tab-icon">
                <SiMarkdown size={14} />
              </span>
              <span className="tree-file-name">{post.slug}.md</span>
            </Link>
          ))}
        </div>

        <div className="nvim-editor-area" tabIndex={0}>
          <div className="nvim-content-wrap">
            <div className="md-gutter">
              {Array.from({ length: 15 }, (_, i) => (
                <div key={i} className="md-lnum">
                  {i + 1}
                </div>
              ))}
            </div>

            <div className="index-content">
              <h1 className="index-heading">projects/</h1>
              <p className="index-subheading">
                {projectPosts.length} projects · click any title to view · share the url to link directly
              </p>
              {projectPosts.map((post, i) => (
                <Link key={post.slug} to={`/projects/${post.slug}`}
                  className="blog-index-card"
                  style={{ animationDelay: `${i * 60}ms` }}>
                  <div className="bic-date">{post.date}</div>
                  <div className="bic-title">{post.title}</div>
                  <div className="bic-tags">
                    {post.tags.map((t) => <span key={t} className="info-tag">#{t}</span>)}
                  </div>
                  <div className="bic-url">ianmacwan.github.io/projects/{post.slug}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="nvim-info-panel">
          <div className="info-panel-header">ALL PROJECTS</div>
          {projectPosts.map((post) => (
            <Link key={post.slug} to={`/projects/${post.slug}`}
              className="info-post-btn" style={{ textDecoration: "none" }}>
              <span className="info-post-date">{post.date}</span>
              <span className="info-post-title">{post.title}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="nvim-statusline">
        <span className="nvim-mode-badge nvim-mode-normal">NORMAL</span>
        <span className="nvim-sl-file"> projects/index.md</span>
        <span className="nvim-sl-branch"> </span>
        <span className="nvim-sl-branch-name">main</span>
        <span className="nvim-sl-spacer" />
        <span className="nvim-sl-right">
          <span className="nvim-sl-ft">markdown</span>
          <span className="nvim-sl-sep"> | </span>
          <span className="nvim-sl-pos">{projectPosts.length} projs</span>
          <span className="nvim-sl-sep"> | </span>
          <span className="nvim-sl-time">{timeStr}</span>
        </span>
      </div>

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
