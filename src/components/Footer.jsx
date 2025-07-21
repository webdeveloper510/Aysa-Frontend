import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="flex-container">
        <div className="flex-column">
          <Link className="btn" to="/about">
            About
          </Link>
        </div>

        <div className="flex-column">
          <button
            className="btn"
            onClick={() => (window.location = "mailto:contact@the-aysa.com")}
          >
            Contact us
          </button>
        </div>
      </div>
    </footer>
  );
};

