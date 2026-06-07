import { Routes, Route } from "react-router-dom";
import Terminal from "./components/terminal/Terminal";
import BlogIndex from "./pages/BlogIndex";
import BlogPost from "./pages/BlogPost";

export default function App() {
  return (
    <div className="app-root">
      <Routes>
        <Route path="/" element={<Terminal />} />

        <Route path="/blogs" element={<BlogIndex />} />

        <Route path="/blogs/:slug" element={<BlogPost />} />
      </Routes>
    </div>
  );
}
