import { Routes, Route } from "react-router-dom";
import {About} from "./components/About";
import {Tabs} from "./components/Tabs";

export const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Tabs />} />
      <Route path="/about" element={<About />} />
    </Routes>
  );
};
