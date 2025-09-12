import { useEffect, useState } from "react";
import "./App.css";
import { Footer } from "./components/Footer";
import { Router } from "./Router";

const test = () => {
  window.location.assign("/");
};


function App() {
  const [deviceType, setDeviceType] = useState("desktop");

  useEffect(() => {
    const ua = navigator.userAgent;
    if (/Mobi|Android|iPhone|iPod|iPad/i.test(ua)) {
      setDeviceType("mobile");
    } else {
      setDeviceType("desktop");
    }
  }, []);
  return (
    <>
      <div className="App">
        <header className="App-header">
          <p className="header" onClick={test}>
            Aysa
          </p>
          <label>
            {`See what brands don’t want you to know — profit margins, pay gaps,
            and tax avoidance at your fingertips. ${deviceType}`}
          </label>
        </header>
        <Router />

        <Footer />
      </div>
    </>
  );
}

export default App;

// profit
// tax
// ceo-worker
