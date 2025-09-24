import { Routes, Route } from "react-router-dom";
import { About } from "./components/About";
import { Tabs } from "./components/Tabs";
import PublicRoutes from "./components/PublicRoutes";
import DashBoard from "./pages/DashBoard";
import Login from "./pages/Login";
import ProtectedRoutes from "./components/ProtectedRoutes";
import AnalysisTable from "./pages/AnalysisTable";
import FileManipulation from "./pages/FileManipulation";
import FileDownlaod from "./pages/FileDownlaod";
import FileUpload from "./pages/FileUpload";
import { ToastContainer } from "react-toastify";

export const Router = () => {
  return (
    <>
      <ToastContainer
        position="top-right" // top-right, top-center, bottom-left, etc.
        autoClose={3000} // auto close after 3s
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored" // light, dark, colored
      />
      <Routes>
        <Route path="/" element={<Tabs />} />
        <Route path="/about" element={<About />} />

        <Route element={<ProtectedRoutes />}>
          <Route path="/dashboard" element={<DashBoard />} />
          <Route path="/dashboard/table" element={<AnalysisTable />} />
          <Route
            path="/dashboard/fileManipulation"
            element={<FileManipulation />}
          />
          <Route
            path="/dashboard/fileManipulation/download"
            element={<FileDownlaod />}
          />
          <Route
            path="/dashboard/fileManipulation/upload"
            element={<FileUpload />}
          />
        </Route>

        <Route element={<PublicRoutes />}>
          <Route path="/login" element={<Login />} />
        </Route>
      </Routes>
    </>
  );
};
