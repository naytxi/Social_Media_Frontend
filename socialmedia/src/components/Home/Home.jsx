import React, { useState } from "react";
import "./Home.scss";
import logo from "../../assets/logo.png";
import Footer from "../Footer/Footer";
import Login from "../Login/Login";
import Register from "../Register/Register";

const Home = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const openLogin = () => setShowLogin(true);
  const closeLogin = () => setShowLogin(false);

  const openRegister = () => setShowRegister(true);
  const closeRegister = () => setShowRegister(false);

  return (
    <div className="home">
      <div className="home__content">
        <div className="home__left">
          <img src={logo} alt="Beely Logo" className="home__logo" />
        </div>

        <div className="home__right">
          <h1>Bienvenido a Beely 🐝</h1>
          <button className="btn btn-primary" onClick={openLogin}>
            Iniciar sesión
          </button>
          <button className="btn btn-secondary" onClick={openRegister}>
            Crear cuenta
          </button>
        </div>
      </div>

      <Footer />

      {showLogin && <Login onClose={closeLogin} />}

      {showRegister && (
        <Register
          onClose={closeRegister}
          openLoginModal={() => {
            closeRegister(); 
            openLogin();     
          }}
        />
      )}
    </div>
  );
};

export default Home;
