import React, { useState } from "react";
import "./Login.scss";
import logo from "../../assets/logo3.png";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../features/UserSlice";
import { useNavigate } from "react-router-dom";

const Login = ({ onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.user);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    
    const result = await dispatch(loginUser({ email, password }));

    if (result.meta.requestStatus === "fulfilled") {
      
      localStorage.setItem("token", result.payload.token);

      onClose();
      navigate("/dashboard");
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <img src={logo} alt="Beely Logo" className="modal__logo" />
        <h2>Iniciar sesión</h2>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="modal__error">{error}</p>}
        <div className="modal__buttons">
          <button
            className="btn btn-login"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Cargando..." : "Iniciar sesión"}
          </button>
          <button className="btn btn-cancel" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
