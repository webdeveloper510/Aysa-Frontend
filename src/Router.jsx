import { Routes, Route } from "react-router-dom";
import { About } from "./components/About";
import { Tabs } from "./components/Tabs";
import PublicRoutes from "./components/PublicRoutes";
import DashBoard from "./pages/DashBoard"
import Login from "./pages/Login";
import ProtectedRoutes from "./components/ProtectedRoutes";

export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Tabs />} />
      <Route path="/about" element={<About />} />

      <Route element={<ProtectedRoutes />}>
        <Route path="/dashboard" element={<DashBoard />} />
      </Route>

       <Route element={<PublicRoutes />}>
        <Route path="/login" element={<Login />} />
      </Route>
    </Routes>
  );
};
