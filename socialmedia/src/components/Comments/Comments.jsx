import React, { useState, useEffect } from "react";
import axios from "axios";
import "./comments.scss";

const Comments = ({ postId, token }) => {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const fetchComments = async () => {
    if (!postId) return;
    setLoading(true);
    setError(null);

    try {
      const res = await axios.get(
        `http://localhost:5000/api/posts/${postId}/comments`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
     
      const sortedComments = res.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setComments(sortedComments);
    } catch (err) {
      console.error("Error al obtener comentarios", err);
      setError("No se pudieron cargar los comentarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
    const interval = setInterval(fetchComments, 10000); 
    return () => clearInterval(interval);
  }, [postId, token]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      const res = await axios.post(
        `http://localhost:5000/api/posts/${postId}/comments`,
        { content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    
      setComments((prev) => [res.data, ...prev]);
      setContent("");
    } catch (err) {
      console.error("Error al crear comentario", err);
      setError("No se pudo enviar el comentario");
    }
  };

  return (
    <div className="comments-wrapper">
      <div className="comments">
        <h4 className="comments__title">Comentarios</h4>

        <form className="comments__form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Escribe un comentario..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="comments__input"
          />
          <button type="submit" className="comments__button">
            Enviar
          </button>
        </form>

        {loading && <p>Cargando comentarios...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        <div className="comments__list">
          {comments.length === 0 && !loading ? (
            <p className="comments__empty">Sé el primero en comentar</p>
          ) : (
            comments.map((c) => (
              <div key={c._id} className="comments__item">
                <span className="comments__author">
                  {c.author?.name || c.author?.username || "Usuario"}
                </span>
                <p className="comments__content">{c.content}</p>
                <span className="comments__date">
                  {new Date(c.createdAt).toLocaleString()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Comments;
