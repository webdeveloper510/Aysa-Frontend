import "./App.css";
import { Footer } from "./components/Footer";
import { Router } from "./Router";

const test = () => {
  window.location.assign("/");
};

function App() {
  return (
    <>
      <div className="App">
        <header className="App-header">
          <p className="header" onClick={test}>
            Aysa
          </p>
          <label>Empowering smarter spending with real data.</label>
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
