export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  content: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "test-blog",
    title: "Test Blog!!!",
    date: "2026-01-01",
    tags: ["embedded", "rtos", "c"],
    content: `
# Test Blog!

## Overview
This is a test blog

\`\`\`c
int main(void) {
  return 0;
}
\`\`\`

`,
  },
];

export default blogPosts;
