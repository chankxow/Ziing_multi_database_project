import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import WorkOrders from "./pages/WorkOrders";
import Dashboard from "./pages/dashboard";
//import Register from "./Register";
//<Route path="/register" element={<Register />} />
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/workorders" element={<WorkOrders />} />
      </Routes>
    </BrowserRouter>
  );
}