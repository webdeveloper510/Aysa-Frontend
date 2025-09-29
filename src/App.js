import "./App.css";
import { Footer } from "./components/Footer";
import { Router } from "./Router";
import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";

function App() {
  const location = useLocation();

  useEffect(() => {
    if (!location.pathname.startsWith("/dashboard")) {
      let id = localStorage.getItem("browserId") || uuidv4();
      localStorage.setItem("browserId", id);

      axios
        .post(
          `${process.env.REACT_APP_API_URL}/create-visitor-value`,
          { browser_id: id },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        .then((res) => console.log("Visitor API response:", res.data))
        .catch((err) =>
          console.error("Visitor API error:", err.response?.data || err.message)
        );
    }
  }, [location.pathname]);

  return (
    <>
      <div className="App">
        <header className="App-header">
          <p className="header">
            <Link to={"/"}>Aysa</Link>
          </p>
          <label>
            See what brands don’t want you to know — profit margins, pay gaps,
            and tax avoidance at your fingertips.
          </label>
        </header>
        <Router />
        <Footer />
      </div>
    </>
  );
}

export default App;
