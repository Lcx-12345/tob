import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import { ImagePage } from "@/pages/ImagePage";
import GamePage from "@/pages/GamePage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/image" element={<ImagePage />} />
        <Route path="/snake" element={<GamePage />} />
      </Routes>
    </Router>
  );
}
