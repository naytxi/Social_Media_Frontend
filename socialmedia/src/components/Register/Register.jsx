import React, { useState } from "react";
import "./Register.scss";
import logo from "../../assets/logo3.png";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../features/UserSlice";
import { useNavigate } from "react-router-dom";

const Register = ({ onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser(formData)).then((res) => {
      if (!res.error) {
        onClose();       
        navigate("/dashboard"); 
      }
    });
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <img src={logo} alt="Beely Logo" className="modal__logo" />
        <h2>Crear cuenta</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Nombre de usuario"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="age"
            placeholder="Edad"
            value={formData.age}
            onChange={handleChange}
            required
          />

          {error && <p className="error">{error}</p>}
          <div className="modal__buttons">
            <button type="submit" className="btn btn-register" disabled={loading}>
              {loading ? "Registrando..." : "Crear cuenta"}
            </button>
            <button type="button" className="btn btn-cancel" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
