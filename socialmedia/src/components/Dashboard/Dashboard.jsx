import React, { useEffect, useState } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import logo from "../../assets/logo2.png"; 
import "./Dashboard.scss";

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMyPosts, setShowMyPosts] = useState(false);

  const addPostToDashboard = (newPost) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };

  useEffect(() => {
    loadAllPosts();
  }, []);

  const loadAllPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:5000/api/posts", {
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Error al cargar los posts");
      const data = await response.json();
      setPosts(data.posts);
      setShowMyPosts(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadMyPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No se encontró token en localStorage");

      const response = await fetch("http://localhost:5000/api/posts/mine", {
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Error al cargar tus zumbidos: ${response.status} ${text}`);
      }

      const data = await response.json();
      setPosts(data.posts);
      setShowMyPosts(true);
    } catch (err) {
      setError(err.message);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <Header addPostToDashboard={addPostToDashboard} />

      <nav className="dashboard__nav">
        <button
          className="dashboard__nav-link"
          onClick={loadMyPosts}
        >
          Tus Zumbidos
        </button>
        <button
          className="dashboard__nav-link"
          onClick={loadAllPosts}
        >
          Seguidos
        </button>
      </nav>

      <div className="dashboard__posts">
        {loading && <p>Cargando posts...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {!loading && !error && posts.length === 0 && (
          <p>{showMyPosts ? "No tienes zumbidos todavía 🐝" : "No hay posts todavía 🐝"}</p>
        )}
        {!loading && !error && posts.map((post, index) => (
          <div className="dashboard__post" key={index}>
            <div className="dashboard__post-left">
              {post.author?.name || "@Anónimo"}
            </div>
            <div className="dashboard__post-center">
              <div className="dashboard__post-title">{post.title}</div>
              <div className="dashboard__post-content">{post.content}</div>
              {post.image && (
                <img src={post.image} alt="Imagen del post" className="dashboard__post-image" />
              )}
            </div>
            <div className="dashboard__post-right">
              <img src={logo} alt="Seguir" className="dashboard__post-follow" />
            </div>
          </div>
        ))}
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
