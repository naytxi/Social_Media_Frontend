import React from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import logo from "../../assets/logo2.png"; 
import "./Dashboard.scss";

const posts = [
  {
    nick: "@AbejaCuriosa",
    content: "Hoy descubrí que las abejas pueden reconocer caras humanas. #Abejas #Curiosidades"
  },
  {
    nick: "@ZumbaMaster",
    content: "Preparando nuevos zumbidos para la colmena. #Buzz #Colmena"
  },
  {
    nick: "@HoneyLover",
    content: "El mejor consejo para cuidar abejas: paciencia y amor. #Apicultura #Tips"
  }
];

const Dashboard = () => {
  return (
    <div className="dashboard">
      <Header />

      <nav className="dashboard__nav">
        <a href="#" className="dashboard__nav-link">Tus Zumbidos</a>
        <a href="#" className="dashboard__nav-link">Seguidos</a>
      </nav>

      <div className="dashboard__posts">
        {posts.map((post, index) => (
          <div className="dashboard__post" key={index}>
            <div className="dashboard__post-nick">{post.nick}</div>
            <div className="dashboard__post-content">{post.content}</div>
            <img src={logo} alt="Seguir" className="dashboard__post-follow" />
          </div>
        ))}
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
