import "../styles/components/Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <p className="footer-text">
        © {new Date().getFullYear()} <span>E-Stamp Management System</span> — All Rights Reserved
      </p>
    </footer>
  );
}
