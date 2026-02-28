import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* แก้ props ที่ผิด */}
        {/* Catch all - ต้องอยู่สุดท้าย */}
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}