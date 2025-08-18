import React, { useState } from "react";
import "./Post.scss";
import { useSelector } from "react-redux";

const Post = ({ onClose, addPostToDashboard }) => {
  const { user } = useSelector((state) => state.user);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!title || !content) {
      setError("El título y contenido son obligatorios");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token"); 
      const response = await fetch("http://localhost:5000/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content, image }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Error al crear el post");
      } else {
        addPostToDashboard(data.post); 
        onClose();
      }
    } catch (err) {
      setError("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-modal">
      <div className="post-modal__content">
        <button className="post-modal__close" onClick={onClose}>
          &times;
        </button>
        <h2>Crear un nuevo Zumbido</h2>
        {error && <p className="post-modal__error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Contenido"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
          <input
            type="text"
            placeholder="URL de imagen (opcional)"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Publicando..." : "Publicar"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Post;
