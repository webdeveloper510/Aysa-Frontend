import "./App.css";
import React from "react";
import Footer from "./components/Footer";
import Router from "./Router";

const test = () => {
  window.location.assign("/");
};

function App() {
  return (
    <>
      <div className="App">
        <header className="App-header">
          <p className="header" onClick={test}>
            The Aysa
          </p>
        </header>

        <Router />
      </div>
      <Footer />
    </>
  );
}

export default App;
