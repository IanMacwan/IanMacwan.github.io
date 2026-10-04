export const ASCII_ART = `
▀▀                   
██   ▀▀█▄ ████▄      
██  ▄█▀██ ██ ██      
██▄ ▀█▄██ ██ ██      
                  
███▄███▄  ▀▀█▄ ▄████ 
██ ██ ██ ▄█▀██ ██    
██ ██ ██ ▀█▄██ ▀████ 
                     
██   ██  ▀▀█▄ ████▄  
██ █ ██ ▄█▀██ ██ ██  
 ██▀██  ▀█▄██ ██ ██  
`.trim();


export const TAGLINE = "Embedded Systems · Firmware · Software";

export const LINKS = {
  github:   { label: "github",                   href: "https://github.com/IanMacwan" },
  linkedin: { label: "linkedin",                 href: "https://linkedin.com/in/ian-macwan11" },
  email:    { label: "ian.macwan@torontomu.ca",  href: "mailto:ian.macwan@torontomu.ca" },
  resume:   { label: "resume",                   href: "/resume.pdf" },
};

export const FEATURED_PROJECTS = [
  {
    href: "/projects/test-proj",
    name: "userspace-tcpip",
    desc: "TCP/IP stack implemented in userspace",
    tech: ["C", "Linux"],
  },
  {
    href: "/projects/test-proj",
    name: "project-two",
    desc: "Short one-line description",
    tech: ["C++", "ARM"],
  },
  {
    href: "/projects/test-proj",
    name: "project-three",
    desc: "Short one-line description",
    tech: ["Rust", "Linux"],
  },
];

export const FEATURED_BLOGS = [
  { href: "/blogs/tcpip-stack", title: "Building a Userspace TCP/IP Stack" },
  { href: "/blogs/test-blog",   title: "Another technical post" },
  { href: "/blogs/test-blog",   title: "Another post" },
];

export const HELP_TEXT = [
  { cmd: "about",      desc: "who am I" },
  { cmd: "projects",   desc: "things I've built" },
  { cmd: "experience", desc: "where I've worked" },
  { cmd: "blog",       desc: "open neovim editor with all posts" },
  { cmd: "contact",    desc: "get in touch" },
  { cmd: "clear",      desc: "clear the terminal" },
  { cmd: "help",       desc: "show this message" },
];

export const ABOUT_OUTPUT = `
## about.md

coming soon!
`.trim();

export const EXPERIENCE_OUTPUT = `
## experience.md

coming soon!
`.trim();

export const CONTACT_OUTPUT = `
## contact.md

coming soon!
`.trim();
