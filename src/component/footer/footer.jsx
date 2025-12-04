import "./footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p className="footer-text">
          © {new Date().getFullYear()} <span className="app-name">MyApp</span>. All rights reserved.
        </p>
      </div>
    </footer>
  );
}