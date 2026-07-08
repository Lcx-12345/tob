import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import { ImagePage } from "@/pages/ImagePage";
import { Navbar } from "@/components/Navbar";
import SnakeGamePage from "@/pages/SnakeGamePage";

export default function App() {
  return (
    <Router>
      <Navbar />
      <div className="pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/image" element={<ImagePage />} />
          <Route path="/snake" element={<SnakeGamePage />} />
        </Routes>
      </div>
    </Router>
  );
}
