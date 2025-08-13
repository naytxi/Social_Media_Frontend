import React from "react";
import "./Header.scss";
import logo from "../../assets/logo.png"; 
import { FiMail } from "react-icons/fi"; 

const Header = () => {
  return (
    <header className="header">
      <div className="header__left">
        <img src={logo} alt="Beely Logo" className="header__logo" />
      </div>

      <div className="header__center">
        <input
          type="text"
          placeholder="Buscar un buzz..."
          className="header__search"
        />
      </div>

      <div className="header__right">
        <FiMail className="header__icon" />
        <span className="header__login">Login</span>
      </div>
    </header>
  );
};

export default Header;
