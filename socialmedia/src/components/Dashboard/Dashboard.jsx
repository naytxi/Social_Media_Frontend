import React, { useEffect, useState } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import EditPostModal from "../Edit/EditPostModal";   
import DeletePostModal from "../Delete/DeletePostModal"; 
import logo from "../../assets/logo2.png"; 
import "./Dashboard.scss";

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMyPosts, setShowMyPosts] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [deletingPost, setDeletingPost] = useState(null);

  const addPostToDashboard = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  useEffect(() => {
    loadAllPosts();
  }, []);

  const loadAllPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:5000/api/posts", {
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Error al cargar los posts");

      const data = await res.json();
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

      const res = await fetch("http://localhost:5000/api/posts/mine", {
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      if (!res.ok) throw new Error("Error al cargar tus zumbidos");

      const data = await res.json();
      setPosts(data.posts);
      setShowMyPosts(true);
    } catch (err) {
      setError(err.message);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async (postId, alreadyLiked) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Debes iniciar sesión para dar zumbidos");

      const endpoint = alreadyLiked
        ? `http://localhost:5000/api/posts/${postId}/unlike`
        : `http://localhost:5000/api/posts/${postId}/like`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      if (!res.ok) throw new Error("Error al dar/quitar zumbido");

      const data = await res.json();
      setPosts((prev) =>
        prev.map((p) => (p._id === postId ? data.post : p))
      );
    } catch (err) {
      alert(err.message);
    }
  };

  const getUserId = () => {
    try {
      const token = localStorage.getItem("token");
      return JSON.parse(atob(token.split(".")[1])).id;
    } catch {
      return null;
    }
  };

  const userId = getUserId();

  return (
    <div className="dashboard">
      <Header addPostToDashboard={addPostToDashboard} />

      <nav className="dashboard__nav">
        <button className="dashboard__nav-link" onClick={loadMyPosts}>
          Tus Zumbidos
        </button>
        <button className="dashboard__nav-link" onClick={loadAllPosts}>
          Seguidos
        </button>
      </nav>

      <div className="dashboard__posts">
        {loading && <p>Cargando posts...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {!loading && !error && posts.length === 0 && (
          <p>{showMyPosts ? "No tienes zumbidos todavía 🐝" : "No hay posts todavía 🐝"}</p>
        )}

        {!loading && !error && posts.map((post) => {
          const alreadyLiked = post.likes?.includes(userId);

          return (
            <div className="dashboard__post" key={post._id}>
              
              <div className="dashboard__post-left">
                {post.author?.name || "@Anónimo"}

                {post.author?._id === userId && (
                  <div className="dashboard__post-actions">
                    <span
                      className="dashboard__icon edit"
                      onClick={() => setEditingPost(post)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM21.41 6.34a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                      </svg>
                    </span>
                    <span
                      className="dashboard__icon delete"
                      onClick={() => setDeletingPost(post)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-4.5l-1-1z"/>
                      </svg>
                    </span>
                  </div>
                )}
              </div>

              <div className="dashboard__post-center">
                <div className="dashboard__post-title">{post.title}</div>
                <div className="dashboard__post-content">{post.content}</div>
                {post.image && (
                  <img
                    src={post.image}
                    alt="Imagen del post"
                    className="dashboard__post-image"
                  />
                )}
              </div>

              <div className="dashboard__post-right">
                <img
                  src={logo}
                  alt="Like"
                  className={`dashboard__post-follow ${alreadyLiked ? "liked" : ""}`}
                  onClick={() => toggleLike(post._id, alreadyLiked)}
                />
                <div className="dashboard__post-likes">
                  {post.likes?.length || 0}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {editingPost && (
        <EditPostModal
          post={editingPost}
          onClose={() => setEditingPost(null)}
          onSave={(updatedPost) => {
            setPosts((prev) =>
              prev.map((p) => (p._id === updatedPost._id ? updatedPost : p))
            );
            setEditingPost(null);
          }}
        />
      )}

      {deletingPost && (
        <DeletePostModal
          post={deletingPost}
          onClose={() => setDeletingPost(null)}
          onDelete={() => {
            setPosts((prev) =>
              prev.filter((p) => p._id !== deletingPost._id)
            );
            setDeletingPost(null);
          }}
        />
      )}

      <Footer />
    </div>
  );
};

export default Dashboard;
