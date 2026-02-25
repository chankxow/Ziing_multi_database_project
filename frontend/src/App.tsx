import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginPage, DashboardPage, RegisterPage } from "./RE";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;