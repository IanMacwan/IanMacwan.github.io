export interface ProjectPost {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  content: string;
}

export const projectPosts: ProjectPost[] = [
  {
    slug: "test-proj",
    title: "Test Project!!!",
    date: "2026-02-01",
    tags: ["embedded", "rtos", "c"],
    content: `
# Test Project!

## Overview
This is a test project show case

\`\`\`c
int main(void) {
  return 0;
}
\`\`\`

`,
  },
];

export default projectPosts;
