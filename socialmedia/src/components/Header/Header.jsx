import React, { useEffect, useState } from "react";
import "./Header.scss";
import logo from "../../assets/logo.png";
import { FiMail, FiEdit2 } from "react-icons/fi"; 
import { useSelector, useDispatch } from "react-redux";
import { setUserFromStorage, logout } from "../../features/UserSlice";
import Post from "../Post/Post";
import { useNavigate } from "react-router-dom"; 

const Header = ({ addPostToDashboard }) => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [showPostModal, setShowPostModal] = useState(false);
  const navigate = useNavigate(); 

  useEffect(() => {
    dispatch(setUserFromStorage());
  }, [dispatch]);

  return (
    <header className="header">
      <div className="header__left">
        <img 
          src={logo} 
          alt="Beely Logo" 
          className="header__logo" 
          onClick={() => navigate("/dashboard")}
        />
      </div>

      <div className="header__center">
        {user && (
          <button
            className="header__newpost-btn"
            onClick={() => setShowPostModal(true)}
          >
            <FiEdit2 size={20} />
          </button>
        )}
        <input
          type="text"
          placeholder="Buscar un buzz..."
          className="header__search"
        />
      </div>

      <div className="header__right">
        <FiMail className="header__icon" />
        {user ? (
          <span className="header__user">
            {user.name} 
            <button 
              className="header__logout-btn" 
              onClick={() => dispatch(logout())}
            >
              Salir
            </button>
          </span>
        ) : (
          <span className="header__login">Login</span>
        )}
      </div>

      {showPostModal && (
        <Post 
          onClose={() => setShowPostModal(false)} 
          addPostToDashboard={addPostToDashboard} 
        />
      )}
    </header>
  );
};

export default Header;
