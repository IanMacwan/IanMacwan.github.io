import { ASCII_ART, NEOFETCH_INFO, HELP_TEXT } from "../../content/terminalData";

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

          {NEOFETCH_INFO.map(({ label, value1, value2, value3 }) => (
            <div key={label} className="nf-row">
              <span className={`nf-label nf-label-${label.toLowerCase()}`}>
                {label === "projects" ? (
                  <a href="/projects" className="nf-link nf-label-projects">
                    {label}
                  </a>
                ) : label === "blog" ? (
                  <a href="/blogs" className="nf-link nf-label-blog">
                    {label}
                  </a>
                ) : (
                  label
                )}
              </span>
              <span className="nf-colon">: </span>

              {label === "github" ? (
                <a
                  href="https://github.com/IanMacwan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nf-link nf-github"
                >
                  {value1}
                </a>
              ) : label === "linkedin" ? (
                <a
                  href="https://linkedin.com/in/ian-macwan11"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nf-link nf-linkedin"
                >
                  {value1}
                </a>
              ) : label === "email" ? (
                <a
                  href="mailto:ian.macwan@torontomu.ca"
                  className="nf-link nf-email"
                >
                  {value1}
                </a>
              ) : label === "projects" ? (
                <>
                  <a
                    href="/projects/test-proj"
                    className="nf-link nf-proj"
                  >
                    {value1}
                  </a>,&nbsp;
                  <a
                    href="/projects/test-proj"
                    className="nf-link nf-proj"
                  >
                    {value2}
                  </a>,&nbsp;
                  <a
                    href="/projects/test-proj"
                    className="nf-link nf-proj"
                  >
                    {value3}
                  </a>
                </>
              ) : label === "blog" ? (
                <>
                  <a
                    href="/blogs/tcpip-stack"
                    className="nf-link nf-blog"
                  >
                    {value1}
                  </a>,&nbsp;
                  <a
                    href="/blogs/test-blog"
                    className="nf-link nf-blog"
                  >
                    {value2}
                  </a>,&nbsp;
                  <a
                    href="/blogs/test-blog"
                    className="nf-link nf-blog"
                  >
                    {value3}
                  </a>
                </>
              ) : (
                <span className="nf-value">{value1}</span>
              )}
            </div>
          ))}

          <div
            className="nf-separator nf-row-in"
            style={{ marginTop: "0.75rem", animationDelay: `${130 + NEOFETCH_INFO.length * 35}ms` }}
          >
            {"─".repeat(32)}
          </div>

          <div
            className="nf-palette nf-row-in"
            style={{ animationDelay: `${160 + NEOFETCH_INFO.length * 35}ms` }}
          >
            {["bg1","red","green","yellow","blue","purple","aqua","orange"].map((c) => (
              <span key={c} className={`pal-block pal-${c}`} />
            ))}
          </div>
        </div>
      </div>

      <div
        className="nf-help-hint nf-row-in"
        style={{ animationDelay: `${200 + NEOFETCH_INFO.length * 35}ms` }}
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
