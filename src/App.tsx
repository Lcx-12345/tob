import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import { ImagePage } from "@/pages/ImagePage";
import SnakeGame from "@/components/SnakeGame";
import TetrisGame from "@/components/TetrisGame";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/image" element={<ImagePage />} />
        <Route path="/snake" element={<SnakeGame />} />
        <Route path="/tetris" element={<TetrisGame />} />
        <Route path="/other" element={<div className="text-center text-xl">Other Page - Coming Soon</div>} />
      </Routes>
    </Router>
  );
}
