import React from "react";
import { Routes, Route } from "react-router-dom";
import About from "./components/About";
import Tabs from "./components/Tabs";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Tabs />} />
      <Route path="/about" element={<About />} />
    </Routes>
  );
};

export default Router;
