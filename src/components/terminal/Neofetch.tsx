import {
  ASCII_ART,
  FEATURED_PROJECTS,
  FEATURED_BLOGS,
  HELP_TEXT,
  TAGLINE,
  LINKS,
} from "../../content/terminalData";

// Animation timing for the rows after the links (ms)
const SECTION_DELAY = 210;
const ROW_STEP = 35;
const TOTAL_ROWS = FEATURED_PROJECTS.length + FEATURED_BLOGS.length;

export default function Neofetch() {
  const lines = ASCII_ART.split("\n");

  return (
    <div className="neofetch-block">
      <div className="neofetch-inner">
        <pre className="ascii-art" aria-label="Ian Macwan ASCII logo">
          {lines.map((line, i) => (
            <span
              key={i}
              className="ascii-line ascii-line-in"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              {line}
              {"\n"}
            </span>
          ))}
        </pre>

        <div className="neofetch-info">
          <div className="neofetch-username nf-row-in" style={{ animationDelay: "60ms" }}>
            <span className="nf-user">ian</span>
            <span className="nf-at">@</span>
            <span className="nf-host">portfolio</span>
          </div>
          <div className="nf-separator nf-row-in" style={{ animationDelay: "100ms" }}>
            {"─".repeat(32)}
          </div>

          {/* name / role → tagline */}
          <div className="nf-tagline nf-row-in" style={{ animationDelay: "130ms" }}>
            {TAGLINE}
          </div>

          {/* socials / email → bracket links */}
          <div className="nf-links nf-row-in" style={{ animationDelay: "170ms" }}>
            <a
              href={LINKS.github.href}
              target="_blank"
              rel="noopener noreferrer"
              className="nf-link nf-github"
            >
              <span className="nf-bracket">[</span> {LINKS.github.label}{" "}
              <span className="nf-bracket">]</span>
            </a>
            <a
              href={LINKS.linkedin.href}
              target="_blank"
              rel="noopener noreferrer"
              className="nf-link nf-linkedin"
            >
              <span className="nf-bracket">[</span> {LINKS.linkedin.label}{" "}
              <span className="nf-bracket">]</span>
            </a>
            <a href={LINKS.email.href} className="nf-link nf-email">
              <span className="nf-bracket">[</span> {LINKS.email.label}{" "}
              <span className="nf-bracket">]</span>
            </a>
            <a
              href={LINKS.resume.href}
              target="_blank"
              rel="noopener noreferrer"
              className="nf-link nf-resume"
            >
              <span className="nf-bracket">[</span> {LINKS.resume.label}{" "}
              <span className="nf-bracket">]</span>
            </a>
          </div>

          {/* line break between contact/tagline and featured sections */}
          <div
            className="nf-separator nf-separator-section nf-row-in"
            style={{ animationDelay: "190ms" }}
          >
            {"─".repeat(32)}
          </div>

          {/* featured projects + blogs, side by side to save height */}
          <div className="nf-featured">
          <div
            className="nf-section nf-row-in"
            style={{ animationDelay: `${SECTION_DELAY}ms` }}
          >
            <div className="nf-section-head">
              <a href="/projects" className="nf-link nf-section-title nf-label-projects">
                <span className="nf-prompt">$</span> ls featured/projects
              </a>
              <a href="/projects" className="nf-link nf-more">
                [more]
              </a>
            </div>

            <div className="nf-list">
            {FEATURED_PROJECTS.map(({ href, name, desc, tech }) => (
              <div key={name} className="nf-item">
                <a href={href} className="nf-link nf-item-title nf-proj">
                  <span className="nf-arrow">&gt;</span> {name}
                </a>
                <div className="nf-item-desc">
                  {desc}
                  <span className="nf-item-dot"> · </span>
                  <span className="nf-tech">{tech.join(" · ")}</span>
                </div>
              </div>
            ))}
            </div>
          </div>

          {/* featured blogs */}
          <div
            className="nf-section nf-row-in"
            style={{ animationDelay: `${SECTION_DELAY + FEATURED_PROJECTS.length * ROW_STEP}ms` }}
          >
            <div className="nf-section-head">
              <a href="/blogs" className="nf-link nf-section-title nf-label-blog">
                <span className="nf-prompt">$</span> ls featured/blogs
              </a>
              <a href="/blogs" className="nf-link nf-more">
                [more]
              </a>
            </div>

            {FEATURED_BLOGS.map(({ href, title }) => (
              <div key={title} className="nf-item">
                <a href={href} className="nf-link nf-item-title nf-blog">
                  <span className="nf-arrow">&gt;</span> {title}
                </a>
              </div>
            ))}
          </div>
          </div>

          <div
            className="nf-separator nf-row-in"
            style={{
              animationDelay: `${SECTION_DELAY + TOTAL_ROWS * ROW_STEP}ms`,
            }}
          >
            {"─".repeat(32)}
          </div>
        </div>
      </div>

      <div
        className="nf-help-hint nf-row-in"
        style={{ animationDelay: `${SECTION_DELAY + 70 + TOTAL_ROWS * ROW_STEP}ms` }}
      >
        <span className="hint-label">commands</span>
        <span className="hint-sep"> → </span>
        {HELP_TEXT.map(({ cmd }, i) => (
          <span key={cmd}>
            <span className="hint-cmd">{cmd}</span>
            {i < HELP_TEXT.length - 1 && <span className="hint-dot">  ·  </span>}
          </span>
        ))}
      </div>
    </div>
  );
}
