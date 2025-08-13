import React from "react";
import "./Footer.scss";

const Footer = () => {
  return (
    <footer className="footer">
      <p>
        <a href="/privacy">Política de Privacidad</a> |{" "}
        <a href="/terms">Condiciones de Servicio</a> |{" "}
        <a href="/help">Centro de Ayuda</a>
      </p>
      <p>© 2025 Beely Corp.</p>
    </footer>
  );
};

export default Footer;
