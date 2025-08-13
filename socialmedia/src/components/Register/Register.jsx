import React from "react";
import "./Register.scss";
import logo from "../../assets/logo3.png";

const Register = ({ onClose }) => {
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <img src={logo} alt="Beely Logo" className="modal__logo" />
        <h2>Crear cuenta</h2>
        <input type="text" placeholder="Nombre de usuario" />
        <input type="email" placeholder="Correo electrónico" />
        <input type="password" placeholder="Contraseña" />
        <input type="password" placeholder="Repetir contraseña" />
        <div className="modal__buttons">
          <button className="btn btn-register">Crear cuenta</button>
          <button className="btn btn-cancel" onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default Register;
