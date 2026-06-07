import { Routes, Route } from "react-router-dom";
import Terminal from "./components/terminal/Terminal";
import BlogIndex from "./pages/BlogIndex";
import BlogPost from "./pages/BlogPost";
import ProjectIndex from "./pages/ProjectIndex";
import ProjectPost from "./pages/ProjectPost";

export default function App() {
  return (
    <div className="app-root">
      <Routes>
        <Route path="/" element={<Terminal />} />

        <Route path="/blogs" element={<BlogIndex />} />

        <Route path="/blogs/:slug" element={<BlogPost />} />

        <Route path="/projects" element={<ProjectIndex />} />

        <Route path="/projects/:slug" element={<ProjectPost />} />
      </Routes>
    </div>
  );
}
