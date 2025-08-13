import React, { useState } from "react";
import "./Home.scss";
import logo from "../../assets/logo.png";
import Footer from "../Footer/Footer";
import Login from "../Login/Login";
import Register from "../Register/Register";

const Home = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  return (
    <div className="home">
      <div className="home__content">
        <div className="home__left">
          <img src={logo} alt="Beely Logo" className="home__logo" />
        </div>

        <div className="home__right">
          <h1>Bienvenido a Beely 🐝</h1>
          <button
            className="btn btn-primary"
            onClick={() => setShowLogin(true)}
          >
            Iniciar sesión
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => setShowRegister(true)}
          >
            Crear cuenta
          </button>
        </div>
      </div>

      <Footer />

      {showLogin && <Login onClose={() => setShowLogin(false)} />}
      {showRegister && <Register onClose={() => setShowRegister(false)} />}
    </div>
  );
};

export default Home;
