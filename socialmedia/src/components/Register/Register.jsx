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
    profilePic: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePic") {
      setFormData({ ...formData, profilePic: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("age", formData.age);
    if (formData.profilePic) data.append("profilePic", formData.profilePic);

    dispatch(registerUser(data)).then((res) => {
      if (!res.error) {
        onClose();
        navigate("/dashboard");
      }
    });
  };

  return (
    <div className="register-modal-backdrop">
      <div className="register-modal">
        <img src={logo} alt="Beely Logo" className="register-modal__logo" />
        <h2>Crear cuenta</h2>

        <form onSubmit={handleSubmit} encType="multipart/form-data">
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
          <input
            type="file"
            name="profilePic"
            accept="image/*"
            onChange={handleChange}
          />

          {error && <p className="register-modal__error">{error}</p>}

          <div className="register-modal__buttons">
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
