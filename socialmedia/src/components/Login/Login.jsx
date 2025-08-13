import React from "react";
import "./Login.scss";
import logo from "../../assets/logo3.png";

const Login = ({ onClose }) => {
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <img src={logo} alt="Beely Logo" className="modal__logo" />
        <h2>Iniciar sesión</h2>
        <input type="email" placeholder="Correo electrónico" />
        <input type="password" placeholder="Contraseña" />
        <div className="modal__buttons">
          <button className="btn btn-login">Iniciar sesión</button>
          <button className="btn btn-cancel" onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
